import React, { useRef } from 'react'
import styled from 'styled-components'
import { MuteIcon, SoundIcon } from './icons'
import { mediaQuery } from './utils/media-query'
import { useMuted } from '../hooks'

export function Hint({
  className,
  text,
  id,
}: {
  className?: string
  text: string
  id: string
}) {
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
      <HintText>{text}</HintText>
      <Button
        onClick={() => {
          setMuted(!muted)
        }}
      >
        <Icon>{muted ? <MuteIcon /> : <SoundIcon />}</Icon>
        <span>{muted ? '點擊開啟聲音' : '點擊關閉聲音'}</span>
      </Button>
    </Container>
  )
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  margin-bottom: 60px;
`

const Icon = styled.div`
  width: 36px;
  height: 36px;

  cursor: pointer;
`

const Button = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;

  > span {
    /* clients should provide below fonts */
    font-family: source-han-sans-traditional, Noto Sans TC, PingFang TC,
      Apple LiGothic Medium, Roboto, Microsoft JhengHei, Lucida Grande,
      Lucida Sans Unicode, sans-serif;
    font-size: 12px;
    font-weight: 500;
    color: #666;
  }
`

const HintText = styled.p`
  text-align: center;

  font-family: Swei Marker Sans CJK TC, Noto Sans TC, Sans-Serif, serif;
  font-weight: 400;
  font-size: 16px;
  line-height: 1.5;
  color: #666;

  white-space: nowrap;

  ${mediaQuery.smallOnly} {
    white-space: pre-wrap;
  }
`
