import got from 'got'
import fs from 'fs'
import path from 'path'
import { paths } from './paths'

interface FileItem {
  url: string
  path: string
  name: string
}

const files: Record<string, FileItem> = {
  paper: {
    url: 'https://api.papermc.io/v2/projects/paper/versions/1.20.1/builds/177/downloads/paper-1.20.1-177.jar',
    path: paths.server.path,
    name: 'server.jar',
  },
}

async function downloadFile(file: FileItem) {
  const result = await got(file.url, { method: 'GET' })

  if (!result) throw new Error(`Unable to get ${file.name}`)

  if (!fs.existsSync(file.path)) {
    fs.mkdirSync(file.path)
  }

  fs.writeFileSync(path.join(file.path, file.name), result.rawBody)
}

async function downloadFiles() {
  await Promise.all(Object.keys(files).map((key) => downloadFile(files[key])))
}

function acceptEula() {
  fs.writeFileSync(path.join(paths.server.path, 'eula.txt'), 'eula=true')
}

async function main() {
  await downloadFiles()
  acceptEula()
}

// eslint-disable-next-line
new Promise(async (resolve) => {
  console.log("By running this script, you agree to Minecraft's EULA! CTRL-C to cancel.")

  await new Promise((resolve) => setTimeout(resolve, 1000))

  await main()

  resolve(true)
}).catch((err) => console.log(err))
