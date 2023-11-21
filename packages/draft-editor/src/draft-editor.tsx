import React from 'react'
import buttonNames from './buttons/bt-names'
import styled, { css } from 'styled-components'
import {
  ContentBlock,
  DraftBlockType,
  DraftEditorCommand,
  Editor,
  EditorState,
  KeyBindingUtil,
  RichUtils,
  getDefaultKeyBinding,
} from 'draft-js'

import {
  BackgroundColorButton,
  customStylePrefix as bgColorPrefix,
} from './buttons/bg-color'
import { BlockquoteButton } from './buttons/blockquote'
import { DividerButton } from './buttons/divider'
import { EmbeddedCodeButton } from './buttons/embedded-code'
import { EnlargeButton } from './buttons/enlarge'
import {
  FontColorButton,
  customStylePrefix as fontColorPrefix,
} from './buttons/font-color'
import { ImageButton } from './buttons/image'
import { LinkButton } from './buttons/link'
import { SlideshowButton } from './buttons/slideshow'
import { ImageSelector } from './buttons/selector/image-selector'
import { NewsReadingButton } from './buttons/news-reading'
import { RichTextEditorProps } from './draft-editor.type'
import { atomicBlockRenderer } from './block-renderer-fn'
import {
  blockRenderMap,
  customStyleFn,
  decorator,
} from '@story-telling-reporter/draft-renderer'
import { createAnnotationButton } from './buttons/annotation'
import { createInfoBoxButton } from './buttons/info-box'

const buttonStyle = css<{
  isDisabled: boolean
  readOnly: boolean
  isActive?: boolean
}>`
  cursor: pointer;
  border-radius: 6px;
  text-align: center;
  font-size: 1rem;
  padding: 0 12px;
  margin: ${(props) => (props.isDisabled ? '0' : '0 0 10px 0')};
  background-color: #fff;
  border: solid 1px rgb(193, 199, 208);
  align-items: center;
  height: 40px;

  cursor: ${(props) => (props.readOnly ? 'not-allowed' : 'pointer')};
  color: ${(props) => {
    if (props.readOnly) {
      return '#c1c7d0'
    }
    if (props.isActive) {
      return '#3b82f6'
    }
    return '#6b7280'
  }};
  border: solid 1px
    ${(props) => {
      if (props.readOnly) {
        return '#c1c7d0'
      }
      if (props.isActive) {
        return '#3b82f6'
      }
      return '#6b7280'
    }};
  box-shadow: ${(props) => {
    if (props.readOnly) {
      return 'unset'
    }
    if (props.isActive) {
      return 'rgba(38, 132, 255, 20%)  0px 1px 4px '
    }
    return 'unset'
  }};
  transition: box-shadow 100ms linear;

  display: ${(props) => {
    if (props.isDisabled) {
      return 'none'
    }
    return 'inline-flex'
  }};
`

// TODO: refactor custom button
// Refactoring goal is to avoid `styled()` on every button,
// which is tedious and duplicate.
const CustomButton = styled.div`
  ${buttonStyle}
`

const CustomBlockquoteButton = styled(BlockquoteButton)`
  ${buttonStyle}
`

const CustomLinkButton = styled(LinkButton)`
  ${buttonStyle}
`

const CustomEnlargeButton = styled(EnlargeButton)`
  ${buttonStyle}
  color: #999;
`

const CustomImageButton = styled(ImageButton)`
  ${buttonStyle}
`

const CustomSlideshowButton = styled(SlideshowButton)`
  ${buttonStyle}
`

const CustomEmbeddedCodeButton = styled(EmbeddedCodeButton)`
  ${buttonStyle}
`

const CustomNewsReadingButton = styled(NewsReadingButton)`
  ${buttonStyle}
`

const CustomBackgroundColorButton = styled(BackgroundColorButton)`
  ${buttonStyle}
`

const CustomFontColorButton = styled(FontColorButton)`
  ${buttonStyle}
`

const CustomDividerButton = styled(DividerButton)`
  ${buttonStyle}
`

