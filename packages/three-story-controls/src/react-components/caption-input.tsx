import React, { useState } from 'react'
import styled from 'styled-components'
import {
  EditorState,
  RawDraftContentState, // eslint-disable-line
  convertToRaw,
  convertFromRaw,
} from 'draft-js'
import { Drawer, DrawerController, DrawerProvider } from '@keystone-ui/modals'
import { FieldLabel, Select, TextInput } from '@keystone-ui/fields'
import {
  RichTextEditor,
  buttonNames,
} from '@story-telling-reporter/draft-editor'
import { AlignmentEnum, CaptionProp, WidthEnum } from '../types'

const disabledButtons = [
  buttonNames.code,
  buttonNames.codeBlock,
  buttonNames.newsReading,
  buttonNames.slideshow,
  buttonNames.divider,
  buttonNames.infoBox,
  buttonNames.h4,
  buttonNames.h5,
]

const alignmentOptions = [
  {
    label: '置左',
    value: AlignmentEnum.LEFT,
  },
  {
    label: '置中',
    value: AlignmentEnum.CENTER,
  },
  {
    label: '置右',
    value: AlignmentEnum.RIGHT,
  },
]

const widthOptions = [
  {
    label: '窄版',
    value: WidthEnum.NARROW,
  },
  {
    label: '寬版',
    value: WidthEnum.WIDE,
  },
]

export function CaptionInput({
  isOpen,
  onConfirm,
  onCancel,
  inputValue,
}: {
  isOpen: boolean
  onConfirm: (arg0: CaptionProp) => void
  onCancel: () => void
  inputValue: CaptionProp
}) {
  const contentState = convertFromRaw(inputValue.rawContentState)
  const [inputValueState, setInputValueState] = useState({
    editorState: EditorState.createWithContent(contentState),
    alignment: inputValue.alignment,
    width: inputValue.width,
    top: inputValue.top,
  })

  const selectedAlignmentValue =
    alignmentOptions.find(
      (option) => option.value === inputValueState.alignment
    ) ?? null

  const selectedWidthValue =
    widthOptions.find((option) => option.value === inputValueState.width) ??
    null

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
                onConfirm(
                  Object.assign({}, inputValueState, {
                    rawContentState: convertToRaw(
                      inputValueState.editorState.getCurrentContent()
                    ),
                  })
                )
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
          <MarginTop />
          <FieldLabel>字幕出現位置</FieldLabel>
          <Select
            isClearable
            options={alignmentOptions}
            onChange={(option) => {
              if (option) {
                setInputValueState((prevState) => {
                  return Object.assign({}, prevState, {
                    alignment: option.value,
                  })
                })
              }
            }}
            value={selectedAlignmentValue}
          />
          <MarginTop />
          <FieldLabel>字幕寬度</FieldLabel>
          <Select
            isClearable
            options={widthOptions}
            onChange={(option) => {
              if (option) {
                setInputValueState((prevState) => {
                  return Object.assign({}, prevState, {
                    width: option.value,
                  })
                })
              }
            }}
            value={selectedWidthValue}
          />
          <MarginTop />
          <FieldLabel>
            字幕間距（與上一個字幕上端的距離。單位是螢幕高，例如：1
            代表一個螢幕高）
          </FieldLabel>
          <TextInput
            onChange={(e) =>
              setInputValueState((prevState) => {
                return Object.assign({}, prevState, {
                  top: Number(e.target.value),
                })
              })
            }
            placeholder="0"
            type="number"
            value={inputValueState.top ? inputValueState.top.toString() : 1}
          />
        </Drawer>
      </DrawerController>
    </DrawerProvider>
  )
}

const MarginTop = styled.div`
  margin-top: 30px;
`
