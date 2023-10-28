import React, { useState } from 'react'
import { AtomicBlockUtils, EditorState } from 'draft-js'
import { Drawer, DrawerController } from '@keystone-ui/modals'
import { Select } from './form/select'
import { TextArea } from '@keystone-ui/fields'

enum BlockquoteTypeEnum {
  borderLeft = 'border_left',
  quoteLeft = 'quote_left',
}

enum BlockquoteLabelEnum {
  borderLeft = '左邊框',
  quoteLeft = '左引號',
}

export type BlockquoteInputValue = {
  type: BlockquoteTypeEnum
  text: string
}

export function BlockquoteInput({
  isOpen,
  onConfirm,
  onCancel,
  inputValue,
}: {
  isOpen: boolean
  onConfirm: ({ type, text }: BlockquoteInputValue) => void
  onCancel: () => void
  inputValue: BlockquoteInputValue
}) {
  const [inputValueState, setInputValueState] = useState(inputValue)

  const confirmInput = () => {
    onConfirm(inputValueState)
  }

  return (
    <DrawerController isOpen={isOpen}>
      <Drawer
        title="引言"
        //isOpen={toShowInput}
        actions={{
          cancel: {
            label: 'Cancel',
            action: onCancel,
          },
          confirm: {
            label: 'Confirm',
            action: confirmInput,
          },
        }}
      >
        <Select
          title="版型"
          value={inputValueState.type}
          options={[
            {
              label: BlockquoteLabelEnum.borderLeft,
              value: BlockquoteTypeEnum.borderLeft,
            },
            {
              label: BlockquoteLabelEnum.quoteLeft,
              value: BlockquoteTypeEnum.quoteLeft,
            },
          ]}
          onChange={(blockquoteType) => {
            setInputValueState({
              type: blockquoteType as BlockquoteTypeEnum,
              text: inputValueState.text,
            })
          }}
        />
        <TextArea
          onChange={(e) =>
            setInputValueState({
              type: inputValueState.type,
              text: e.target.value,
            })
          }
          placeholder="引言文字"
          type="text"
          value={inputValueState.text}
          style={{ marginBottom: '30px' }}
        />
      </Drawer>
    </DrawerController>
  )
}

type BlockquoteButtonProps = {
  className?: string
  editorState: EditorState
  onChange: (editorState: EditorState) => void
}

export function BlockquoteButton(props: BlockquoteButtonProps) {
  const { editorState, onChange, className } = props

  const [isInputOpen, setIsInputOpen] = useState(false)

  const promptForInput = () => {
    setIsInputOpen(true)
  }

  const onInputChange = (inputValue: BlockquoteInputValue) => {
    const contentState = editorState.getCurrentContent()
    const contentStateWithEntity = contentState.createEntity(
      'BLOCKQUOTE',
      'IMMUTABLE',
      inputValue
    )
    const entityKey = contentStateWithEntity.getLastCreatedEntityKey()
    const newEditorState = EditorState.set(editorState, {
      currentContent: contentStateWithEntity,
    })

    // The third parameter here is a space string, not an empty string
    // If you set an empty string, you will get an error: Unknown DraftEntity key: null
    onChange(AtomicBlockUtils.insertAtomicBlock(newEditorState, entityKey, ' '))

    setIsInputOpen(false)
  }

  const onInputCancel = () => {
    setIsInputOpen(false)
  }

  return (
    <React.Fragment>
      {isInputOpen && (
        <BlockquoteInput
          isOpen={isInputOpen}
          onConfirm={onInputChange}
          onCancel={onInputCancel}
          inputValue={{
            type: BlockquoteTypeEnum.borderLeft,
            text: '',
          }}
        />
      )}
      <div
        onClick={() => {
          promptForInput()
        }}
        className={className}
      >
        <i className="fas fa-quote-left"></i>
      </div>
    </React.Fragment>
  )
}
