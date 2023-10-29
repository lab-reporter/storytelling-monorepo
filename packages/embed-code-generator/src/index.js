import path from 'path'
import { buildEmbeddedCode } from './build-code'

export default {
  buildEmbeddedCode,
  loadWebpackAssets: () => {
    return require(path.resolve(__dirname, '../dist/webpack-assets.json'))
  },
}
