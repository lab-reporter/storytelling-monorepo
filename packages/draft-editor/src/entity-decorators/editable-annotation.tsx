import React, { useState, useEffect } from 'react'
import buttonNames from '../buttons/bt-names'
import {
  EditorState,
  ContentState,
  convertFromRaw,
  convertToRaw,
} from 'draft-js'
import { Drawer, DrawerController } from '@keystone-ui/modals'
import { RichTextEditor } from '../rich-text-editor'
import { EditableWrapper } from './wrapper'
import { editableLinkDecorator } from './editable-link'
import { readOnlyAnnotationDecorator } from './read-only-annotation'

const disabledButtons = [
  buttonNames.h2,
  buttonNames.h3,
  buttonNames.code,
  buttonNames.codeBlock,
  buttonNames.blockquote,
  buttonNames.annotation,
  buttonNames.image,
  buttonNames.imageLink,
]

export const AnnotationEditor = (props: {
  isOpen: boolean
  editorStateValue: EditorState
  onConfirm: (editorState: EditorState) => void
  onCancel: () => void
}) => {
  const { isOpen, editorStateValue, onConfirm, onCancel } = props
  const [editorState, setEditorState] = useState({
    value: editorStateValue,
  })

  return (
    <DrawerController isOpen={isOpen}>
      <Drawer
        title="註解"
        actions={{
          cancel: {
            label: 'Cancel',
            action: () => onCancel(),
          },
          confirm: {
            label: 'Confirm',
            action: () => onConfirm(editorState.value),
          },
        }}
      >
        <RichTextEditor
          decorators={[editableLinkDecorator]}
          disabledButtons={disabledButtons}
          editorState={editorState.value}
          onChange={(editorState: EditorState) => {
            setEditorState({
              value: editorState,
            })
          }}
        />
      </Drawer>
    </DrawerController>
  )
}

const EditableAnnotation = (props: {
  onEditStart: () => void
  onEditFinish: (arg0?: { entityKey?: string; entityData?: object }) => void
  contentState: ContentState
  entityKey: string
  children: React.ReactNode
}) => {
  const { children, contentState, entityKey } = props
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editorState, setEditorState] = useState({
    value: EditorState.createWithContent(
      convertFromRaw(
        contentState?.getEntity(entityKey).getData()?.rawContentState
      )
    ),
  })

  useEffect(() => {
    setEditorState({
      value: EditorState.createWithContent(
        convertFromRaw(
          contentState?.getEntity(entityKey).getData()?.rawContentState
        )
      ),
    })
  }, [contentState, entityKey])

  const onEditorStateChange = (editorState: EditorState) => {
    setIsModalOpen(false)
    setEditorState({ value: editorState })
    props.onEditFinish({
      entityKey,
      entityData: {
        rawContentState: editorState
          ? convertToRaw(editorState.getCurrentContent())
          : undefined,
      },
    })
  }

  return (
    <>
      {isModalOpen && (
        <AnnotationEditor
          isOpen={isModalOpen}
          editorStateValue={editorState.value}
          onConfirm={onEditorStateChange}
          onCancel={() => {
            setIsModalOpen(false)
            props.onEditFinish()
          }}
        />
      )}
      <EditableWrapper
        component={
          <readOnlyAnnotationDecorator.component
            contentState={contentState}
            entityKey={entityKey}
          >
            {children}
          </readOnlyAnnotationDecorator.component>
        }
        onClick={(e) => {
          e.preventDefault()
          setIsModalOpen(true)
          props.onEditStart()
        }}
      />
    </>
  )
}

export const editableAnnotationDecorator = {
  strategy: readOnlyAnnotationDecorator.strategy,
  component: EditableAnnotation,
}
