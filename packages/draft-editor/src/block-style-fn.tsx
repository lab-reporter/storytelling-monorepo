import { TextAlignEnum, TextAlignPropertyName } from './buttons/text-align'
import { ContentBlock } from 'draft-js'

export enum TextAlignCssNameEnum {
  RIGHT = 'text-align-right',
  CENTER = 'text-align-center',
}

export const blockStyleFn = (block: ContentBlock) => {
  const blockData = block.getData()
  let classNames = ''
  const textAlign = blockData.get(TextAlignPropertyName)

  if (textAlign === TextAlignEnum.RIGHT) {
    classNames += TextAlignCssNameEnum.RIGHT
  } else if (textAlign === TextAlignEnum.CENTER) {
    classNames += TextAlignCssNameEnum.CENTER
  }

  return classNames
}
