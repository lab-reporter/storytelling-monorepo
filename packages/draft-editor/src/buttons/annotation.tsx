import React, { useState } from 'react'
import buttonNames from './bt-names'
import {
  DraftDecoratorType,
  EditorState,
  RichUtils,
  convertToRaw,
} from 'draft-js'
import { Drawer, DrawerController } from '@keystone-ui/modals'
import { RichTextEditorProps } from '../draft-editor.type'

const disabledButtons = [
  buttonNames.h2,
  buttonNames.h3,
  buttonNames.code,
  buttonNames.codeBlock,
  buttonNames.blockquote,
  buttonNames.annotation,
  buttonNames.embed,
  buttonNames.image,
  buttonNames.infoBox,
  buttonNames.slideshow,
  buttonNames.newsReading,
]

type AnnotationButtonProps = {
  className?: string
  isActive: boolean
  editorState: EditorState
  onChange: (arg0: EditorState) => void
  onEditStart: () => void
  onEditFinish: () => void
}

export function createAnnotationButton({
  InnerEditor,
  decorator,
}: {
  InnerEditor: React.ComponentType<RichTextEditorProps>
  decorator: DraftDecoratorType
}): React.FC<AnnotationButtonProps> {
  return function AnnotationButton(props) {
    const toggleEntity = RichUtils.toggleLink
    const { isActive, editorState: editorStateOfOuterEditor, onChange } = props
    const [toShowInput, setToShowInput] = useState(false)
    const [inputValue, setInputValue] = useState({
      editorStateOfInnerEditor: EditorState.createEmpty(decorator),
    })

    const promptForAnnotation = (e: React.MouseEvent<HTMLDivElement>) => {
      e.preventDefault()
      props.onEditStart()
      const selection = editorStateOfOuterEditor.getSelection()
      if (!selection.isCollapsed()) {
        setToShowInput(true)
      }
    }

    const confirmAnnotation = () => {
      const contentState = editorStateOfOuterEditor.getCurrentContent()
      const rawContentState = convertToRaw(
        inputValue.editorStateOfInnerEditor.getCurrentContent()
      )
      const contentStateWithEntity = contentState.createEntity(
        'ANNOTATION',
        'MUTABLE',
        {
          rawContentState,
        }
      )
      const entityKey = contentStateWithEntity.getLastCreatedEntityKey()
      const newEditorState = EditorState.set(editorStateOfOuterEditor, {
        currentContent: contentStateWithEntity,
      })

      onChange(
        toggleEntity(newEditorState, newEditorState.getSelection(), entityKey)
      )

      setToShowInput(false)
      setInputValue({
        editorStateOfInnerEditor: EditorState.createEmpty(decorator),
      })
      props.onEditFinish()
    }

    const removeAnnotation = () => {
      const selection = editorStateOfOuterEditor.getSelection()
      if (!selection.isCollapsed()) {
        onChange(toggleEntity(editorStateOfOuterEditor, selection, null))
      }
      setToShowInput(false)
      setInputValue({
        editorStateOfInnerEditor: EditorState.createEmpty(decorator),
      })
      props.onEditFinish()
    }

    const input = (
      <DrawerController isOpen={toShowInput}>
        <Drawer
          title="註解"
          actions={{
            cancel: {
              label: 'Cancel',
              action: removeAnnotation,
            },
            confirm: {
              label: 'Confirm',
              action: confirmAnnotation,
            },
          }}
        >
          <InnerEditor
            disabledButtons={disabledButtons}
            editorState={inputValue.editorStateOfInnerEditor}
            onChange={(editorState: EditorState) => {
              setInputValue({
                editorStateOfInnerEditor: editorState,
              })
            }}
          />
        </Drawer>
      </DrawerController>
    )

    return (
      <React.Fragment>
        {input}
        <div
          className={props.className}
          onMouseDown={isActive ? removeAnnotation : promptForAnnotation}
        >
          <i className="far"></i>
          <span>Annotation</span>
        </div>
      </React.Fragment>
    )
  }
}
