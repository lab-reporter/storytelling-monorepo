import React from 'react'
import {
  ContentBlock,
  DraftBlockType,
  DraftEditorCommand,
  Editor,
  EditorState,
  KeyBindingUtil,
  RichUtils,
  getDefaultKeyBinding,
  CompositeDecorator,
} from 'draft-js'
import { blockRenderMap } from './block-render-maps/index'
import { blockStyleFn } from './block-style-fn'
import { customStyleFn } from './custom-style-fn'
import buttonNames from './buttons/bt-names'
import { atomicBlockRenderer } from './block-renderer-fn'
import {
  DraftEditorContainer,
  DraftEditorWrapper,
  DraftEditorControls,
  DraftEditorControlsWrapper,
  EnlargeButtonWrapper,
  TextEditorWrapper,
} from './styled'
import {
  BlockStyleControls,
  InlineStyleControls,
  CustomEnlargeButton,
  CustomLinkButton,
  CustomAnnotationButton,
  CustomBackgroundColorButton,
  CustomFontColorButton,
  CustomImageButton,
  CustomImageLinkButton,
  CustomEmbeddedCodeButton,
  CustomTextAlignCenterButton,
  CustomTextAlignRightButton,
  TextAlignEnum,
  getTextAlignOfSelectionBlocks,
} from './buttons'
import { ImageSelector } from './buttons/selector/image-selector'
import { customStylePrefix as bgColorPrefix } from './buttons/bg-color'
import { customStylePrefix as fontColorPrefix } from './buttons/font-color'
import { Entity } from './constants'

const styleSource = [
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css',
  'https://cdnjs.cloudflare.com/ajax/libs/normalize/8.0.1/normalize.min.css',
].map((src, index) => (
  <link
    key={`style-src-${index}`}
    href={src}
    rel="stylesheet"
    type="text/css"
  />
))

type State = {
  isEnlarged: boolean
  readOnly: boolean
  editorState: EditorState
}

export type RichTextEditorWithoutDecoratorProps = {
  onChange: (editorState: EditorState) => void
  editorState: EditorState
  disabledButtons?: string[]
}

type RichTextEditorWithDecoratorProps = RichTextEditorWithoutDecoratorProps & {
  decorators: any[]
}

class RichTextEditor extends React.Component<
  RichTextEditorWithDecoratorProps,
  State
