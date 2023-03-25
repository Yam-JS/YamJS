import got from 'got'
import { OpenAIApi, Configuration } from 'openai'
import readline from 'readline'
import fs from 'fs'

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

const openAiConfig = new Configuration({
  apiKey: '',
})

const openai = new OpenAIApi(openAiConfig)

const fetchAiResponse = (message: string) => {
  return openai.createChatCompletion({
    model: 'gpt-3.5-turbo',

    messages: [
      {
        role: 'system',
        content:
          'The user will ask you to generate a solution in JavaScript for a GraalJS/GraalVM (JS) Environment. You can ' +
          'reference java objects by using `const Bukkit = Java.type("org.bukkit.Bukkit")`. ' +
          'The solution will not have access to NodeJS or the browser, it is only within Graal. ' +
          'If using primitives, they will default to JavaScript primitives, not java. If you need to use Java primitives, ' +
          'you need to explicity reference them. For example, `const text = "mytext"; console.log(text.length)`' +
          'When responding, write only code. Do not provide an explanation.',
      },
      {
        role: 'user',
        content: message,
      },
    ],
    max_tokens: 2000,
  })
}

rl.question('File name: ', (answer) => {
  rl.question('Prompt? ', (prompt) => {
    console.log('answer', answer)
    console.log('prompt', prompt)

    rl.close()

    fetchAiResponse(prompt).then((response) => {
      let content = response.data.choices[0].message?.content

      content = content?.replace('```js', '').replace('```javascript', '').replace(/```/g, '')

      fs.writeFileSync('test.ts', content ?? '')
    })
  })
})
