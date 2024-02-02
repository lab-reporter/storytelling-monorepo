import React, { useState } from 'react'
import { FieldProps } from '@keystone-6/core/types'
import { FieldContainer, FieldLabel } from '@keystone-ui/fields'
import { controller } from '@keystone-6/core/fields/types/json/views'
import { CaptionEditor } from './editor'
import { CaptionState } from './type'

type EditorState = {
  captions: CaptionState[]
  videoSrc: string
  videoDuration: number
}

export const Field = ({
  field,
  value,
  onChange: onFieldChange,
}: FieldProps<typeof controller>) => {
  const [editorState, setEditorState] = useState<EditorState>(
    value ? JSON.parse(value) : {}
  )
  const [prevValue, setPrevValue] = useState(value)

  if (value !== prevValue) {
    setPrevValue(value)
    setEditorState(value ? JSON.parse(value) : {})
  }

  return (
    <FieldContainer>
      <FieldLabel>{field.label}</FieldLabel>
      <CaptionEditor
        key={editorState?.videoSrc}
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
