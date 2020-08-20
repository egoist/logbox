const path = require('path')
const { DefinePlugin } = require('webpack')
const SizePlugin = require('size-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

const isProd = process.argv.includes('production')

/** @type {import('webpack').Configuration} */
module.exports = {
  devtool: isProd ? false : 'sourcemap',
  stats: 'errors-only',
  entry: {
    content: './src/content',
    script: './src/script',
    options: './src/options',
  },
  output: {
    path: path.join(__dirname, 'extension/dist'),
    filename: '[name].js',
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json', '.css'],
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['vue-style-loader', 'css-loader'],
      },
      {
        test: [/\.jsx?$/, /\.tsx?$/],
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true,
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new SizePlugin(),
    new CopyWebpackPlugin([
      {
        from: 'public',
        to: '.',
      },
    ]),
    new DefinePlugin({
      __DEV__: process.argv.includes('development'),
    }),
  ],
}
