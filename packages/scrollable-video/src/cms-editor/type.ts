import { AlignmentEnum, CaptionState, WidthEnum } from '../type'

export { AlignmentEnum, WidthEnum }

export type { CaptionState }

export enum ThemeEnum {
  DARK_MODE = 'dark_mode',
  LIGHT_MODE = 'light_mode',
}

export type ConfigProp = {
  theme: ThemeEnum
  secondsPer100vh: number
}
