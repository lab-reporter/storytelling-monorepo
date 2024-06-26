import React, { useEffect, useState, useRef } from 'react'

import BlowUpFontLayout from './blow-up'
import LeeHonKongKaiLayout from './lee-hon-kong-kai'
import LeeHonTungKaiLayout from './lee-hon-tung-kai'
import PrisonFontLayout from './prison'

import styled, { keyframes } from '../styled-components'
import { CloseBt as _CloseBt, HintCover, StartBt } from './styled'
import { Transition } from 'react-transition-group'
import { urlPrefix } from '../constants'

const CloseBt = styled(_CloseBt)`
  position: absolute;
  top: 100px;
  right: 10px;
`

const Container = styled.div`
  position: relative;
  background-color: lightblue;

  > img {
    width: 100%;
  }
`

const enlarge = keyframes`
  0% {
    width: 36%;
    height: 36%;
    opacity: 1;
  }

  100% {
    width: 95%;
    height: 95%;
    opacity: 0;
  }
`

const Circle = styled.div`
  width: 50px;
  height: 50px;
  position: relative;
  cursor: pointer;

  > div {
    width: 36%;
    height: 36%;
    background: #fff;
    position: absolute;
    border-radius: 50%;
    animation-name: ${enlarge};
    animation-iteration-count: infinite;
    animation-duration: 2s;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  > div:first-child: {
    animation-delay: 2s;
  }

  > div:nth-child(2) {
    animation-delay: 0.5s;
  }

  > div:last-child {
    animation-delay: 1.5s;
  }
`

function Point() {
  return (
    <Circle>
      <div />
      <div />
      <div />
    </Circle>
  )
}

const PointContainer = styled.div<{ $left: number; $top: number }>`
  position: absolute;
  left: ${(props) => `calc(${props.$left}/375*100%)`};
  top: ${(props) => `calc(${props.$top}/667*100%)`};
  transform: translate(-100%, -100%);
`

enum FontName {
  BLOW_UP = '爆北魏體',
  LEE_HON_KONG_KAI = '一體成型字',
  LEE_HON_TUNG_KAI = '勾通字',
  PRISON = '監獄體',
}

export default function HongKongProject() {
  const [selectedFont, setSelectedFont] = useState('')
  const [toInteractWithModel, setToInteractWithModel] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const closeBtJsx = <CloseBt onClick={() => setSelectedFont('')} />
  const fontLayout = (
    <>
      <FadedFont in={selectedFont === FontName.BLOW_UP}>
        {closeBtJsx}
        <BlowUpFontLayout />
      </FadedFont>
      <FadedFont in={selectedFont === FontName.LEE_HON_KONG_KAI}>
        {closeBtJsx}
        <LeeHonKongKaiLayout />
      </FadedFont>
      <FadedFont in={selectedFont === FontName.LEE_HON_TUNG_KAI}>
        {closeBtJsx}
        <LeeHonTungKaiLayout />
      </FadedFont>
      <FadedFont in={selectedFont === FontName.PRISON}>
        {closeBtJsx}
        <PrisonFontLayout />
      </FadedFont>
    </>
  )

  useEffect(() => {
    const container = containerRef.current

    if (selectedFont !== '' && container) {
      containerRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })

      return document.body.classList.add('disable-scroll')
    }
    document.body.classList.remove('disable-scroll')

    return () => {
      document.body.classList.remove('disable-scroll')
    }
  }, [selectedFont])

  useEffect(() => {
    const container = containerRef.current
    if (toInteractWithModel && container) {
      containerRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
    }
  }, [toInteractWithModel])

  return (
    <Container ref={containerRef}>
      {!toInteractWithModel && (
        <HintCover>
          <p>你即將進入互動體驗，點擊物件可查看街景中字體的故事</p>
          <StartBt
            $disabled={false}
            onClick={() => {
              setToInteractWithModel(true)
            }}
          >
            開始體驗
          </StartBt>
        </HintCover>
      )}
      {toInteractWithModel && (
        <>
          <img src={`${urlPrefix}/public/mobile-scene.png`} />
          <PointContainer
            $left={90}
            $top={280}
            onClick={() => {
              setSelectedFont(FontName.BLOW_UP)
            }}
          >
            <Point />
          </PointContainer>
          <PointContainer
            $left={300}
            $top={280}
            onClick={() => {
              setSelectedFont(FontName.LEE_HON_KONG_KAI)
            }}
          >
            <Point />
          </PointContainer>
          <PointContainer
            $left={250}
            $top={380}
            onClick={() => {
              setSelectedFont(FontName.LEE_HON_TUNG_KAI)
            }}
          >
            <Point />
          </PointContainer>
          <PointContainer
            $left={50}
            $top={380}
            onClick={() => {
              setSelectedFont(FontName.PRISON)
            }}
          >
            <Point />
          </PointContainer>
          {fontLayout}
        </>
      )}
    </Container>
  )
}

const duration = 300 // ms

const defaultStyle = {
  width: '100%',
  position: 'absolute' as const,
  top: '0',
  left: 0,
  transition: `opacity ${duration}ms ease-in-out`,
  opacity: 0,
  background: 'linear-gradient(180deg, #dee4e8 10%, #c3d7e6 57%, #96d0f9 100%)',
}

const transitionStyles = {
  entering: { opacity: 1 },
  entered: { opacity: 1 },
  exiting: { opacity: 0 },
  exited: { opacity: 0 },
  unmounted: {},
}

function FadedFont({
  in: inProp,
  children,
}: {
  in: boolean
  children: React.ReactNode
}) {
  const nodeRef = useRef(null)
  return (
    <Transition nodeRef={nodeRef} in={inProp} timeout={duration} unmountOnExit>
      {(state) => (
        <div
          ref={nodeRef}
          style={{
            ...defaultStyle,
            ...transitionStyles[state],
            transition: inProp ? `opacity ${duration}ms ease-in-out` : '',
          }}
        >
          {children}
        </div>
      )}
    </Transition>
  )
}
