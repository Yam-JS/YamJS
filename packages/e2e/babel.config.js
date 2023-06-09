module.exports = {
  ignore: ['node_modules/**/*'],
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          esmodules: true,
        },
      },
    ],
    [
      '@babel/preset-typescript',
      {
        allowDeclareFields: true,
      },
    ],
  ],
  plugins: [
    '@babel/plugin-proposal-class-properties',
    'babel-plugin-add-module-exports',
    '@babel/plugin-transform-classes',
    ['babel-plugin-transform-graal-imports'],
  ],
}
