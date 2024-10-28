import React, { useEffect, useState } from 'react'
import { FieldProps } from '@keystone-6/core/types'
import { FieldLabel, FieldContainer } from '@keystone-ui/fields'
import { controller } from '@keystone-6/core/fields/types/text/views'
import { TextInput } from '@keystone-ui/fields'
import { Notice } from '@keystone-ui/notice'

export const Field = ({
  field,
  value,
  onChange,
}: FieldProps<typeof controller>) => {
  let audioUrl = ''

  if (value.inner.kind === 'value') {
    audioUrl = value.inner.value
  }

  const [isValidUrl, setIsValidUrl] = useState(true)

  useEffect(() => {
    // do not validate empty string
    if (audioUrl === '') {
      return
    }

    const audio = new Audio()
    audio.oncanplaythrough = () => {
      setIsValidUrl(true)
    }
    audio.onerror = () => {
      setIsValidUrl(false)
    }
    audio.src = audioUrl
  }, [audioUrl])

  return (
    <FieldContainer>
      <FieldLabel>{field.label}</FieldLabel>
      <TextInput
        defaultValue={audioUrl}
        onChange={(e) => {
          onChange?.({
            ...value,
            inner: {
              kind: 'value',
              value: e.target.value,
            },
          })
        }}
      />
      {isValidUrl ? null : (
        <Notice tone="negative" marginTop="xxsmall">
          我們找不到或無法存取於該網址的音檔。請檢查網址是否有錯字。
        </Notice>
      )}
    </FieldContainer>
  )
}
