import path from 'path'

const createPaths = () => {
  const root = path.join(__dirname, '..')
  const server = path.join(root, 'server')
  const plugins = path.join(server, 'plugins')

  return {
    root,
    deps: {
      path: path.join(root, 'deps'),
    },
    depsPlugins: {
      path: path.join(root, 'depsPlugins'),
    },
    server: {
      path: server,
      plugins: {
        path: plugins,
        yamJS: {
          path: path.join(plugins, 'yamjs'),
        },
      },
    },
    yamPlugin: {
      path: path.join(root, '..', 'yamjs-plugin'),
    },
  }
}

export const paths = createPaths()
