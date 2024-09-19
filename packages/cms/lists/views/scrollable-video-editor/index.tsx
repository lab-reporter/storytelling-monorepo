import React, { useState, useCallback } from 'react'
import { FieldProps } from '@keystone-6/core/types'
import { FieldContainer, FieldLabel } from '@keystone-ui/fields'
import { controller } from '@keystone-6/core/fields/types/json/views'
import {
  ScrollableVideoEditor,
  ScrollableVideoEditorProps,
} from '@story-telling-reporter/react-scrollable-video'

export const Field = ({
  field,
  value,
  onChange: onFieldChange,
}: FieldProps<typeof controller>) => {
  const [svProp, setSvProp] = useState<ScrollableVideoEditorProps>(
    value ? JSON.parse(value) : {}
  )
  const [prevValue, setPrevValue] = useState(value)

  if (value !== prevValue) {
    setPrevValue(value)
    setSvProp(value ? JSON.parse(value) : {})
  }

  const onChange = useCallback((newValue: ScrollableVideoEditorProps) => {
    onFieldChange?.(JSON.stringify(newValue))
  }, [])

  return (
    <FieldContainer>
      <FieldLabel>{field.label}</FieldLabel>
      <ScrollableVideoEditor {...svProp} onChange={onChange} />
    </FieldContainer>
  )
}
