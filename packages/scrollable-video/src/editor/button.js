import React, { useContext, useState } from 'react'
import {
  EditorState,
  RawDraftContentState, // eslint-disable-line
  convertToRaw,
  convertFromRaw,
} from 'draft-js'
import { AddCaptionIcon } from './styled.js'
import { Drawer, DrawerController, DrawerProvider } from '@keystone-ui/modals'
import { FieldLabel, TextInput } from '@keystone-ui/fields'
import {
  RichTextEditor as KidsTextEditor,
  buttonNames as kidsButtonNames,
  decorator as kidsDecorator,
} from '@kids-reporter/draft-editor'
import {
  RichTextEditor as TwreporterTextEditor,
  buttonNames as twreporterButtonNames,
  decorator as twreporterDecorator,
} from '@story-telling-reporter/draft-editor'
import { ThemeContext, themeEnum } from './themeContext.js'

/**
 *  @typedef {Object} CaptionState
 *  @property {number} startTime
 *  @property {RawDraftContentState} rawContentState
 */

/**
 *  @callback onConfirm
 *  @param {CaptionState} props
 *  @returns {undefined}
 */

/**
 *  @callback onCancel
 */

/**
 *  @param {Object} props
 *  @param {boolean} props.isOpen
 *  @param {onConfirm} props.onConfirm
 *  @param {onCancel} props.onCancel
 *  @param {Object} props.inputValue
 *  @param {number} props.inputValue.startTime
 *  @param {EditorState} props.inputValue.rawContentState
 */
export function CaptionInput({ isOpen, onConfirm, onCancel, inputValue }) {
  const theme = useContext(ThemeContext)
  const Editor =
    theme === themeEnum.kids ? KidsTextEditor : TwreporterTextEditor
  const decorator =
    theme === themeEnum.kids ? kidsDecorator : twreporterDecorator
  const disabledButtons =
    theme === themeEnum.kids
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
  })

  return (
    <DrawerProvider>
      <DrawerController isOpen={isOpen}>
        <Drawer
          style={{ position: 'relative' }}
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
                })
              },
            },
          }}
        >
          <FieldLabel>字幕出現秒數</FieldLabel>
          <TextInput
            onChange={(e) =>
              setInputValueState({
                startTime: Number(e.target.value),
                editorState: inputValueState.editorState,
              })
            }
            placeholder="0"
            type="number"
            value={inputValueState.startTime.toString()}
            style={{ marginBottom: '30px' }}
          />
          <FieldLabel>字幕內容</FieldLabel>
          <Editor
            disabledButtons={disabledButtons}
            editorState={inputValueState.editorState}
            onChange={(editorState) => {
              setInputValueState({
                startTime: inputValueState.startTime,
                editorState,
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

/**
 *  @param {Object} props
 *  @param {string} [props.className]
 *  @param {CaptionState} [props.captionState]
 *  @param {onCaptionStateChange} props.onChange
 *  @param {getVideoCurrentTimeCallback} [props.getVideoCurrentTime]
 */
export function AddCaptionButton({ className, onChange, getVideoCurrentTime }) {
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
