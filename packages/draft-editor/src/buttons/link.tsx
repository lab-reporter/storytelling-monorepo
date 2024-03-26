import React, { useState } from 'react'
import { EditorState, RichUtils } from 'draft-js'
import { LinkEditor } from '../entity-decorators/editable-link'
import { Entity } from '../constants'

export const LinkButton = (props: {
  className?: string
  isActive: boolean
  editorState: EditorState
  onChange: (arg0: EditorState) => void
  onEditStart: () => void
  onEditFinish: () => void
}) => {
  const { isActive, editorState, onChange } = props
  const [toShowUrlInput, setToShowUrlInput] = useState(false)

  const promptForLink = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault()
    const selection = editorState.getSelection()
    if (!selection.isCollapsed()) {
      props.onEditStart()
      setToShowUrlInput(true)
    }
  }

  const confirmLink = (urlValue: string) => {
    const contentState = editorState.getCurrentContent()
    const contentStateWithEntity = contentState.createEntity(
      Entity.Link,
      'MUTABLE',
      { url: urlValue }
    )
    const entityKey = contentStateWithEntity.getLastCreatedEntityKey()
    const newEditorState = EditorState.set(editorState, {
      currentContent: contentStateWithEntity,
    })
    onChange(
      RichUtils.toggleLink(
        newEditorState,
        newEditorState.getSelection(),
        entityKey
      )
    )

    setToShowUrlInput(false)
    props.onEditFinish()
  }

  const removeLink = () => {
    const selection = editorState.getSelection()
    if (!selection.isCollapsed()) {
      onChange(RichUtils.toggleLink(editorState, selection, null))
    }
    setToShowUrlInput(false)
    props.onEditFinish()
  }

  return (
    <>
      {toShowUrlInput && (
        <LinkEditor
          isOpen={toShowUrlInput}
          urlValue={''}
          onConfirm={confirmLink}
          onCancel={removeLink}
        />
      )}
      <div
        className={props.className}
        onMouseDown={isActive ? removeLink : promptForLink}
      >
        <i className="fas fa-link"></i>
      </div>
    </>
  )
}
