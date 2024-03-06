import path from 'path'
import {
  buildEmbeddedCode,
  buildKaraokeEmbedCode,
  buildScrollToAudioEmbedCode,
  buildScrollableVideoEmbedCode,
  buildSubtitledAudioEmbedCode,
} from './build-code'

export default {
  buildEmbeddedCode,
  buildKaraokeEmbedCode,
  buildScrollToAudioEmbedCode,
  buildScrollableVideoEmbedCode,
  buildSubtitledAudioEmbedCode,
  loadWebpackAssets: () => {
    return require(path.resolve(__dirname, '../dist/webpack-assets.json'))
  },
}
