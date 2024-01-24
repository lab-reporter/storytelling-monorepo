import { createContext } from 'react'

export enum ThemeEnum {
  TWREPORTER = 'twreporter',
  KIDS = 'kids',
}

export const ThemeContext = createContext(ThemeEnum.TWREPORTER)
