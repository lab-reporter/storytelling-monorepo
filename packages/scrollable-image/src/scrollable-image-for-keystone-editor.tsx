import React, { useEffect, useState } from 'react'
import { ScrollableImage, ScrollableImageProps } from './scrollable-image'

export function ScrollableImageForKeystoneEditorCMS(
  props: ScrollableImageProps & { name: string }
) {
  const { name, ...rest } = props
  const [messageOnly, setMessageOnly] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const host = document.location.hostname
    if (
      host !== 'keystone-editor.twreporter.org' &&
      host !== 'staging-keystone-editor.twreporter.org'
    ) {
      setMessageOnly(false)
    }
  }, [])

  if (!mounted) {
    return null
  }

  return messageOnly ? (
    <div
      style={{
        backgroundColor: 'rgba(0,0,0,0.5)',
        color: 'white',
        padding: '30px',
      }}
    >
      「橫著滾吧！」元件：{name}（編輯模式，不載入元件）
    </div>
  ) : (
    <ScrollableImage {...rest} />
  )
}
