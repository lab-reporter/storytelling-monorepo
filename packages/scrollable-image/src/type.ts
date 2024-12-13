export type URL = string

export type ImgObj = {
  url: URL
}

export type CaptionPosition = {
  // distance from `ScrollableImage` block's left/top/right/bottom border to the caption text
  left?: string
  top?: string
  right?: string
  bottom?: string
}

export type Caption = {
  data: string
  position: CaptionPosition
  width?: string
  height?: string
}
