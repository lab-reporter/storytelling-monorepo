import React, { useEffect, useState } from 'react'
import { ScrollableVideo, ScrollableVideoProps } from './index'

export function ScrollableVideoForKeystoneEditorCMS(
  props: ScrollableVideoProps & { name: string }
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
      捲動式影片元件：{name}（編輯模式，不載入影片）
    </div>
  ) : (
    <ScrollableVideo {...rest} />
  )
}
