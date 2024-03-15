import path from 'path'
import {
  buildEmbedCode,
  buildKaraokeEmbedCode,
  buildScrollToAudioEmbedCode,
  buildScrollableVideoEmbedCode,
  buildSubtitledAudioEmbedCode,
  buildMutedHintEmbedCode,
} from './build-code'

export default {
  buildEmbedCode,
  buildKaraokeEmbedCode,
  buildScrollToAudioEmbedCode,
  buildScrollableVideoEmbedCode,
  buildSubtitledAudioEmbedCode,
  buildMutedHintEmbedCode,
  loadWebpackAssets: () => {
    return require(path.resolve(__dirname, '../dist/webpack-assets.json'))
  },
}
