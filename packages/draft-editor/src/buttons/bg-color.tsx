import React, { useState } from 'react'
import { AlertDialog } from '@keystone-ui/modals'
import { EditorState, Modifier } from 'draft-js'
import { TextInput } from '@keystone-ui/fields'
import styled from 'styled-components'

export const customStylePrefix = 'BACKGROUND_COLOR_'

const ColorHexInput = styled(TextInput)`
  margin-right: 10px;
  padding: 10px;
`

type BackgroundColorButtonProps = {
  className?: string
  isActive: boolean
  editorState: EditorState
  onChange: (editorState: EditorState) => void
  onEditStart: () => void
  onEditFinish: () => void
}

export function BackgroundColorButton(props: BackgroundColorButtonProps) {
  const { isActive, editorState, onChange } = props

  const [toShowColorInput, setToShowColorInput] = useState(false)
  const [colorValue, setColorValue] = useState('')

  const promptForColor = (e: React.MouseEvent) => {
    e.preventDefault()
    props.onEditStart()
    const selection = editorState.getSelection()
    if (!selection.isCollapsed()) {
      setToShowColorInput(true)
    }
  }

  const confirmColor = () => {
    const selection = editorState.getSelection()
    let contentState = editorState.getCurrentContent()
    const bgColorInlineStyle = editorState
      .getCurrentInlineStyle()
      .find(
        (styleName) =>
          typeof styleName === 'string' &&
          styleName.startsWith(customStylePrefix)
      )

    if (bgColorInlineStyle) {
      contentState = Modifier.removeInlineStyle(
        contentState,
        selection,
        bgColorInlineStyle
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
    props.onEditFinish()
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
      const bgColorInlineStyle = editorState
        .getCurrentInlineStyle()
        .find(
          (styleName) =>
            typeof styleName === 'string' &&
            styleName.startsWith(customStylePrefix)
        )

      let contentState = editorState.getCurrentContent()

      if (bgColorInlineStyle) {
        contentState = Modifier.removeInlineStyle(
          contentState,
          selection,
          bgColorInlineStyle
        )
      }
      onChange(
        EditorState.push(editorState, contentState, 'change-inline-style')
      )
    }
    setToShowColorInput(false)
    setColorValue('')
    props.onEditFinish()
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
        <svg
          width="16"
          height="14"
          viewBox="0 0 16 14"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M3.74443 8.75V6.78945C3.74443 6.37109 3.98306 5.98008 4.34542 5.73125L12.3911 0.229633C12.6091 0.0804726 12.8477 0 13.1453 0C13.4811 0 13.8022 0.124113 14.0409 0.345078L15.6553 1.84242C15.8939 2.06336 16 2.36305 16 2.67531C16 2.92578 15.9411 3.14727 15.779 3.37422L9.85159 10.8418C9.5835 11.1781 9.1357 11.375 8.71147 11.375H6.57264L5.85086 12.0695C5.4826 12.4113 4.8875 12.4113 4.51924 12.0695L3.02265 10.6805C2.65439 10.3387 2.65439 9.78633 3.02265 9.44453L3.74443 8.75ZM13.9466 2.73219L13.0834 1.9302L6.74646 6.26172L9.25354 8.58867L13.9466 2.73219ZM0.207107 12.7504L2.064 11.0277L4.14509 12.9582L3.23182 13.784C3.09925 13.9316 2.91954 14 2.73099 14H0.707052C0.3167 14 0 13.7074 0 13.3438V13.2152C0 13.0184 0.0745351 12.8734 0.207107 12.7504Z"
            fill={isActive ? '#ED8B00' : '#6b7280'}
          />
        </svg>
        <span> Highlight</span>
      </div>
    </React.Fragment>
  )
}
