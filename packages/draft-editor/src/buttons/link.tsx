import React, { useState } from 'react'
import { AlertDialog } from '@keystone-ui/modals'
import { EditorState, RichUtils } from 'draft-js'
import { TextInput } from '@keystone-ui/fields'

const styles = {
  urlInput: {
    fontFamily: "'Georgia', serif",
    marginRight: 10,
    padding: 10,
  },
}

export function LinkButton(props: {
  className?: string
  isActive: boolean
  editorState: EditorState
  onChange: (arg0: EditorState) => void
  onEditStart: () => void
  onEditFinish: () => void
}) {
  const { isActive, editorState, onChange } = props

  const [toShowUrlInput, setToShowUrlInput] = useState(false)
  const [urlValue, setUrlValue] = useState('')

  const promptForLink = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault()
    props.onEditStart()
    const selection = editorState.getSelection()
    if (!selection.isCollapsed()) {
      setToShowUrlInput(true)
    }
  }

  const confirmLink = () => {
    const contentState = editorState.getCurrentContent()
    const contentStateWithEntity = contentState.createEntity(
      'LINK',
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
    setUrlValue('')
    props.onEditFinish()
  }

  const onLinkInputKeyDown = (e) => {
    if (e.which === 13) {
      e.preventDefault()
      confirmLink()
    }
  }

  const removeLink = () => {
    const selection = editorState.getSelection()
    if (!selection.isCollapsed()) {
      onChange(RichUtils.toggleLink(editorState, selection, null))
    }
    setToShowUrlInput(false)
    setUrlValue('')
    props.onEditFinish()
  }

  const urlInput = (
    <AlertDialog
      title="Insert LINK"
      isOpen={toShowUrlInput}
      actions={{
        cancel: {
          label: 'Cancel',
          action: removeLink,
        },
        confirm: {
          label: 'Confirm',
          action: confirmLink,
        },
      }}
    >
      <TextInput
        onChange={(e) => setUrlValue(e.target.value)}
        style={styles.urlInput}
        type="text"
        value={urlValue}
        onKeyDown={onLinkInputKeyDown}
      />
    </AlertDialog>
  )

  return (
    <React.Fragment>
      {urlInput}
      <div
        className={props.className}
        onMouseDown={isActive ? removeLink : promptForLink}
      >
        <i className="fas fa-link"></i>
      </div>
    </React.Fragment>
  )
}
