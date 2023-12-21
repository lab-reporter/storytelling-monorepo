import User from './user'
import Audio from './audio'
import Video from './video'
import Photo from './photo'
import Karaoke from './karaoke'
import SubtitledAudio from './subtitled-audio'
import ThreeStoryPoints from './three-story-points'
import DualSlides from './dual-slides'
import ScrollableVideo from './scrollable-video'
// import Helper from './helper'

export const listDefinition = {
  User,
  Audio,
  Video,
  Photo,
  Karaoke,
  SubtitledAudio,
  ThreeStoryPoint: ThreeStoryPoints,
  DualSlide: DualSlides,
  ScrollableVideo,
}
