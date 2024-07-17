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

export enum ThemeEnum {
  DARK_MODE = 'dark_mode',
  LIGHT_MODE = 'light_mode',
}

export type CaptionProp = {
  rawContentState: RawDraftContentState
  alignment?: AlignmentEnum
  width?: WidthEnum
  customCss?: string
}
