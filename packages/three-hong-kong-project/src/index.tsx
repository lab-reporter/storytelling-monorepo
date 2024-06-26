import React, { useEffect, useState } from 'react'
import {
  HongKongFontProject,
  HongKongFontProjectPlaceholder,
} from './react-components/index'
import MobileHongKongProject from './react-components/mobile'
import throttle from 'lodash/throttle'
import styled from './styled-components'

const _ = {
  throttle,
}

const Container = styled.div<{ $embedInTwreporterReact: boolean }>`
  ${({ $embedInTwreporterReact }) => {
    return $embedInTwreporterReact
      ? `
  /* 往上移動，使其與上一個區塊連接在一起。*/
    /* margin-top: -40px; */

  /* 左移動，撐滿文章頁 */
  @media (max-width: 767px) {
    margin-left: -3.4vw;
  }

  @media (min-width: 768px) and (max-width: 1023px) {
    margin-left: calc((100vw - 512px)/2 * -1);
  }

  @media (min-width: 1024px) and (max-width: 1439px) {
    margin-left: calc((100vw - 550px)/2 * -1);
  }

  @media (min-width: 1440px) {
    margin-left: calc((100vw - 730px)/2 * -1);
  }
  `
      : ''
  }}
`

export function EmbedHongKongFontProject({
  embedInTwreporterReact,
}: {
  embedInTwreporterReact: boolean
}) {
  const [messageOnly, setMessageOnly] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [mobileLayout, setMobileLayout] = useState(false)

  useEffect(() => {
    setMounted(true)
    const host = document.location.hostname
    if (
      host === 'keystone-editor.twreporter.org' ||
      host === 'staging-keystone-editor.twreporter.org'
    ) {
      setMessageOnly(true)
      return
    }

    const handleResize = _.throttle(() => {
      const width = document.documentElement.clientWidth
      if (width < 768) {
        setMobileLayout(true)
      } else {
        setMobileLayout(false)
      }
    }, 300)

    window.addEventListener('resize', handleResize)
    handleResize()

    // Clean up
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  if (!mounted) {
    return (
      <Container $embedInTwreporterReact={embedInTwreporterReact}>
        <HongKongFontProjectPlaceholder />
      </Container>
    )
  }

  if (mobileLayout) {
    return (
      <Container $embedInTwreporterReact={embedInTwreporterReact}>
        <MobileHongKongProject />
      </Container>
    )
  }

  return messageOnly ? (
    <div
      style={{
        backgroundColor: 'rgba(0,0,0,0.5)',
        color: 'white',
        padding: '30px',
      }}
    >
      香港字體 3D 專題（編輯模式，不載入模型）
    </div>
  ) : (
    <Container $embedInTwreporterReact={embedInTwreporterReact}>
      <HongKongFontProject />
    </Container>
  )
}
