import React from 'react'
import { FieldProps } from '@keystone-6/core/types'
import { FieldContainer, FieldLabel } from '@keystone-ui/fields'
import { controller } from '@keystone-6/core/fields/types/json/views'
import { CaptionEditor } from '@story-telling-reporter/react-scrollable-video'

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
        sources={editorState?.video?.sources}
        captions={editorState?.captions}
        // @ts-ignore @story-telling-reporter/react-scrollable-video lacks of type definition
        onChange={(state) => {
          const newEditorState = {
            video: editorState.video,
            captions: state.captions,
          }

          if (typeof onFieldChange === 'function') {
            onFieldChange(JSON.stringify(newEditorState))
          }
        }}
      />
    </FieldContainer>
  )
}
