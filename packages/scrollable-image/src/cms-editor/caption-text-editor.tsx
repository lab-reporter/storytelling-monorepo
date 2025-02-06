import React, { useState, useEffect, useRef } from 'react'
import styled from 'styled-components'
import throttle from 'lodash/throttle'
import { AlertDialog } from '@keystone-ui/modals'
import { CaptionData } from '../type'
import { DeleteCaptionButton, EditCaptionButton } from './styled'
import { DraftRenderer } from '../draft-renderer/index'
import { Drawer, DrawerController, DrawerProvider } from '@keystone-ui/modals'
import {
  EditorState,
  RawDraftContentState,
  convertFromRaw,
  convertToRaw,
} from 'draft-js'
import { FieldLabel } from '@keystone-ui/fields'
import {
  RichTextEditor,
  buttonNames,
} from '@story-telling-reporter/draft-editor'

const _ = {
  throttle,
}

enum BehaviorEnum {
  Edit = 'edit',
  Remove = 'remove',
  Nothing = 'nothing',
}

export function CaptionTextEditor({
  className,
  caption,
  onChange,
  getParentElementWidthAndHeight,
}: {
  className?: string
  caption: CaptionData
  onChange: (caption: CaptionData | null) => void
  getParentElementWidthAndHeight: () => { width: number; height: number }
}) {
  const textEditorRef = useRef<HTMLDivElement>(null)
  const [userBehavior, setUserBehavior] = useState(BehaviorEnum.Nothing)

  // Handle drag and drop,
  // and re-calculate positions.
  useEffect(() => {
    const textEditorNode = textEditorRef.current

    if (!textEditorNode) {
      return
    }

    let isDragging = false
    let startX = 0
    let startY = 0
    let deltaX = 0
    let deltaY = 0

    function drag(event: MouseEvent) {
      const buttomRightResizeIconWidth = 10

      if (textEditorNode) {
        // Users click the bottom-right corner of the text block.
        if (
          textEditorNode.clientWidth - event.offsetX <
          buttomRightResizeIconWidth
        ) {
          // They want to resize the text block instead of dragging the whole text block.
          return
        }

        isDragging = true
        startX = event.clientX
        startY = event.clientY
      }
    }

    function dragging(event: MouseEvent) {
      if (isDragging && textEditorNode) {
        deltaX = event.clientX - startX
        deltaY = event.clientY - startY
        textEditorNode.style.transform = `translate(${deltaX}px, ${deltaY}px)`
      }
    }

    function drop() {
      if (isDragging && textEditorNode) {
        isDragging = false

        const left = textEditorNode.offsetLeft + deltaX
        const top = textEditorNode.offsetTop + deltaY

        const { width: parentWidth, height: parentHeight } =
          getParentElementWidthAndHeight()

        textEditorNode.style.transform = 'none'

        onChange(
          Object.assign({}, caption, {
            // re-calculate caption positions.
            position: {
              left: `${parseFloat((left / parentWidth).toFixed(4)) * 100}%`,
              top: `${parseFloat((top / parentHeight).toFixed(4)) * 100}%`,
            },
          })
        )
      }
    }

    textEditorNode.addEventListener('mousedown', drag)
    document.addEventListener('mousemove', dragging)
    document.addEventListener('mouseup', drop)

    return () => {
      textEditorNode.removeEventListener('mousedown', drag)
      document.removeEventListener('mousemove', dragging)
      document.removeEventListener('mouseup', drop)
    }
  }, [caption, onChange, getParentElementWidthAndHeight])

  // handle textarea element resize
  useEffect(() => {
    const textEditorNode = textEditorRef.current

    if (!textEditorNode) {
      return
    }

    const resizeObserver = new ResizeObserver(
      _.throttle((entries) => {
        const entry = entries?.[0]
        if (entry) {
          const rect = entry.target.getBoundingClientRect()

          const width = rect.width
          const height = rect.height

          if (width === 0 || height === 0) {
            return
          }

          const { width: parentWidth, height: parentHeight } =
            getParentElementWidthAndHeight()

          const newWidth = `${
            parseFloat((width / parentWidth).toFixed(4)) * 100
          }%`
          const newHeight = `${
            parseFloat((height / parentHeight).toFixed(4)) * 100
          }%`

          if (caption.width !== newWidth || caption.height !== newHeight) {
            onChange({
              ...caption,
              width: newWidth,
              height: newHeight,
            })
          }
        }
      }, 2000)
    )

    resizeObserver.observe(textEditorNode)

    return () => {
      resizeObserver.unobserve(textEditorNode)
      resizeObserver.disconnect()
    }
  }, [caption, onChange, getParentElementWidthAndHeight])

  const editJsx =
    userBehavior === BehaviorEnum.Edit ? (
      <CaptionInput
        isOpen={true}
        onConfirm={(updatedInputValue) => {
          onChange(Object.assign({}, caption, updatedInputValue))
          setUserBehavior(BehaviorEnum.Nothing)
        }}
        onCancel={() => {
          setUserBehavior(BehaviorEnum.Nothing)
        }}
        inputValue={{
          id: caption.id,
          rawContentState: caption.rawContentState,
        }}
      />
    ) : null

  const deleteAlertJsx = (
    // @ts-ignore `children` should be optional
    <AlertDialog
      title="確認刪除"
      isOpen={userBehavior === BehaviorEnum.Remove}
      actions={{
        cancel: {
          label: 'Cancel',
          action: () => {
            setUserBehavior(BehaviorEnum.Nothing)
          },
        },
        confirm: {
          label: 'Confirm',
          action: () => {
            onChange(null)
          },
        },
      }}
    ></AlertDialog>
  )

  return (
    <div>
      <TextEditorBlock
        ref={textEditorRef}
        className={className}
        style={{
          ...caption.position,
          width: caption.width,
          height: caption.height,
        }}
      >
        <DraftRenderer rawContentState={caption.rawContentState} />
      </TextEditorBlock>
      <Buttons
        style={{
          left: `calc(${caption.position.left})`,
          top: `calc(${caption.position.top} - ${buttonHeight})`,
        }}
      >
        <EditCaptionButton onClick={() => setUserBehavior(BehaviorEnum.Edit)} />
        <DeleteCaptionButton
          onClick={() => setUserBehavior(BehaviorEnum.Remove)}
        />
      </Buttons>
      {editJsx}
      {deleteAlertJsx}
    </div>
  )
}

