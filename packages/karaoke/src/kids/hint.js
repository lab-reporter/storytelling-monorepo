import React/* eslint-disable-line */, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

const HintContainer = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  background-color: #fff;

  ${AudioBt} {
    margin-bottom: 10px;
    & path {
      fill: #000;
    }
  }
`

const Text = styled.span`
  font-weight: 400;
  font-size: 12px;
  line-height: 180%;
  text-align: center;
  color: #000;

  @media ${breakpoint.devices.tablet} {
    font-size: 20px;
  }
`

export function Hint({ className }) {
  const hintAudioBtJsx = (
    <AudioBt
      onClick={() => {
        const audio = audioRef.current
        if (audio) {
          setMuted(!muted)
        }
        safariWorkaround()
      }}
    >
      {muted ? <PausedIcon /> : <PlayingIcon />}
    </AudioBt>
  )

}
