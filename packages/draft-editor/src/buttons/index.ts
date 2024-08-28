import styled from 'styled-components'
import {
  buttonStyle,
  BlockStyleControls as _BlockStyleControls,
  InlineStyleControls as _InlineStyleControls,
} from './control-buttons'
import { BackgroundColorButton } from './bg-color'
import { EmbeddedCodeButton } from './embedded-code'
import { EnlargeButton } from './enlarge'
import { FontColorButton } from './font-color'
import { ImageButton } from './image'
import { ImageLinkButton } from './image-link'
import { LinkButton } from './link'
import { AnnotationButton } from './annotation'
import {
  TextAlignCenterButton,
  TextAlignRightButton,
  getTextAlignOfSelectionBlocks,
  TextAlignEnum,
} from './text-align'

export const withStyle = (Button: React.ComponentType<any>) => {
  return styled(Button)`
    ${buttonStyle}
  `
}

export const BlockStyleControls = _BlockStyleControls
export const InlineStyleControls = _InlineStyleControls
export const CustomLinkButton = withStyle(LinkButton)
export const CustomAnnotationButton = withStyle(AnnotationButton)
export const CustomEnlargeButton = styled(withStyle(EnlargeButton))`
  color: #999;
`
export const CustomImageButton = withStyle(ImageButton)
export const CustomImageLinkButton = withStyle(ImageLinkButton)
export const CustomEmbeddedCodeButton = withStyle(EmbeddedCodeButton)
export const CustomBackgroundColorButton = withStyle(BackgroundColorButton)
export const CustomFontColorButton = withStyle(FontColorButton)
export const CustomTextAlignCenterButton = withStyle(TextAlignCenterButton)
export const CustomTextAlignRightButton = withStyle(TextAlignRightButton)

export { getTextAlignOfSelectionBlocks, TextAlignEnum }
