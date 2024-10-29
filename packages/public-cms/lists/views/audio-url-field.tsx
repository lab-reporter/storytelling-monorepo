import React, { useEffect, useState } from 'react'
import { FieldProps } from '@keystone-6/core/types'
import {
  Field as TextField,
  controller,
} from '@keystone-6/core/fields/types/text/views'
import { Stack } from '@keystone-ui/core'

export const Field = (props: FieldProps<typeof controller>) => {
  const value = props.value
  let audioUrl = ''

  if (value.inner.kind === 'value') {
    audioUrl = value.inner.value
  }

  const [isValidUrl, setIsValidUrl] = useState(true)

  useEffect(() => {
    // do not validate empty string
    if (audioUrl === '') {
      setIsValidUrl(true)
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
    <Stack gap="small">
      <TextField {...props} />
      {isValidUrl ? null : (
        <span style={{ color: 'red' }}>
          我們找不到或無法存取於該網址的音檔。請檢查網址是否有錯字。
        </span>
      )}
    </Stack>
  )
}
