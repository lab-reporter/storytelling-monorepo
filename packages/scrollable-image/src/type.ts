import { RawDraftContentState } from 'draft-js'

export type URL = string

export type ImgObj = {
  url: URL
}

export type CaptionPosition = {
  // distance from `ScrollableImage` block's left/top border to the caption text
  left?: string
  top?: string
}

export type CaptionData = {
  id?: string
  position: CaptionPosition
  width?: string
  height?: string
  rawContentState: RawDraftContentState
}
