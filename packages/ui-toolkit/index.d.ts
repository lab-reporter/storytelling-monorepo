import { useMuted, useIOSCornerCaseFix } from './src/hooks'
import { Hint } from './src/twreporter/index'
import { Hint as KidsHint } from './src/kids/index'

export type Hooks = {
  useMuted: useMuted
  useIOSCornerCaseFix: useIOSCornerCaseFix
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
