import User from './user'
import Audio from './audio'
import Video from './video'
import Photo from './photo'
import Karaoke from './karaoke'
import ThreeStoryPoints from './three-story-points'
import DualSlides from './dual-slides'
// import Helper from './helper'

export const listDefinition = {
  User,
  Audio,
  Video,
  Photo,
  Karaoke,
  ThreeStoryPoint: ThreeStoryPoints,
  DualSlide: DualSlides,
}
