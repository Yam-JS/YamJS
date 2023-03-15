import fs from 'fs'
import path from 'path'
import { paths } from './paths'
import { spawnSync } from 'child_process'

function runGradle() {
  // TODO: Add OS check
  // create a new process to run gradle
  const spawn = spawnSync('gradlew.bat', ['shadowJar'], {
    cwd: paths.yamPlugin.path,
  })

  // if the process exited with an error
  if (spawn.error) {
    throw spawn.error
  }

  // if the process exited with a non-zero exit code
  if (spawn.status !== 0) {
    throw new Error(spawn.stderr.toString())
  }

  // if the process exited with a zero exit code
  if (spawn.status === 0) {
    console.log(spawn.stdout.toString())
  }
}

function copyPluginJar() {
  const src = path.join(paths.yamPlugin.path, 'paper', 'build', 'libs', 'yamjs-paper-all.jar')
  const dest = path.join(paths.server.plugins.path, 'yamjs-paper-all.jar')

  if (!fs.existsSync(paths.server.plugins.path)) {
    fs.mkdirSync(paths.server.plugins.path, {
      recursive: true,
    })
  }

  fs.copyFileSync(src, dest)
}

export async function setupYam() {
  runGradle()
  copyPluginJar()
}

// check is this file is being run directly
if (require.main === module) {
  new Promise(async (resolve) => {
    await setupYam()

    resolve(true)
  }).catch((err) => console.log(err))
}
