import React from 'react'
import { FieldProps } from '@keystone-6/core/types'
import { FieldContainer, FieldLabel } from '@keystone-ui/fields'
import { controller } from '@keystone-6/core/fields/types/json/views'
import { CaptionEditor } from './editor'
import { CaptionState } from './type'

export const Field = ({
  field,
  value,
  onChange: onFieldChange,
}: FieldProps<typeof controller>) => {
  const editorState = JSON.parse(value)

  return (
    <FieldContainer>
      <FieldLabel>{field.label}</FieldLabel>
      <CaptionEditor
        videoObj={editorState?.videoObj}
        captions={editorState?.captions}
        onChange={(state: { duration?: number; captions?: CaptionState[] }) => {
          const newEditorState = {}
          if (state.duration) {
            Object.assign(newEditorState, editorState, {
              duration: state.duration,
            })
          }

          if (state.captions) {
            Object.assign(newEditorState, editorState, {
              captions: state.captions,
            })
          }

          if (typeof onFieldChange === 'function') {
            onFieldChange(JSON.stringify(newEditorState))
          }
        }}
      />
    </FieldContainer>
  )
}
