import { colorHex } from './constants'

export enum ThemeColorEnum {
  RED = 'red',
  BLUE = 'blue',
  YELLOW = 'yellow',
}

export function getColorHex(themeColor: ThemeColorEnum) {
  switch (themeColor) {
    case ThemeColorEnum.RED: {
      return colorHex.red
    }
    case ThemeColorEnum.YELLOW: {
      return colorHex.yellow
    }
    case ThemeColorEnum.BLUE:
    default: {
      return colorHex.blue
    }
  }
}
