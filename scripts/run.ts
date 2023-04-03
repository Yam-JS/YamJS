import { spawn } from 'child_process'
import fs from 'fs'
import path from 'path'

const [commandName, ...targetPackages] = process.argv.slice(2)
const root = process.cwd()

const packages: {
  name: string
  path: string
}[] = []
if (targetPackages.join('') === 'all') {
  packages.length = 0
  // get all packages
  fs.readdirSync(path.resolve(root, 'packages')).forEach((item) => {
    if (!fs.statSync(path.resolve(root, 'packages', item)).isDirectory()) return

    // read package.json and get name
    const { name } = JSON.parse(
      fs.readFileSync(path.resolve(root, 'packages', item, 'package.json'), 'utf-8')
    )

    packages.push({ path: item, name })
  })
} else {
  throw new Error('Not implemented')
}

const getTargetPath = (item: string) => path.resolve(root, `packages/${item}/package.json`)

const getAllConcurrentCommands = () => {
  const conurrentCommands: {
    command: string
    item: string
  }[] = []
  for (const item of packages) {
    const { scripts } = JSON.parse(fs.readFileSync(getTargetPath(item.path), 'utf-8'))

    const keys = Object.keys(scripts).filter((key) => key.startsWith(`${commandName}`))

    for (const key of keys) {
      // ignore when it is "lint" when we have "lint:src" & "lint:tests"
      if (key === commandName && keys.length > 1) {
        continue
      }

      conurrentCommands.push({
        command: `${item.name} ${key}`,
        item: item.name,
      })
    }
  }

  return conurrentCommands
}

const getLines = (data) => {
  return data
    .toString()
    .replace(/\r\n|\n/g, '\n')
    .split('\n')
}

const writeToStream = (
  stream: NodeJS.WriteStream,
  streamBuffer: ReturnType<typeof createStreamBuffer>,
  prefix: string
) => {
  const lines = streamBuffer.getLines()

  for (const line of lines) {
    if (line) {
      if (line.includes('https://yarnpkg.com')) {
        continue
      }

      stream.write(prefix + line + '\n')
    }
  }
}

const createStreamBuffer = () => {
  let data = ''

  return {
    write: (chunk) => {
      data += chunk
    },
    getLines: (): string[] => {
      const lines = getLines(data)
      data = lines.pop() || '' // Keep the last incomplete line in the buffer
      return lines
    },
  }
}

const colors = ['\x1b[31m', '\x1b[32m', '\x1b[33m', '\x1b[34m', '\x1b[35m', '\x1b[36m', '\x1b[37m']
const reset = '\x1b[0m'
const failures: string[] = []
const promises: Promise<void>[] = []

let colorIndex = -1

const concurrentCommands = getAllConcurrentCommands()

for (const { command, item } of concurrentCommands) {
  const color = colors[++colorIndex % colors.length]

  promises.push(
    new Promise<void>((resolve, reject) => {
      const child = spawn(`yarn`, ['workspace', command], {
        shell: true,
        stdio: ['inherit', 'pipe', 'pipe'],
        env: {
          ...process.env,
          FORCE_COLOR: 'true',
        },
      })
      const prefix = `${color}[${item}]${reset} `

      const stdoutBuffer = createStreamBuffer()
      const stderrBuffer = createStreamBuffer()
      child.stdout?.on('data', (data) => {
        stdoutBuffer.write(data.toString())

        writeToStream(process.stdout, stdoutBuffer, prefix)
      })

      child.stderr?.on('data', (data) => {
        if (data.includes('Exit code: 1')) {
          return
        }
        stderrBuffer.write(data)
        writeToStream(process.stderr, stderrBuffer, prefix)
      })

      child.on('close', (code) => {
        if (stdoutBuffer.getLines().length) {
          writeToStream(process.stdout, stdoutBuffer, prefix)
        }
        if (stderrBuffer.getLines().length) {
          writeToStream(process.stderr, stderrBuffer, prefix)
        }

        if (code === 0) {
          resolve()
        } else {
          failures.push(item)
          reject()
        }
      })
    })
  )
}

Promise.allSettled(promises)
  .then(() => {
    if (failures.length) {
      console.log(`The following packages failed: ${failures.join(', ')}`)
      process.exit(1)
    }

    console.log('All done.')
    process.exit(0)
  })
  .catch(() => {
    console.log('Something failed.')
    process.exit(1)
  })
