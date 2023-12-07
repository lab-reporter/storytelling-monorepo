import React/* eslint-disable-line */, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { mediaQuery } from './utils/media-query'

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
  return (
    <Container className={className}>
      <IconContainer
        onClick={() => {
          if (muted) {
            safariWorkaround()
          }
          setMuted(!muted)
        }}
      >
        <MuteIcon style={{ display: muted ? 'inline-block' : 'none' }} />
        <SoundIcon style={{ display: muted ? 'none' : 'inline-block' }} />
      </IconContainer>
      <HintText>
        本文章有金句聲音元件，可聽見兒少代表的心聲，
        <br />
        按<StyledToggleIcon />
        開啟／關閉體驗
      </HintText>
      <MobileHintText>
        本文章有金句聲音元件，
        <br />
        可聽見兒少代表的心聲，
        <br />
        按<StyledToggleIcon />
        開啟／關閉體驗
      </MobileHintText>
    </Container>
  )
}

function SoundIcon({ className, onClick, style }) {
  return (
    <img
      className={className}
      src="https://www.unpkg.com/@story-telling-reporter/react-karaoke/public/icons/kids/hint-sound.svg"
      style={style}
      width="100%"
      onClick={onClick}
    />
  )
}

function MuteIcon({ className, onClick, styles }) {
  return (
    <img
      className={className}
      src="https://www.unpkg.com/@story-telling-reporter/react-karaoke/public/icons/kids/hint-mute.svg"
      styles={styles}
      width="100%"
      onClick={onClick}
    />
  )
}

function ToggleIcon({ className }) {
  return (
    <img
      className={className}
      src="https://www.unpkg.com/@story-telling-reporter/react-karaoke/public/icons/kids/hint-toggle.svg"
      width="100%"
    />
  )
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
`

const IconContainer = styled.div`
  position: relative;

  width: 100px;
  height: 100px;

  cursor: pointer;

  > img {
    position: absolute;
  }
`

const StyledToggleIcon = styled(ToggleIcon)`
  display: inline;
  width: 30px;
  vertical-align: bottom;
`

const HintText = styled.p`
  text-align: center;

  font-family: Swei Marker Sans CJK TC, Noto Sans TC, Sans-Serif, serif;
  font-weight: 400;
  font-size: 20px;
  line-height: 1.5;
  color: #000;

  ${mediaQuery.smallOnly} {
    display: none;
  }
`

const MobileHintText = styled(HintText)`
  ${mediaQuery.smallOnly} {
    display: block;
  }

  ${mediaQuery.mediumAbove} {
    display: none;
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
