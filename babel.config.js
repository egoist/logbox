module.exports = {
  presets: [
    ['@babel/preset-typescript', {
      jsxPragma: 'h'
    }],
    [
      '@babel/preset-env',
      {
        modules: false,
      },
    ],
  ],
  plugins: [
    '@babel/plugin-proposal-optional-chaining',
    '@babel/plugin-proposal-class-properties',
    [
      '@babel/plugin-transform-react-jsx',
      {
        pragma: 'h',
      },
    ],
  ],
}
