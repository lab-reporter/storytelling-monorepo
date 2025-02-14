import {
  useMuted,
  useIOSCornerCaseFix,
  testPlayOtherMediaElements,
} from './src/hooks'
import { Hint } from './src/twreporter/index'
import { Hint as KidsHint } from './src/kids/index'

export type Hooks = {
  useMuted: useMuted
  useIOSCornerCaseFix: useIOSCornerCaseFix
  testPlayOtherMediaElements: testPlayOtherMediaElements
}

export type Twreporter = {
  Hint: Hint
}

export type Kids = {
  Hint: KidsHint
}

export const hooks: Hooks
export const twreporter: Twreporter
export const kids: Kids
