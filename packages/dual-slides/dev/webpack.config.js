import * as url from 'url'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import path from 'path'

const __dirname = url.fileURLToPath(new URL('.', import.meta.url))

export default {
  mode: 'development',
  entry: {
    main: path.resolve(__dirname, './entry.js'),
  },
  output: {
    path: path.resolve(__dirname, './dist'),
  },
  devServer: {
    hot: false,
    host: '0.0.0.0',
    port: 8080,
    static: {
      directory: path.join(__dirname),
    },
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
