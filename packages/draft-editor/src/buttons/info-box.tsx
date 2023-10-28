import React, { useState } from 'react'
import buttonNames from './bt-names'
import {
  AtomicBlockUtils,
  DraftDecoratorType,
  EditorState,
  RawDraftContentState,
  convertToRaw,
  convertFromRaw,
} from 'draft-js'
import { Drawer, DrawerController } from '@keystone-ui/modals'
import { RichTextEditorProps } from '../draft-editor.type'
import { Select } from './form/select'

const disabledButtons = [
  buttonNames.h2,
  buttonNames.h3,
  buttonNames.code,
  buttonNames.codeBlock,
  buttonNames.blockquote,
  buttonNames.infoBox,
  buttonNames.slideshow,
  buttonNames.newsReading,
]

enum InfoBoxTypeEnum {
  newsChargeStation = 'news-charge-station',
  headerBorder = 'header-border',
  boxBorder = 'box-border',
}

enum InfoBoxLabelEnum {
  newsChargeStation = '新聞充電器',
  headerBorder = '無線框版',
  boxBorder = '有線框版',
}

export type InfoBoxInputValue = {
  type: InfoBoxTypeEnum
  rawContentState: RawDraftContentState
}

type InfoBoxInputType = {
  isOpen: boolean
  onConfirm: (arg0: {
    type: InfoBoxTypeEnum
    rawContentState: RawDraftContentState
  }) => void
  onCancel: () => void
  Editor: React.ComponentType<RichTextEditorProps>
  decorator: DraftDecoratorType
  inputValue: InfoBoxInputValue
}

export function InfoBoxInput(props: InfoBoxInputType) {
  const { isOpen, onConfirm, onCancel, Editor, decorator, inputValue } = props

  const contentState = convertFromRaw(inputValue.rawContentState)
  const [inputValueState, setInputValueState] = useState({
    type: inputValue.type,
    editorState: EditorState.createWithContent(contentState, decorator),
  })

  return (
    <DrawerController isOpen={isOpen}>
      <Drawer
        title={`Info Box`}
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
                type: inputValueState.type,
                rawContentState: convertToRaw(
                  inputValueState.editorState.getCurrentContent()
                ),
              })
            },
          },
        }}
      >
        <Select
          title="版型"
          value={inputValueState.type}
          options={[
            {
              label: InfoBoxLabelEnum.newsChargeStation,
              value: InfoBoxTypeEnum.newsChargeStation,
            },
            {
              label: InfoBoxLabelEnum.headerBorder,
              value: InfoBoxTypeEnum.headerBorder,
            },
            {
              label: InfoBoxLabelEnum.boxBorder,
              value: InfoBoxTypeEnum.boxBorder,
            },
          ]}
          onChange={(infoBoxType) => {
            setInputValueState({
              type: infoBoxType as InfoBoxTypeEnum,
              editorState: inputValueState.editorState,
            })
          }}
        />
        <Editor
          disabledButtons={disabledButtons}
          editorState={inputValueState.editorState}
          onChange={(editorState: EditorState) => {
            setInputValueState({
              type: inputValueState.type,
              editorState,
            })
          }}
        />
      </Drawer>
    </DrawerController>
  )
}

type InfoBoxButtonProps = {
  className?: string
  editorState: EditorState
  onChange: (param: EditorState) => void
}

export function createInfoBoxButton({
  InnerEditor,
  decorator,
}: {
  InnerEditor: React.ComponentType<RichTextEditorProps>
  decorator: DraftDecoratorType
}) {
  return function InfoBoxButton(props: InfoBoxButtonProps) {
    const [toShowInput, setToShowInput] = useState(false)
    const { className, editorState, onChange: onEditorStateChange } = props

    const onChange = ({
      type,
      rawContentState,
    }: {
      type: InfoBoxTypeEnum
      rawContentState: RawDraftContentState
    }) => {
      const contentState = editorState.getCurrentContent()

      // create an InfoBox entity
      const contentStateWithEntity = contentState.createEntity(
        'INFOBOX',
        'IMMUTABLE',
        {
          type,
          rawContentState,
        }
      )
      const entityKey = contentStateWithEntity.getLastCreatedEntityKey()
      const newEditorState = EditorState.set(editorState, {
        currentContent: contentStateWithEntity,
      })

      //The third parameter here is a space string, not an empty string
      //If you set an empty string, you will get an error: Unknown DraftEntity key: null
      onEditorStateChange(
        AtomicBlockUtils.insertAtomicBlock(newEditorState, entityKey, ' ')
      )
      setToShowInput(false)
    }

    return (
      <React.Fragment>
        {toShowInput && (
          <InfoBoxInput
            Editor={InnerEditor}
            decorator={decorator}
            onConfirm={onChange}
            onCancel={() => {
              setToShowInput(false)
            }}
            isOpen={toShowInput}
            inputValue={{
              type: InfoBoxTypeEnum.newsChargeStation,
              rawContentState: { blocks: [], entityMap: {} },
            }}
          />
        )}
        <div
          className={className}
          onClick={() => {
            setToShowInput(true)
          }}
        >
          <i className="far"></i>
          <span>InfoBox</span>
        </div>
      </React.Fragment>
    )
  }
}
