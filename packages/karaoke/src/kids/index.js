import React/* eslint-disable-line */, { useEffect, useRef, useState } from 'react'
import Quote from './quote'
import styled from 'styled-components'
import { mediaQuery } from './media-query'
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
function useMuted(initialValue = false) {
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

/**
 *  @typedef {Object} KaraokeProps
 *  @property {string[]} audioUrls,
 *  @property {string} [className]
 *  @property {string} [preload='auto'] - 'auto', 'none' or 'metadata'. `preload` attribute of `audio` tag.
 *  @property {string[]} quoteArr - quote text
 *  @property {string} [quoteBy]
 */

/**
 *  @param {KaraokeProps} props
 */
export function Karaoke({
  audioUrls,
  className,
  preload = 'auto',
  quoteArr,
  quoteBy,
}) {
  const defaultDuration = 10 // second
  const audioRef = useRef(null)
  const currentTime = useRef(0)
  const [muted, setMuted] = useMuted(true)
  const [containerRef, inView] = useInView({
    rootMargin: '-25% 0% -25% 0%',
    threshold: 0,
  })

  const [audioOpts, setAudioOpts] = useState({
    paused: !inView,
    duration: defaultDuration,
    ended: false,
  })

  useEffect(() => {
    const audio = audioRef.current
    const onLoadedMetadata = () => {
      console.log('[react-karaoke] `onLoadedMetadata` event invoked. audio duration:', audio.duration)
      setAudioOpts((opts) => {
        return Object.assign({}, opts, {
          duration: audio.duration || defaultDuration,
        })
      })
    }

    if (audio) {
      if (audio.readyState > 0) {
        console.log(
          '[react-karaoke] set duration without `onLoadedMetadata` event triggered. duration: ',
          audio.duration
        )
        setAudioOpts((opts) => {
          return Object.assign({}, opts, {
            duration: audio.duration || defaultDuration,
          })
        })
        return
      }

      audio.addEventListener('loadedmetadata', onLoadedMetadata)
    }

    // clear event listeners
    return () => {
      audio.removeEventListener('loadedmetadata', onLoadedMetadata)
    }
  }, [])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) {
      return
    }
    // set audio muted attribute according to browser muted state
    audio.muted = muted
  }, [muted])

  useEffect(
    () => {
      const audio = audioRef.current
      if (!audio) {
        return
      }
      // in the viewport
      if (inView) {
        // start with `currentTime` to catch up `Quote` animation
        audio.currentTime = currentTime.current
        const startPlayPromise = audio.play()
        startPlayPromise
          // play successfully
          .then(() => {
            console.log('[react-karaoke] audio plays successfully.')
          })
          // fail to play
          .catch((error) => {
            // browser prevent from playing audio before user interactions
            console.log('[react-karaoke] unable to play audio')
            console.log('[react-karaoke] error: ', error)
          })
      } else {
        // leave the viewport
        audio.pause()
      }
      setAudioOpts((opts) =>
        Object.assign({}, opts, {
          paused: !inView,
        })
      )
    },
    // `inView` is used to avoid from infinite re-rendering.
    // `muted` is avoid state not changed due to closure.
    [inView]
  )

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
  const safariWorkaround = () => {
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

  const audioBtJsx = (
    <AudioBt
      onClick={() => {
        const audio = audioRef.current
        if (audio) {
          if (muted || audioOpts.paused) {
            audio.currentTime = currentTime.current
            audio.muted = false
            audio.play()
            setMuted(false)
          } else {
            audio.pause()
            setMuted(true)
          }
          audio.setAttribute('data-played', true)
        }

        safariWorkaround()
      }}
    >
      {audioOpts.paused || muted ? (
        <MuteIcon />
      ) : (
        <SoundIcon />
      )}
    </AudioBt>
  )

  return (
    <QuoteContainer className={className} ref={containerRef}>
      <Logo />
      <audio
        ref={audioRef}
        preload={preload}
        data-react-karaoke
        data-played={false}
      >
        {audioUrls.map((url, index) => (
          <source key={`audio_source_${index}`} src={url}></source>
        ))}
      </audio>
      <Quote
        key={
          `quote_in_view_${inView}_${audioOpts.duration}` /** use key to force re-rendering */
        }
        textArr={quoteArr}
        play={!audioOpts.paused}
        duration={audioOpts.duration}
        onCurrentTimeUpdate={(_currentTime) => {
          currentTime.current = _currentTime
        }}
      />
      { quoteBy ? <QuoteBy>{quoteBy}</QuoteBy> : null }
      {audioBtJsx}
    </QuoteContainer>
  )
}

const AudioBt = styled.div`
  cursor: pointer;
`

const QuoteBy = styled.div`
  font-family: Noto Sans TC,Sans-Serif,serif;
  font-size: 16px;
  font-weight: 500;
  line-height: 1.5;
  letter-spacing: 0.05em;

  margin-top: 15px;

  color: #747474;
`

const QuoteContainer = styled.div`
  box-sizing: border-box;

  /* clients should provide below fonts */
  font-family: SweiMarkerSansCJKtc-Regular,Noto Sans TC,Sans-Serif,serif;

  position: relative;
  width: 100%;
  max-width: 700px;

  background-color: #F4F4F4;

  border-radius: 20px;

  padding: 60px 40px 90px 40px;
  margin-left: auto;
  margin-right: auto;

  ${mediaQuery.smallOnly} {
    padding: 60px 20px 80px 20px;
  }

  ${AudioBt} {
    position: absolute;

    right: 40px;
    bottom: 40px;

    ${mediaQuery.smallOnly} {
      right: 23px;
      bottom: 23px;
    }
  }
`

function SoundIcon({ className, onClick }) {
  return (
    <img
      className={className}
      src="https://www.unpkg.com/@story-telling-reporter/react-karaoke/public/icons/playing.kids.svg"
      width="100%"
      onClick={onClick}
    />
  )
}

function MuteIcon({ className, onClick }) {
  return (
    <img
      className={className}
      src="https://www.unpkg.com/@story-telling-reporter/react-karaoke/public/icons/paused.kids.svg"
      width="100%"
      onClick={onClick}
    />
  )
}

function LogoIcon({ className }) {
  return (
    <img
      className={className}
      src="https://www.unpkg.com/@story-telling-reporter/react-karaoke/public/icons/karaoke-logo.kids.svg"
      width="100%"
    />
  )
}

const Logo = styled(LogoIcon)`
  position: absolute;

  left: 50%;
  top: 0;

  transform: translate(-50%, -50%);
  width: 100px;
`