const DraftEditorWrapper = styled.div`
  /* Rich-editor default setting (.RichEditor-root)*/
  background: #fff;
  border: 1px solid #ddd;
  font-family: 'Georgia', serif;
  font-size: 14px;
  padding: 15px;

  /* Custom setting */
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
    'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji',
    'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';
  width: 100%;
  height: 100%;
  background: rgb(255, 255, 255);
  border-radius: 6px;
  padding: 0 1rem 1rem;
`

const DraftEditorControls = styled.div`
  padding-top: 1rem;
  width: 100%;
  background: rgb(255, 255, 255);
`

const DraftEditorControlsWrapper = styled.div`
  width: 100%;
  position: relative;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  padding-right: 45px;
`

const TextEditorWrapper = styled.div`
  /* Rich-editor default setting (.RichEditor-editor)*/
  border-top: 1px solid #ddd;
  cursor: text;
  font-size: 16px;
  margin-top: 10px;
`

const DraftEditorContainer = styled.div<{ isEnlarged: boolean }>`
  overflow-x: hidden;
  position: relative;
  margin-top: 4px;
  ${(props) =>
    props.isEnlarged
      ? css`
          position: fixed;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
          z-index: 30;
          padding-left: 3em;
          padding-right: 3em;
          background: rgba(0, 0, 0, 0.5);
        `
      : ''}
  ${DraftEditorWrapper} {
    ${(props) =>
      props.isEnlarged
        ? css`
            width: 100%;
            height: 100%;
            padding: 0 1rem 0;
            overflow: scroll;
          `
        : ''}
  }
  ${DraftEditorControls} {
    ${(props) =>
      props.isEnlarged
        ? css`
            position: sticky;
            top: 0;
            z-index: 12;
          `
        : ''}
  }
  ${DraftEditorControlsWrapper} {
    ${(props) =>
      props.isEnlarged
        ? css`
            overflow: auto;
            padding-bottom: 0;
          `
        : ''}
  }
  ${TextEditorWrapper} {
    ${(props) =>
      props.isEnlarged
        ? css`
            max-width: 100%;
            min-height: 100vh;
            padding-bottom: 0;
          `
        : ''}
  }
`

