import React, { useContext, useState } from 'react'
import styled from '../styled-components.js'
import {
  EditorState,
  RawDraftContentState, // eslint-disable-line
  convertToRaw,
  convertFromRaw,
} from 'draft-js'
import { AddCaptionIcon } from './styled.js'
import { Drawer, DrawerController, DrawerProvider } from '@keystone-ui/modals'
import { FieldLabel, TextInput, Select } from '@keystone-ui/fields'

import {
  RichTextEditor as KidsTextEditor,
  buttonNames as kidsButtonNames,
  decorator as kidsDecorator,
  // @ts-ignore there is no type definition for this pkg
} from '@kids-reporter/draft-editor'
import {
  RichTextEditor as TwreporterTextEditor,
  buttonNames as twreporterButtonNames,
  decorator as twreporterDecorator,
  // @ts-ignore there is no type definition for this pkg
} from '@story-telling-reporter/draft-editor'
import { ThemeContext, ThemeEnum } from './themeContext'

enum PositionEnum {
  LEFT = 'left',
  RIGHT = 'right',
  CENTER = 'center',
}

export type CaptionState = {
  startTime: number
  rawContentState: RawDraftContentState
  position: PositionEnum
}

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
  const theme = useContext(ThemeContext)
  const Editor =
    theme === ThemeEnum.KIDS ? KidsTextEditor : TwreporterTextEditor
  const decorator =
    theme === ThemeEnum?.KIDS ? kidsDecorator : twreporterDecorator
  const disabledButtons =
    theme === ThemeEnum.KIDS
      ? [
          kidsButtonNames.code,
          kidsButtonNames.codeBlock,
          kidsButtonNames.newsReading,
        ]
      : [
          twreporterButtonNames.code,
          twreporterButtonNames.codeBlock,
          twreporterButtonNames.newsReading,
          twreporterButtonNames.image,
          twreporterButtonNames.slideshow,
          twreporterButtonNames.blockquote,
          twreporterButtonNames.divider,
          twreporterButtonNames.infoBox,
          twreporterButtonNames.h4,
          twreporterButtonNames.h5,
        ]

  const contentState = convertFromRaw(inputValue.rawContentState)
  const [inputValueState, setInputValueState] = useState({
    startTime: inputValue.startTime,
    editorState: EditorState.createWithContent(contentState, decorator),
    position: inputValue.position,
  })

  const options = [
    {
      label: '置左',
      value: PositionEnum.LEFT,
    },
    {
      label: '置中',
      value: PositionEnum.CENTER,
    },
    {
      label: '置右',
      value: PositionEnum.RIGHT,
    },
  ]

  const selectedValue =
    options.find((option) => option.value === inputValueState.position) ?? null

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
                  position: inputValueState.position,
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
                position: inputValueState.position,
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
                  position: option.value as PositionEnum,
                })
              }
            }}
            value={selectedValue}
          />
          <MarginTop />
          <FieldLabel>字幕內容</FieldLabel>
          <Editor
            disabledButtons={disabledButtons}
            editorState={inputValueState.editorState}
            onChange={(editorState: EditorState) => {
              setInputValueState({
                startTime: inputValueState.startTime,
                editorState,
                position: inputValueState.position,
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
            position: PositionEnum.LEFT,
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
