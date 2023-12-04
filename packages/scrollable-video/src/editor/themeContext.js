import { createContext } from 'react'

export const themeEnum = {
  twreporter: 'twreporter',
  kids: 'kids',
}

export const ThemeContext = createContext(themeEnum.twreporter)
