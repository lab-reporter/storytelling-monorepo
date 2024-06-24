import React, { useEffect, useState } from 'react'
import HongKongFontProject from './react-components/index'

export function HongKongFontProjectForKeystoneEditorCMS(props: {
  name: string
}) {
  const { name } = props
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
    <HongKongFontProject />
  )
}

export { HongKongFontProject }

export default {
  HongKongFontProject,
  HongKongFontProjectForKeystoneEditorCMS,
}