> {
  editorRef = null

  constructor(props: RichTextEditorWithDecoratorProps) {
    super(props)
    // Assign edit props to decorators
    const editableDecorators = new CompositeDecorator(
      props.decorators?.map((editableDecorator) => {
        return {
          ...editableDecorator,
          props: {
            ...this.customEditProps,
          },
        }
      })
    )

    const { editorState } = props
    this.state = {
      isEnlarged: false,
      readOnly: false,
      editorState: !(editorState instanceof EditorState)
        ? EditorState.createEmpty(editableDecorators)
        : EditorState.set(editorState, {
            decorator: editableDecorators,
          }),
    }
  }

  onChange = (editorState: EditorState) => {
    this.setState({ editorState: editorState })
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
      this.onChange(RichUtils.insertSoftNewline(this.state.editorState))
      return 'handled'
    }

    return 'not-handled'
  }

  mapKeyToEditorCommand = (e: React.KeyboardEvent) => {
    if (e.keyCode === 9 /* TAB */) {
      const newEditorState = RichUtils.onTab(
        e,
        this.state.editorState,
        4 /* maxDepth */
      )
      if (newEditorState !== this.state.editorState) {
        this.onChange(newEditorState)
      }
      return null
    }
    return getDefaultKeyBinding(e)
  }

  toggleBlockType = (blockType: DraftBlockType) => {
    this.onChange(RichUtils.toggleBlockType(this.state.editorState, blockType))
  }

  toggleInlineStyle = (inlineStyle: string) => {
    this.onChange(
      RichUtils.toggleInlineStyle(this.state.editorState, inlineStyle)
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

  commonEditProps = {
    onEditStart: () => {
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
    },
    onEditFinish: () => {
      this.setState({ readOnly: false })
    },
  }

  customEditProps = {
    onEditStart: this.commonEditProps.onEditStart,
    onEditFinish: ({
      entityKey,
      entityData,
    }: {
      entityKey?: string
      entityData?: { [key: string]: any }
    } = {}) => {
      if (entityKey && entityData) {
        const oldContentState = this.state.editorState.getCurrentContent()
        const newContentState = oldContentState.replaceEntityData(
          entityKey,
          entityData
        )
        this.onChange(
          EditorState.set(this.state.editorState, {
            currentContent: newContentState,
          })
        )
      }
      this.commonEditProps.onEditFinish()
    },
  }

  blockRendererFn = (block: ContentBlock) => {
    const atomicBlockObj = atomicBlockRenderer(block)
    if (atomicBlockObj) {
      // `onEditStart` and `onEditFinish` will be passed
      // into custom block component.
      // We can get them via `props.blockProps.onEditStart`
      // and `props.blockProps.onEditFinish` in the custom block components.
      atomicBlockObj['props'] = {
        ...this.customEditProps,
        getMainEditorReadOnly: () => this.state.readOnly,
      }
    }
    return atomicBlockObj
  }

  render() {
    const { disabledButtons = [] } = this.props
    const { isEnlarged, readOnly, editorState } = this.state

    const entityType = this.getEntityType(editorState)

    const commonProps = {
      editorState: editorState,
      onChange: this.onChange,
      readOnly: readOnly,
    }

    const textAlignOfSelectionBlocks =
      getTextAlignOfSelectionBlocks(editorState)

    return (
      <DraftEditorContainer isEnlarged={isEnlarged}>
        <DraftEditorWrapper>
          {styleSource}
          <DraftEditorControls>
            <DraftEditorControlsWrapper>
              <BlockStyleControls
                disabledButtons={disabledButtons}
                editorState={editorState}
                onToggle={this.toggleBlockType}
                readOnly={readOnly}
              />
              <InlineStyleControls
                disabledButtons={disabledButtons}
                editorState={editorState}
                onToggle={this.toggleInlineStyle}
                readOnly={readOnly}
              />
              <CustomTextAlignCenterButton
                isDisabled={disabledButtons.includes(
                  buttonNames.textAlignCenter
                )}
                isActive={textAlignOfSelectionBlocks === TextAlignEnum.CENTER}
                {...commonProps}
              />
              <CustomTextAlignRightButton
                isDisabled={disabledButtons.includes(
                  buttonNames.textAlignRight
                )}
                isActive={textAlignOfSelectionBlocks === TextAlignEnum.RIGHT}
                {...commonProps}
              />
              <EnlargeButtonWrapper>
                <CustomEnlargeButton
                  onToggle={this.toggleEnlarge}
                  isEnlarged={isEnlarged}
                ></CustomEnlargeButton>
              </EnlargeButtonWrapper>
              <CustomLinkButton
                isDisabled={disabledButtons.includes(buttonNames.link)}
                isActive={entityType === Entity.Link}
                {...commonProps}
                {...this.commonEditProps}
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
                {...commonProps}
                {...this.commonEditProps}
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
                {...commonProps}
                {...this.commonEditProps}
              ></CustomFontColorButton>
              <CustomAnnotationButton
                isDisabled={disabledButtons.includes(buttonNames.annotation)}
                isActive={entityType === Entity.Annotation}
                {...commonProps}
                {...this.commonEditProps}
              />
              <CustomImageButton
                isDisabled={disabledButtons.includes(buttonNames.image)}
                ImageSelector={ImageSelector}
                {...commonProps}
              />
              <CustomImageLinkButton
                isDisabled={disabledButtons.includes(buttonNames.imageLink)}
                {...commonProps}
              />
              <CustomEmbeddedCodeButton
                isDisabled={disabledButtons.includes(buttonNames.embed)}
                {...commonProps}
              ></CustomEmbeddedCodeButton>
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
              blockStyleFn={blockStyleFn}
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

export { RichTextEditor }

export default {
  RichTextEditor,
}
