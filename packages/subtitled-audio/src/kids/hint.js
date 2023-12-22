import React/* eslint-disable-line */, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { MuteIcon, SoundIcon } from './icons'
import { mediaQuery } from './utils/media-query'

export function Hint({ className, text, muted = true, onClick }) {
  return (
    <Container className={className}>
      <HintText>{text}</HintText>
      <Button onClick={onClick}>
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
    font-size: 14px;
    font-family: Noto Sans TC, Sans-Serif, serif;
    font-weight: 500;
    color: #666;
  }
`

const HintText = styled.p`
  text-align: center;

  font-family: Swei Marker Sans CJK TC, Noto Sans TC, Sans-Serif, serif;
  font-weight: 400;
  font-size: 20px;
  line-height: 1.5;
  color: #000;

  white-space: nowrap;

  ${mediaQuery.smallOnly} {
    white-space: pre-wrap;
  }
`
