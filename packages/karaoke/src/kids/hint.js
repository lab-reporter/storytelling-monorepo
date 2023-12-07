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
        本文章有金句聲音元件，{'\n'}
        可聽見兒少代表的心聲，
      </HintText>
      <Button>
        <Icon
          onClick={() => {
            if (muted) {
              safariWorkaround()
            }
            setMuted(!muted)
          }}
        >
          <MuteIcon style={{ display: muted ? 'inline-block' : 'none' }} />
          <SoundIcon style={{ display: muted ? 'none' : 'inline-block' }} />
        </Icon>
        <span>點擊開啟聲音</span>
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

const Icon = styled.div`
  position: relative;

  width: 36px;
  height: 36px;

  cursor: pointer;

  > img {
    position: absolute;
  }
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
  const otherAudios = document.querySelectorAll(
    'audio[data-react-karaoke][data-played=false]'
  )
  otherAudios.forEach(
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
