const fs = require('fs')

const cwd = process.cwd()

const rm = (path) => {
  if (fs.existsSync(path)) {
    fs.rmSync(path, { recursive: true, force: true })
  }
}

const clean = (dir) => {
  rm(`${dir}/node_modules`)
  rm(`${dir}/build`)
  rm(`${dir}/dist`)
  rm(`${dir}/.testcache`)
}

const cleanRoot = () => clean(cwd)

const cleanWorkSpaces = () => {
  const workspaces = ['./packages']

  workspaces.forEach((workspace) => {
    fs.readdir(workspace, (err, folders) => {
      folders.forEach((folder) => {
        clean(`${cwd}/${workspace}/${folder}`)
      })

      if (err) {
        throw err
      }
    })
  })
}

cleanRoot()
cleanWorkSpaces()
