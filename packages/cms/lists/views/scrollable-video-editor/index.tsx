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
        videoSrc={editorState?.videoSrc}
        captions={editorState?.captions}
        onChange={({
          videoDuration,
          captions,
        }: {
          videoDuration?: number
          captions?: CaptionState[]
        }) => {
          const newEditorState = {}
          if (videoDuration) {
            Object.assign(newEditorState, editorState, {
              videoDuration,
            })
          }

          if (captions) {
            Object.assign(newEditorState, editorState, {
              captions,
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
