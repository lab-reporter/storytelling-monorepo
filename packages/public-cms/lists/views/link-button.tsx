import React from 'react'
import { FieldProps } from '@keystone-6/core/types'
import { Button } from '@keystone-ui/button'
import { FieldLabel, FieldContainer } from '@keystone-ui/fields'
import { controller } from '@keystone-6/core/fields/types/virtual/views'

export const Field = ({ value }: FieldProps<typeof controller>) => {
  if (typeof value === 'object' && value !== null) {
    const href = value['href']
    const label = value['label']
    const buttonLabel = value['buttonLabel']
    return (
      <FieldContainer>
        <FieldLabel>{label}</FieldLabel>
        <a href={href} target="_blank" style={{ textDecoration: 'none' }}>
          <Button>{buttonLabel}</Button>
        </a>
      </FieldContainer>
    )
  } else {
    return null
  }
}