const EnlargeButtonWrapper = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  margin: 0;
`

type State = {
  isEnlarged: boolean
  readOnly: boolean
}

class RichTextEditor extends React.Component<RichTextEditorProps, State> {
  editorRef = null

  constructor(props: RichTextEditorProps) {
    super(props)
    this.state = {
      isEnlarged: false,
      readOnly: false,
    }
  }

  onChange = (editorState: EditorState) => {
    this.props.onChange(editorState)
  }

  handleKeyCommand = (
    command: DraftEditorCommand,
    editorState: EditorState
  ) => {
    const newState = RichUtils.handleKeyCommand(editorState, command)
    if (newState) {
      this.onChange(newState)
      return 'handled'
    }
    return 'not-handled'
  }

  handleReturn = (event: React.KeyboardEvent) => {
    if (KeyBindingUtil.isSoftNewlineEvent(event)) {
      const { onChange, editorState } = this.props
      onChange(RichUtils.insertSoftNewline(editorState))
      return 'handled'
    }

    return 'not-handled'
  }

  mapKeyToEditorCommand = (e: React.KeyboardEvent) => {
    if (e.keyCode === 9 /* TAB */) {
      const newEditorState = RichUtils.onTab(
        e,
        this.props.editorState,
        4 /* maxDepth */
      )
      if (newEditorState !== this.props.editorState) {
        this.onChange(newEditorState)
      }
      return null
    }
    return getDefaultKeyBinding(e)
  }

  toggleBlockType = (blockType: DraftBlockType) => {
    this.onChange(RichUtils.toggleBlockType(this.props.editorState, blockType))
  }

  toggleInlineStyle = (inlineStyle: string) => {
    this.onChange(
      RichUtils.toggleInlineStyle(this.props.editorState, inlineStyle)
    )
  }

  getEntityType = (editorState: EditorState) => {
    const contentState = editorState.getCurrentContent()
    const selection = editorState.getSelection()
    const startOffset = selection.getStartOffset()
    const startBlock = editorState
      .getCurrentContent()
      .getBlockForKey(selection.getStartKey())

    const endOffset = selection.getEndOffset()
    let entityInstance
    let entityKey

    if (!selection.isCollapsed()) {
      entityKey = startBlock.getEntityAt(startOffset)
    } else {
      entityKey = startBlock.getEntityAt(endOffset)
    }

    if (entityKey !== null) {
      entityInstance = contentState.getEntity(entityKey)
    }

    let entityType = ''
    if (entityInstance) {
      entityType = entityInstance.getType()
    }

    return entityType
  }

  toggleEnlarge = () => {
    this.setState({ isEnlarged: !this.state.isEnlarged })
  }

  blockRendererFn = (block: ContentBlock) => {
    const atomicBlockObj = atomicBlockRenderer(block)
    if (atomicBlockObj) {
      const onEditStart = () => {
        this.setState({
          // If custom block renderer requires mouse interaction,
          // [Draft.js document](https://draftjs.org/docs/advanced-topics-block-components#recommendations-and-other-notes)
          // suggests that we should temporarily set Editor
          // to readOnly={true} during the interaction.
          // In readOnly={true} condition, the user does not
          // trigger any selection changes within the editor
          // while interacting with custom block.
          // If we don't set readOnly={true},
          // it will cause some subtle bugs in InfoBox button.
          readOnly: true,
        })
      }
      const onEditFinish = ({
        entityKey,
        entityData,
      }: {
        entityKey?: string
        entityData?: { [key: string]: any }
      } = {}) => {
        if (entityKey && entityData) {
          const oldContentState = this.props.editorState.getCurrentContent()
          const newContentState = oldContentState.replaceEntityData(
            entityKey,
            entityData
          )
          this.onChange(
            EditorState.set(this.props.editorState, {
              currentContent: newContentState,
            })
          )
        }

        // Custom block interaction is finished.
        // Therefore, we set readOnly={false} to
        // make editor editable.
        this.setState({
          readOnly: false,
        })
      }

      // `onEditStart` and `onEditFinish` will be passed
      // into custom block component.
      // We can get them via `props.blockProps.onEditStart`
      // and `props.blockProps.onEditFinish` in the custom block components.
      atomicBlockObj['props'] = {
        onEditStart,
        onEditFinish,
        RichTextEditorComponent: RichTextEditor,
        decorator,
        getMainEditorReadOnly: () => this.state.readOnly,
      }
    }
    return atomicBlockObj
  }

  render() {
    const { disabledButtons = [] } = this.props
    let { editorState } = this.props

    if (!(editorState instanceof EditorState)) {
      editorState = EditorState.createEmpty(decorator)
    }
    const { isEnlarged, readOnly } = this.state

    const entityType = this.getEntityType(editorState)

    return (
      <DraftEditorContainer isEnlarged={isEnlarged}>
        <DraftEditorWrapper>
          <link
            href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css"
            rel="stylesheet"
            type="text/css"
          />
          <link
            href="https://storage.googleapis.com/static-readr-tw-dev/cdn/draft-js/rich-editor.css"
            rel="stylesheet"
            type="text/css"
          />
          <link
            href="https://cdnjs.cloudflare.com/ajax/libs/normalize/8.0.1/normalize.min.css"
            rel="stylesheet"
            type="text/css"
          />
          <DraftEditorControls>
            <DraftEditorControlsWrapper>
              <BlockStyleControls
                disabledButtons={disabledButtons}
                editorState={editorState}
                onToggle={this.toggleBlockType}
                readOnly={this.state.readOnly}
              />
              <InlineStyleControls
                disabledButtons={disabledButtons}
                editorState={editorState}
                onToggle={this.toggleInlineStyle}
                readOnly={this.state.readOnly}
              />
              <EnlargeButtonWrapper>
                <CustomEnlargeButton
                  onToggle={this.toggleEnlarge}
                  isEnlarged={isEnlarged}
                ></CustomEnlargeButton>
              </EnlargeButtonWrapper>
              <CustomLinkButton
                isDisabled={disabledButtons.includes(buttonNames.link)}
                isActive={entityType === 'LINK'}
                editorState={editorState}
                onChange={this.onChange}
                readOnly={this.state.readOnly}
                onEditStart={() => {
                  this.setState({ readOnly: true })
                }}
                onEditFinish={() => {
                  this.setState({ readOnly: false })
                }}
              />
              <CustomBackgroundColorButton
                isDisabled={disabledButtons.includes(
                  buttonNames.backgroundColor
                )}
                isActive={
                  editorState
                    .getCurrentInlineStyle()
                    .find(
                      (styleName) =>
                        typeof styleName === 'string' &&
                        styleName.startsWith(bgColorPrefix)
                    ) !== undefined
                }
                editorState={editorState}
                onChange={this.onChange}
                readOnly={this.state.readOnly}
                onEditStart={() => {
                  this.setState({ readOnly: true })
                }}
                onEditFinish={() => {
                  this.setState({ readOnly: false })
                }}
              ></CustomBackgroundColorButton>
              <CustomFontColorButton
                isDisabled={disabledButtons.includes(buttonNames.fontColor)}
                isActive={
                  editorState
                    .getCurrentInlineStyle()
                    .find(
                      (styleName) =>
                        typeof styleName === 'string' &&
                        styleName.startsWith(fontColorPrefix)
                    ) !== undefined
                }
                editorState={editorState}
                onChange={this.onChange}
                readOnly={this.state.readOnly}
                onEditStart={() => {
                  this.setState({ readOnly: true })
                }}
                onEditFinish={() => {
                  this.setState({ readOnly: false })
                }}
              ></CustomFontColorButton>
              <CustomBlockquoteButton
                isDisabled={disabledButtons.includes(buttonNames.blockquote)}
                editorState={editorState}
                onChange={this.onChange}
                readOnly={this.state.readOnly}
              />
              <CustomAnnotationButton
                isDisabled={disabledButtons.includes(buttonNames.annotation)}
                isActive={entityType === 'ANNOTATION'}
                editorState={editorState}
                onChange={(editorState) => {
                  this.onChange(editorState)
                }}
                readOnly={this.state.readOnly}
                onEditStart={() => {
                  this.setState({ readOnly: true })
                }}
                onEditFinish={() => {
                  this.setState({ readOnly: false })
                }}
              />
              <CustomImageButton
                isDisabled={disabledButtons.includes(buttonNames.image)}
                editorState={editorState}
                onChange={this.onChange}
                readOnly={this.state.readOnly}
                ImageSelector={ImageSelector}
              />
              <CustomSlideshowButton
                isDisabled={disabledButtons.includes(buttonNames.slideshow)}
                editorState={editorState}
                onChange={this.onChange}
                readOnly={this.state.readOnly}
                ImageSelector={ImageSelector}
              />
              <CustomInfoBoxButton
                isDisabled={disabledButtons.includes(buttonNames.infoBox)}
                editorState={editorState}
                onChange={this.onChange}
                readOnly={this.state.readOnly}
              />
              <CustomEmbeddedCodeButton
                isDisabled={disabledButtons.includes(buttonNames.embed)}
                editorState={editorState}
                onChange={this.onChange}
                readOnly={this.state.readOnly}
              ></CustomEmbeddedCodeButton>
              <CustomNewsReadingButton
                isDisabled={disabledButtons.includes(buttonNames.newsReading)}
                editorState={editorState}
                onChange={this.onChange}
                readOnly={this.state.readOnly}
              ></CustomNewsReadingButton>
              <CustomDividerButton
                isDisabled={disabledButtons.includes(buttonNames.divider)}
                editorState={editorState}
                onChange={this.onChange}
                readOnly={this.state.readOnly}
              />
            </DraftEditorControlsWrapper>
          </DraftEditorControls>
          <TextEditorWrapper
            onClick={() => {
              if (this.editorRef) {
                // eslint-disable-next-line prettier/prettier
                (this.editorRef as HTMLElement)?.focus()
              }
            }}
          >
            <Editor
              blockRenderMap={blockRenderMap}
              blockRendererFn={this.blockRendererFn}
              customStyleFn={customStyleFn}
              editorState={editorState}
              handleKeyCommand={this.handleKeyCommand}
              handleReturn={this.handleReturn}
              keyBindingFn={this.mapKeyToEditorCommand}
              onChange={this.onChange}
              placeholder="Tell a story..."
              ref={this.editorRef}
              spellCheck={true}
              readOnly={readOnly}
            />
          </TextEditorWrapper>
        </DraftEditorWrapper>
      </DraftEditorContainer>
    )
  }
}

type StyleButtonProps = {
  active: boolean
  label: string
  onToggle: (arg0: string) => void
  style: string
  icon: string
  readOnly: boolean
  isDisabled: boolean
}

class StyleButton extends React.Component<StyleButtonProps> {
  onToggle = (e: React.MouseEvent) => {
    e.preventDefault()
    this.props.onToggle(this.props.style)
  }

  render() {
    return (
      <CustomButton
        isDisabled={this.props.isDisabled}
        isActive={this.props.active}
        onMouseDown={this.onToggle}
        readOnly={this.props.readOnly}
      >
        {this.props.icon && <i className={this.props.icon}></i>}
        <span>{!this.props.icon ? this.props.label : ''}</span>
      </CustomButton>
    )
  }
}

type StyleControlsProps = {
  editorState: EditorState
  disabledButtons: string[]
  onToggle: (buttonName: string) => void
  readOnly: boolean
}

const blockStyles = [
  { label: 'H2', style: 'header-two', icon: '' },
  { label: 'H3', style: 'header-three', icon: '' },
  { label: 'H4', style: 'header-four', icon: '' },
  { label: 'H5', style: 'header-five', icon: '' },
  { label: 'UL', style: 'unordered-list-item', icon: 'fas fa-list-ul' },
  { label: 'OL', style: 'ordered-list-item', icon: 'fas fa-list-ol' },
  { label: 'Code Block', style: 'code-block', icon: 'fas fa-code' },
]

const BlockStyleControls = (props: StyleControlsProps) => {
  const { editorState, disabledButtons } = props
  const selection = editorState.getSelection()
  const blockType = editorState
    .getCurrentContent()
    .getBlockForKey(selection.getStartKey())
    .getType()
  return (
    <React.Fragment>
      {blockStyles.map((type) => (
        <StyleButton
          isDisabled={disabledButtons.includes(type.style)}
          key={type.label}
          active={type.style === blockType}
          label={type.label}
          onToggle={props.onToggle}
          style={type.style}
          icon={type.icon}
          readOnly={props.readOnly}
        />
      ))}
    </React.Fragment>
  )
}

const inlineStyles = [
  { label: 'Bold', style: 'BOLD', icon: 'fas fa-bold' },
  { label: 'Italic', style: 'ITALIC', icon: 'fas fa-italic' },
  { label: 'Underline', style: 'UNDERLINE', icon: 'fas fa-underline' },
  { label: 'Monospace', style: 'CODE', icon: 'fas fa-terminal' },
]

const InlineStyleControls = (props: StyleControlsProps) => {
  const currentStyle = props.editorState.getCurrentInlineStyle()
  return (
    <React.Fragment>
      {inlineStyles.map((type) => (
        <StyleButton
          isDisabled={props.disabledButtons.includes(type.style.toLowerCase())}
          key={type.label}
          active={currentStyle.has(type.style)}
          label={type.label}
          onToggle={props.onToggle}
          style={type.style}
          icon={type.icon}
          readOnly={props.readOnly}
        />
      ))}
    </React.Fragment>
  )
}

const AnnotationButton = createAnnotationButton({
  InnerEditor: RichTextEditor,
  decorator,
})

const CustomAnnotationButton = styled(AnnotationButton)`
  ${buttonStyle}
`

const InfoBoxButton = createInfoBoxButton({
  InnerEditor: RichTextEditor,
  decorator,
})

const CustomInfoBoxButton = styled(InfoBoxButton)`
  ${buttonStyle}
`

export { RichTextEditor, decorator }

export default {
  RichTextEditor,
  decorator,
}
