import React, { useState } from 'react'
import { AlertDialog } from '@keystone-ui/modals'
import { EditorState, Modifier } from 'draft-js'
import { TextInput } from '@keystone-ui/fields'
import styled from 'styled-components'

export const customStylePrefix = 'FONT_COLOR_'

const ColorHexInput = styled(TextInput)`
  margin-right: 10px;
  padding: 10px;
`

type FontColorButtonProps = {
  className?: string
  isActive: boolean
  editorState: EditorState
  onChange: (editorState: EditorState) => void
  onEditStart: () => void
  onEditFinish: () => void
}

export function FontColorButton(props: FontColorButtonProps) {
  const { isActive, editorState, onChange } = props

  const [toShowColorInput, setToShowColorInput] = useState(false)
  const [colorValue, setColorValue] = useState('')

  const promptForColor = (e: React.MouseEvent) => {
    e.preventDefault()
    const selection = editorState.getSelection()
    if (!selection.isCollapsed()) {
      setToShowColorInput(true)
    }
  }

  const confirmColor = () => {
    const selection = editorState.getSelection()
    let contentState = editorState.getCurrentContent()
    const fontColorInlineStyle = editorState
      .getCurrentInlineStyle()
      .find(
        (styleName) =>
          typeof styleName === 'string' &&
          styleName.startsWith(customStylePrefix)
      )

    if (fontColorInlineStyle) {
      contentState = Modifier.removeInlineStyle(
        contentState,
        selection,
        fontColorInlineStyle
      )
    }

    if (colorValue) {
      contentState = Modifier.applyInlineStyle(
        contentState,
        selection,
        customStylePrefix + colorValue
      )
    }

    onChange(EditorState.push(editorState, contentState, 'change-inline-style'))

    setToShowColorInput(false)
    setColorValue('')
  }

  const onColorInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.which === 13) {
      e.preventDefault()
      confirmColor()
    }
  }

  const removeColor = () => {
    const selection = editorState.getSelection()

    if (!selection.isCollapsed()) {
      const fontColorInlineStyle = editorState
        .getCurrentInlineStyle()
        .find(
          (styleName) =>
            typeof styleName === 'string' &&
            styleName.startsWith(customStylePrefix)
        )

      let contentState = editorState.getCurrentContent()

      if (fontColorInlineStyle) {
        contentState = Modifier.removeInlineStyle(
          contentState,
          selection,
          fontColorInlineStyle
        )
      }
      onChange(
        EditorState.push(editorState, contentState, 'change-inline-style')
      )
    }
    setToShowColorInput(false)
    setColorValue('')
  }

  const colorInput = (
    <AlertDialog
      title="Hex Color Code (#ffffff)"
      isOpen={toShowColorInput}
      actions={{
        cancel: {
          label: 'Cancel',
          action: removeColor,
        },
        confirm: {
          label: 'Confirm',
          action: confirmColor,
        },
      }}
    >
      <ColorHexInput
        onChange={(e) => setColorValue(e.target.value)}
        type="text"
        value={colorValue}
        onKeyDown={onColorInputKeyDown}
      />
    </AlertDialog>
  )

  return (
    <React.Fragment>
      {colorInput}
      <div
        className={props.className}
        onMouseDown={isActive ? removeColor : promptForColor}
      >
        <i className="fas fa-palette"></i>
      </div>
    </React.Fragment>
  )
}
