import { DraftInlineStyle } from 'draft-js'

export const bgColorPrefix = 'BACKGROUND_COLOR_'
export const fontColorPrefix = 'FONT_COLOR_'

export const customStyleFn = (style: DraftInlineStyle) => {
  return style.reduce((cssObject: Record<string, string> = {}, styleName) => {
    if (styleName?.startsWith(bgColorPrefix)) {
      cssObject['backgroundColor'] = styleName.split(bgColorPrefix)[1]
    }

    if (styleName?.startsWith(fontColorPrefix)) {
      cssObject['color'] = styleName.split(fontColorPrefix)[1]
    }
    return cssObject
  }, {})
}

export default customStyleFn
