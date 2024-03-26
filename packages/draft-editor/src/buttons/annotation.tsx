import React, { useState } from 'react'
import { EditorState, RichUtils, convertToRaw } from 'draft-js'
import { AnnotationEditor } from '../entity-decorators/editable-annotation'
import { Entity } from '../constants'

type AnnotationButtonProps = {
  className?: string
  isActive: boolean
  editorState: EditorState
  onChange: (arg0: EditorState) => void
  onEditStart: () => void
  onEditFinish: () => void
}

export const AnnotationButton = (props: AnnotationButtonProps) => {
  const toggleEntity = RichUtils.toggleLink
  const { isActive, editorState: editorStateOfOuterEditor, onChange } = props
  const [toShowInput, setToShowInput] = useState(false)

  const promptForAnnotation = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault()
    const selection = editorStateOfOuterEditor.getSelection()
    if (!selection.isCollapsed()) {
      props.onEditStart()
      setToShowInput(true)
    }
  }

  const confirmAnnotation = (editorState: EditorState) => {
    const contentState = editorStateOfOuterEditor.getCurrentContent()
    const rawContentState = convertToRaw(editorState.getCurrentContent())
    const contentStateWithEntity = contentState.createEntity(
      Entity.Annotation,
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
    props.onEditFinish()
  }

  const removeAnnotation = () => {
    const selection = editorStateOfOuterEditor.getSelection()
    if (!selection.isCollapsed()) {
      onChange(toggleEntity(editorStateOfOuterEditor, selection, null))
    }
    setToShowInput(false)
    props.onEditFinish()
  }

  return (
    <>
      {toShowInput && (
        <AnnotationEditor
          isOpen={toShowInput}
          editorStateValue={EditorState.createEmpty()}
          onConfirm={confirmAnnotation}
          onCancel={removeAnnotation}
        />
      )}
      <div
        className={props.className}
        onMouseDown={isActive ? removeAnnotation : promptForAnnotation}
      >
        <i className="far"></i>
        <span>Annotation</span>
      </div>
    </>
  )
}
