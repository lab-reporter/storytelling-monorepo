import React, { useState } from 'react'
import styled from '../styled-components.js'
import {
  EditorState,
  RawDraftContentState, // eslint-disable-line
  convertToRaw,
  convertFromRaw,
} from 'draft-js'
import { AddCaptionIcon } from './styled'
import { Drawer, DrawerController, DrawerProvider } from '@keystone-ui/modals'
import { FieldLabel, TextInput, Select } from '@keystone-ui/fields'
import {
  RichTextEditor,
  buttonNames,
  decorator,
} from '@story-telling-reporter/draft-editor'
import { CaptionState, AlignmentEnum } from './type'

export function CaptionInput({
  isOpen,
  onConfirm,
  onCancel,
  inputValue,
}: {
  isOpen: boolean
  onConfirm: (arg0: CaptionState) => void
  onCancel: () => void
  inputValue: CaptionState
}) {
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

  const contentState = convertFromRaw(inputValue.rawContentState)
  const [inputValueState, setInputValueState] = useState({
    startTime: inputValue.startTime,
    editorState: EditorState.createWithContent(contentState, decorator),
    alignment: inputValue.alignment,
  })

  const options = [
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

  const selectedValue =
    options.find((option) => option.value === inputValueState.alignment) ?? null

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
                onConfirm({
                  startTime: inputValueState.startTime,
                  rawContentState: convertToRaw(
                    inputValueState.editorState.getCurrentContent()
                  ),
                  alignment: inputValueState.alignment,
                })
              },
            },
          }}
        >
          <MarginTop />
          <FieldLabel>字幕出現秒數</FieldLabel>
          <TextInput
            onChange={(e) =>
              setInputValueState({
                startTime: Number(e.target.value),
                editorState: inputValueState.editorState,
                alignment: inputValueState.alignment,
              })
            }
            placeholder="0"
            type="number"
            value={inputValueState.startTime.toString()}
          />
          <MarginTop />
          <FieldLabel>字幕出現位置</FieldLabel>
          <Select
            isClearable
            options={options}
            onChange={(option) => {
              if (option) {
                setInputValueState({
                  startTime: inputValue.startTime,
                  editorState: inputValueState.editorState,
                  alignment: option.value as AlignmentEnum,
                })
              }
            }}
            value={selectedValue}
          />
          <MarginTop />
          <FieldLabel>字幕內容</FieldLabel>
          <RichTextEditor
            disabledButtons={disabledButtons}
            editorState={inputValueState.editorState}
            onChange={(editorState: EditorState) => {
              setInputValueState({
                startTime: inputValueState.startTime,
                editorState,
                alignment: inputValueState.alignment,
              })
            }}
          />
        </Drawer>
      </DrawerController>
    </DrawerProvider>
  )
}

/**
 *  @callback onCaptionStateChange
 *  @param {CaptionState} captionState
 *  @returns {undefined}
 */

/**
 *  @callback getVideoCurrentTimeCallback
 *  @returns {number} video.currentTime
 */

export function AddCaptionButton({
  className,
  onChange,
  getVideoCurrentTime,
}: {
  className?: string
  onChange: (arg0: CaptionState) => void
  getVideoCurrentTime: () => number
}) {
  const defaultStartTime = 0
  const [toShowInput, setToShowInput] = useState(false)

  return (
    <React.Fragment>
      {toShowInput && (
        <CaptionInput
          onConfirm={(captionState) => {
            onChange(captionState)
            setToShowInput(false)
          }}
          onCancel={() => {
            setToShowInput(false)
          }}
          isOpen={toShowInput}
          inputValue={{
            alignment: AlignmentEnum.LEFT,
            startTime:
              typeof getVideoCurrentTime === 'function'
                ? getVideoCurrentTime()
                : defaultStartTime,
            rawContentState: { blocks: [], entityMap: {} },
          }}
        />
      )}
      <AddCaptionIcon
        className={className}
        onClick={() => {
          setToShowInput(true)
        }}
      />
    </React.Fragment>
  )
}

const MarginTop = styled.div`
  margin-top: 30px;
`
