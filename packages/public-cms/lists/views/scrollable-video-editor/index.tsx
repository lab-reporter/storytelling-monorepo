import React, { useCallback, useState } from 'react'
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
      <div style={{ position: 'relative', zIndex: 30 }}>
        {' '}
        {/* add zIndex to be in front of list's save button */}
        <ScrollableVideoEditor {...svProp} onChange={onChange} />
      </div>
    </FieldContainer>
  )
}