const buttonHeight = '25px'

const TextEditorBlock = styled.div`
  position: absolute;
  resize: both;
  overflow: auto;
  background-color: rgba(255, 255, 255, 0.3);
`

const Buttons = styled.div`
  position: absolute;
  top: 0px;
  right: 0px;
  display: flex;
`

const disabledButtons = [
  buttonNames.code,
  buttonNames.codeBlock,
  buttonNames.slideshow,
  buttonNames.divider,
  buttonNames.infoBox,
  buttonNames.image,
  buttonNames.blockquote,
  buttonNames.h2,
  buttonNames.h3,
  buttonNames.h4,
  buttonNames.h5,
]

type CaptionInputValue = {
  id?: string
  rawContentState: RawDraftContentState
}

function CaptionInput({
  isOpen,
  onConfirm,
  onCancel,
  inputValue,
}: {
  isOpen: boolean
  onConfirm: (arg0: CaptionInputValue) => void
  onCancel: () => void
  inputValue: CaptionInputValue
}) {
  const contentState = convertFromRaw(inputValue.rawContentState)
  const [inputValueState, setInputValueState] = useState({
    id: inputValue.id,
    editorState: EditorState.createWithContent(contentState),
    // customCss: inputValue.customCss,
  })

  return (
    <DrawerProvider>
      <DrawerController isOpen={isOpen}>
        <Drawer
          width="wide"
          title={`字幕設定`}
          actions={{
            cancel: {
              label: 'Cancel',
              action: () => {
                onCancel()
              },
            },
            confirm: {
              label: 'Confirm',
              action: () => {
              const { editorState, ...rest } = inputValueState  // eslint-disable-line
                onConfirm({
                  rawContentState: convertToRaw(
                    inputValueState.editorState.getCurrentContent()
                  ),
                  ...rest,
                })
              },
            },
          }}
        >
          <MarginTop />
          <FieldLabel>字幕內容</FieldLabel>
          <RichTextEditor
            disabledButtons={disabledButtons}
            editorState={inputValueState.editorState}
            onChange={(editorState: EditorState) => {
              setInputValueState((prevState) => {
                return Object.assign({}, prevState, {
                  editorState,
                })
              })
            }}
          />
          {/*
          <MarginTop />
          <FieldLabel>客製化 CSS</FieldLabel>
          <TextArea
            onChange={(e) =>
              setInputValueState((prevState) => {
                return Object.assign({}, prevState, {
                  customCss: e.target.value,
                })
              })
            }
            type="text"
            value={inputValueState.customCss}
          />
          */}
        </Drawer>
      </DrawerController>
    </DrawerProvider>
  )
}

const MarginTop = styled.div`
  margin-top: 30px;
`
