module.exports = {
  ignore: ['node_modules/**/*'],
  presets: [
    [
      '@babel/preset-typescript',
      {
        allowDeclareFields: true,
      },
    ],
  ],
  plugins: ['babel-plugin-transform-graal-imports'],
}
