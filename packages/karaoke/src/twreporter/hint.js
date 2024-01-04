import React/* eslint-disable-line */, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { MuteIcon, SoundIcon } from './icons'
import { mediaQuery } from './utils/media-query'
import { useInView } from 'react-intersection-observer'

/**
 * This hook is used to record the mute status in the whole web page.
 * It's useful when there are multiple `Karaoke`s in the same web page.
 * If the user has clicked mute button in one `Karaoke` component,
 * we should mute all the rest audios as well.
 *
 * @param {boolean} initialValue
 * @return {[boolean, Function]}
 */
export function useMuted(initialValue = true) {
  const [muted, _setMuted] = useState(initialValue)
  useEffect(() => {
    const _muted = window?.['__story_telling_react_karaoke']?.muted
    if (typeof _muted === 'boolean') {
      _setMuted(_muted)
    }
  })
  const setMuted = (_muted) => {
    window['__story_telling_react_karaoke'] = {
      muted: _muted,
    }
    _setMuted(_muted)
  }

  return [muted, setMuted]
}

export function Hint({ className }) {
  const [muted, setMuted] = useMuted(true)
  const [containerRef] = useInView({
    threshold: 0,
  })
  return (
    <Container className={className} ref={containerRef}>
      <HintText>
        {muted
          ? '本文含聲音敘事，開啟聲音以獲得完整閱讀體驗'
          : '已開啟本篇文章的聲音'}
      </HintText>
      <Button
        className={muted ? 'dark' : 'light'}
        onClick={() => {
          if (muted) {
            safariWorkaround()
          }
          setMuted(!muted)
        }}
      >
        {muted ? <span>開啟聲音</span> : <span>關閉聲音</span>}
        {muted ? <MuteIcon /> : <SoundIcon />}
      </Button>
    </Container>
  )
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
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

  &.dark:hover {
    background-color: #000;
  }

  &.light:hover {
    background-color: #e2e2e2;
  }
`

const HintText = styled.p`
  text-align: center;

  font-family: Noto Sans TC, Sans-Serif, serif;
  font-weight: 400;
  font-size: 14px;
  line-height: 21px;
  letter-spacing: 0em;
  color: #808080;

  white-space: nowrap;

  ${mediaQuery.smallOnly} {
    white-space: pre-wrap;
  }
`

/**
 *  The following codes are WORKAROUND for Safari.
 *  Problem to workaround:
 *  In Safari, we still encounter `audio.play()` Promise rejection
 *  even users have had interactions. The interactions, in our case, will be button clicking.
 *
 *  Therefore, the following logics find all Karaoke `audio` elements which has NOT been played before,
 *  and try to `audio.play()` them.
 *  Since this event is triggered by user clicking,
 *  `audio.play()` will be successful without Promise rejection.
 *  After this event finishes, Safari browser won't block `audio.play()` anymore.
 */
export const safariWorkaround = () => {
  const otherMediaElements = document.querySelectorAll(
    'audio[data-autoplay="true"][data-played="false"],video[data-autoplay="true"][data-played="false"]'
  )
  console.log('otherMediaElements:', otherMediaElements)
  otherMediaElements.forEach(
    (
      /**
       *  @type HTMLAudioElement
       */
      audio
    ) => {
      audio.muted = true
      const playAttempt = audio.play()
      if (playAttempt) {
        playAttempt
          // play successfully
          .then(() => {
            // pause audio immediately
            audio.pause()
          })
          // fail to play
          .catch(() => {
            // do nothing
          })
      }
    }
  )
}
