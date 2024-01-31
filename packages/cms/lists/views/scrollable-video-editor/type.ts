import { RawDraftContentState } from 'draft-js'

export enum WidthEnum {
  WIDE = 'wide',
  NARROW = 'narrow',
}

export enum AlignmentEnum {
  RIGHT = 'right',
  LEFT = 'left',
  CENTER = 'center',
}

export type CaptionState = {
  rawContentState: RawDraftContentState
  startTime: number
  alignment?: AlignmentEnum
  width?: WidthEnum
}
