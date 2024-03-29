import React, { useState } from 'react'
import { FieldProps } from '@keystone-6/core/types'
import { FieldContainer, FieldLabel } from '@keystone-ui/fields'
import { controller } from '@keystone-6/core/fields/types/json/views'
import { ScrollableVideoEditor } from './editor'
import { ScrollableVideoProp } from './type'

export const Field = ({
  field,
  value,
  onChange: onFieldChange,
}: FieldProps<typeof controller>) => {
  const [svProp, setSvProp] = useState<ScrollableVideoProp>(
    value ? JSON.parse(value) : {}
  )
  const [prevValue, setPrevValue] = useState(value)

  if (value !== prevValue) {
    setPrevValue(value)
    setSvProp(value ? JSON.parse(value) : {})
  }

  return (
    <FieldContainer>
      <FieldLabel>{field.label}</FieldLabel>
      <ScrollableVideoEditor
        {...svProp}
        onChange={(newSvProp: ScrollableVideoProp) => {
          if (typeof onFieldChange === 'function') {
            onFieldChange(JSON.stringify(newSvProp))
          }
        }}
      />
    </FieldContainer>
  )
}
