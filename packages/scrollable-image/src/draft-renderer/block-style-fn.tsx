import { ContentBlock } from 'draft-js'

export const blockStyleFn = (block: ContentBlock) => {
  const blockData = block.getData()
  let classNames = ''
  const textAlign = blockData.get('textAlign')

  if (textAlign === 'right') {
    classNames += 'text-align-right'
  } else if (textAlign === 'center') {
    classNames += 'text-align-center'
  }

  return classNames
}
