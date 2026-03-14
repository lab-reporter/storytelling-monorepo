import React, { useState, useCallback } from 'react'
import { FieldProps } from '@keystone-6/core/types'
import { FieldContainer, FieldLabel } from '@keystone-ui/fields'
import { controller } from '@keystone-6/core/fields/types/json/views'
import {
  ScrollableImageEditor,
  ScrollableImageEditorProps,
} from '@story-telling-reporter/react-scrollable-image'

export const Field = ({
  field,
  value,
  onChange: onFieldChange,
}: FieldProps<typeof controller>) => {
  const [siProps, setSiProps] = useState<ScrollableImageEditorProps>(
    value ? JSON.parse(value) : {}
  )
  const [prevValue, setPrevValue] = useState(value)

  if (value !== prevValue) {
    setPrevValue(value)
    setSiProps(value ? JSON.parse(value) : {})
  }

  const onChange = useCallback(
    (newValue: ScrollableImageEditorProps) => {
      onFieldChange?.(JSON.stringify(newValue))
    },
    [onFieldChange]
  )

  return (
    <FieldContainer style={{ maxWidth: '700px' }}>
      <FieldLabel>{field.label}</FieldLabel>
      <div
        style={{ position: 'relative', zIndex: 30, backgroundColor: '#fff' }}
      >
        {' '}
        {/* add zIndex to be in front of list's save button */}
        <ScrollableImageEditor {...siProps} onChange={onChange} />
      </div>
    </FieldContainer>
  )
}
