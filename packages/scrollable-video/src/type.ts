import { RawDraftContentState } from 'draft-js'

export enum AlignmentEnum {
  RIGHT = 'right',
  LEFT = 'left',
  CENTER = 'center',
}

export enum WidthEnum {
  WIDE = 'wide',
  NARROW = 'narrow',
}

export type CaptionState = {
  id?: string
  rawContentState: RawDraftContentState
  startTime: number
  alignment?: AlignmentEnum
  width?: WidthEnum
  customCss?: string
}

export enum ThemeEnum {
  DARK_MODE = 'dark_mode',
  LIGHT_MODE = 'light_mode',
}
