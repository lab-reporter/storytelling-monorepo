import React, { useRef } from 'react'
import styled from '../styled-components'
import { MuteIcon, SoundIcon, SeparationLine } from './icons'
import { mediaQuery } from './utils/media-query'
import { useMuted, testPlayOtherMediaElements } from '../hooks'

export function Hint({ className, id }: { className?: string; id: string }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [muted, setMuted] = useMuted(true, containerRef)

  return (
    <Container
      id={id}
      className={className}
      data-twreporter-story-telling
      data-react-ui-toolkit
      data-muted-hint
      data-muted={muted}
      ref={containerRef}
    >
      <HintText>
        {muted
          ? '本文含聲音敘事，開啟聲音以獲得完整閱讀體驗'
          : '已開啟本篇文章的聲音'}
      </HintText>
      <Button
        className={muted ? 'dark' : 'light'}
        onClick={() => {
          setMuted(!muted)

          // Through this user interaction,
          // trigger other scroll-to-audio elements to play sound as well,
          // to prevent the browser from blocking playback later.
          testPlayOtherMediaElements()
        }}
      >
        {muted ? <span>開啟聲音</span> : <span>關閉聲音</span>}
        {muted ? <SoundIcon /> : <MuteIcon />}
      </Button>
      <SeparationLineContainer>
        <SeparationLine />
      </SeparationLineContainer>
    </Container>
  )
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;

  margin-left: auto;
  margin-right: auto;

  /* mobile */
  width: calc(100vw - 68px);

  ${mediaQuery.tabletAbove} {
    padding-left: 24px;
    padding-right: 24px;
  }

  ${mediaQuery.tabletOnly} {
    width: 453px;
  }

  ${mediaQuery.desktopOnly} {
    width: 480px;
  }

  ${mediaQuery.hdOnly} {
    width: 580px;
  }
`

const Button = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 4px;

  padding: 4px 12px;
  border-radius: 40px;

  cursor: pointer;

  > span {
    font-size: 14px;
    font-family: Noto Sans TC, Sans-Serif, serif;
    font-weight: 500;
    line-height: 21px;
  }

  > svg {
    width: 18px;
    height: 18px;
  }

  &.dark {
    background-color: #404040;
    color: #fff;

    svg {
      fill: #fff;
    }
  }

  &.light {
    background-color: #fff;
    color: #404040;

    svg {
      fill: #404040;
    }
  }

  /**
   * prevent sticky hover effects on touch devices
   * see: https://stackoverflow.com/questions/17233804/how-to-prevent-sticky-hover-effects-for-buttons-on-touch-devices
   **/
  @media (hover: hover) {
    &.dark:hover {
      background-color: #000;
    }

    &.light:hover {
      background-color: #e2e2e2;
    }
  }
`

const HintText = styled.p`
  /* clear default margin */
  margin: 0;

  text-align: center;

  font-family: Noto Sans TC, Sans-Serif, serif;
  font-weight: 400;
  font-size: 14px;
  line-height: 21px;
  letter-spacing: 0em;
  color: #808080;
`

const SeparationLineContainer = styled.div`
  width: 192px;
  margin-top: 24px;

  ${mediaQuery.hdOnly} {
    width: 272px;
  }
`
