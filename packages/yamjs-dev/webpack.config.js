/* global __dirname, require, module */
const http = require('http')
const webpack = require('webpack')
const path = require('path')

const getEnv = (env) => (env.dev ? 'development' : 'production')
const isDev = (env) => getEnv(env) === 'development'

const createConfig = (env) => ({
  mode: getEnv(env),
  entry: __dirname + '/src/index.ts',
  devtool: 'source-map',
  watch: isDev(env),
  output: {
    path: isDev(env) ? path.join(__dirname, 'server/plugins/yamjs') : path.join(__dirname, 'dist'),
    filename: 'index.js',
    library: 'test',
    libraryTarget: 'commonjs',
    umdNamedDefine: true,
    globalObject: "typeof self !== 'undefined' ? self : this",
  },
  module: {
    rules: [
      {
        test: /(\.js|\.jsx|\.ts|\.tsx)$/,
        use: {
          loader: 'babel-loader',
        },
        exclude: /(node_modules|bower_components)/,
      },
    ],
  },
  externals: {
    http: 'http',
  },
  resolve: {
    alias: {
      '@yam-js/core': path.resolve(__dirname, '..', './yamjs-core/src'),
    },
    extensions: ['.json', '.js', '.ts', '.jsx', '.tsx'],
  },
  plugins: [
    new webpack.EnvironmentPlugin({
      NODE_ENV: getEnv(env),
    }),
  ],
})

module.exports = createConfig
