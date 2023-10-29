import React/* eslint-disable-line */, { useEffect, useRef, useState } from 'react'
import _QuoteShadow from './quote-shadow'
import breakpoint from './breakpoint'
import mockups from './mockups'
import styled from 'styled-components'
import { useInView } from 'react-intersection-observer'

/**
 * @type {import('./typedef').KaraokeStyles}
 */
const defaultStyles = {
  mobile: {
    background: {
      color: '#fff',
    },
    font: {
      color: 'rgba(0,0,0,40%)',
      size: '16px',
      weight: '700',
    },
    lineHeight: '180%',
    textAlign: 'center',
    transitioned: {
      font: {
        color: '#000',
      },
    },
    image: {
      width: 'auto',
      height: 'auto',
      position: 'left',
    },
  },
  tablet: {
    background: {
      color: '#fff',
    },
    font: {
      color: 'rgba(0,0,0,40%)',
      size: '28px',
      weight: '700',
    },
    lineHeight: '180%',
    textAlign: 'center',
    transitioned: {
      font: {
        color: '#000',
      },
    },
    image: {
      width: 'auto',
      height: 'auto',
      position: 'left',
    },
  },
}

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
    const _muted = window?.['__readr_react_karaoke']?.muted
    if (typeof _muted === 'boolean') {
      _setMuted(_muted)
    }
  })
  const setMuted = (_muted) => {
    window['__readr_react_karaoke'] = {
      muted: _muted,
    }
    _setMuted(_muted)
  }

  return [muted, setMuted]
}

/**
 *  @typedef {Object} KaraokeProps
 *  @property {import('./typedef').KaraokeStyles} [styles]
 *  @property {string[]} audioUrls,
 *  @property {string} [className]
 *  @property {string} [preload='auto'] - 'auto', 'none' or 'metadata'. `preload` attribute of `audio` tag.
 *  @property {string[]} textArr - quote text
 *  @property {boolean} [muteHint=false] - if true, there is another full page to hint how to mute/unmute audio.
 */

/**
 *  @param {KaraokeProps} props
 */
export default function Karaoke({
  audioUrls,
  className,
  preload = 'auto',
  styles = defaultStyles,
  textArr,
  muteHint = false,
}) {
  const defaultDuration = 10 // second
  const audioRef = useRef(null)
  const [muted, setMuted] = useMuted(true)
  const [containerRef, inView] = useInView({
    threshold: [0.6],
  })

  const [audioOpts, setAudioOpts] = useState({
    paused: !inView,
    duration: defaultDuration,
    currentTime: 0,
    notice: '',
  })

  useEffect(() => {
    const audio = audioRef.current
    const onLoadedMetadata = () => {
      setAudioOpts((opts) => {
        return Object.assign({}, opts, {
          duration: audio.duration || defaultDuration,
        })
      })
    }

    if (audio) {
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
        // start with `audioOpts.currentTime` to catch up `QuoteShadow` animation
        audio.currentTime = audioOpts.currentTime
        const startPlayPromise = audio.play()
        startPlayPromise
          // play successfully
          .then(() => {
            setAudioOpts((opts) =>
              Object.assign({}, opts, {
                // clear notice
                notice: '',
              })
            )
          })
          // fail to play
          .catch((error) => {
            // browser prevent from playing audio before user interactions
            if (error.name === 'NotAllowedError') {
              setAudioOpts((opts) =>
                Object.assign({}, opts, {
                  notice: '請點選聲音播放鍵',
                })
              )
            } else {
              setAudioOpts((opts) =>
                Object.assign({}, opts, {
                  notice: '無法播放音檔，請重新整理頁面',
                })
              )
            }
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
      'audio[data-readr-karaoke][data-played=false]'
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
      {muted ? <mockups.audio.PausedButton /> : <mockups.audio.PlayingButton />}
    </AudioBt>
  )

  const audioBtJsx = (
    <AudioBt
      onClick={() => {
        const audio = audioRef.current
        if (audio) {
          if (muted || audioOpts.paused) {
            audio.currentTime = audioOpts.currentTime
            audio.muted = false
            audio.play()
            setMuted(false)
            setAudioOpts((opts) =>
              Object.assign({}, opts, {
                paused: false,
                notice: '',
              })
            )
          } else {
            audio.pause()
            setMuted(true)
            setAudioOpts((opts) =>
              Object.assign({}, opts, {
                paused: true,
                notice: '',
              })
            )
          }
          audio.setAttribute('data-played', true)
        }

        safariWorkaround()
      }}
    >
      {audioOpts.paused || muted ? (
        <mockups.audio.PausedButton />
      ) : (
        <mockups.audio.PlayingButton />
      )}
      {audioOpts.notice && <span>{audioOpts.notice}</span>}
    </AudioBt>
  )

  return (
    <>
      {muteHint && (
        <HintContainer>
          {hintAudioBtJsx}
          <Text>
            此新聞專題網頁包含聲音，點擊<b>開啟</b>
          </Text>
        </HintContainer>
      )}
      <QuoteContainer className={className} ref={containerRef} styles={styles}>
        <audio
          ref={audioRef}
          preload={preload}
          data-readr-karaoke
          data-played={false}
        >
          {audioUrls.map((url, index) => (
            <source key={`audio_source_${index}`} src={url}></source>
          ))}
        </audio>
        <QuoteShadow
          key={`quote_in_view_${inView}` /** use key to force re-rendering */}
          textArr={textArr}
          play={!audioOpts.paused}
          duration={audioOpts.duration}
          styles={styles}
          onCurrentTimeUpdate={(currentTime) => {
            setAudioOpts((opts) =>
              Object.assign({}, opts, {
                currentTime,
              })
            )
          }}
        />
        {audioBtJsx}
      </QuoteContainer>
    </>
  )
}

const AudioBt = styled.div`
  cursor: pointer;
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

const QuoteShadow = styled(_QuoteShadow)`
  width: fit-content;

  @media ${breakpoint.devices.tablet} {
    width: fit-content;
  }
`

const QuoteContainer = styled.div`
  position: relative;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;

  background-color: ${
    /**
     *  @param {Object} props
     *  @param {import('./typedef').KaraokeStyles} props.styles
     */
    (props) => props.styles.mobile.background.color
  };

  @media ${breakpoint.devices.tablet} {
    flex-direction: row;
  }

  ${AudioBt} {
    left: 12px;
    bottom: 12px;
    position: absolute;
    cursor: pointer;

    @media ${breakpoint.devices.tablet} {
      left: 27px;
      bottom: 22px;
    }
  }
`
