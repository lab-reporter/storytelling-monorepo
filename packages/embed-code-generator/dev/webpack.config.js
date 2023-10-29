/* eslint-disable */
const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path')
const port = process.env.PORT || 8080

module.exports = {
  mode: 'development',
  entry: {
    main: path.resolve(__dirname, './entry.js'),
  },
  devServer: {
    hot: false,
    host: '0.0.0.0',
    port,
    static: [
      {
        directory: path.join(__dirname),
      },
      {
        directory: path.join(__dirname, '../dist'),
        publicPath: '/dist',
      },
    ],
    headers: { 'Access-Control-Allow-Origin': '*' },
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env',
              [
                '@babel/preset-react',
                { development: true, runtime: 'automatic' },
              ],
            ],
          },
        },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, './index.html'),
    }),
  ],
  devtool: 'eval-source-map',
}
