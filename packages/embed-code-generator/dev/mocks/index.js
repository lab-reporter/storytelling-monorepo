// import dualSlides from './dual-slides/index.js'
import karaoke from './karaoke/index.js'
// import threeStoryPoints from './three-story-points/index.js'
import scrollableVideo from './scrollable-video/index.js'
import scrollToAudio from './scroll-to-audio/index.js'
import { pkgNames } from '../../src/build-code/constants'

export default {
  [pkgNames.karaoke]: karaoke,
  [pkgNames.scrollableVideo]: scrollableVideo,
  [pkgNames.scrollToAudio]: scrollToAudio,
  // @TODO add subtitled-audio
}
