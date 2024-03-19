import React/* eslint-disable-line */, { useEffect, useMemo, useRef, useState } from 'react'
import Quote from './quote'
import styled from 'styled-components'
import { LogoIcon, MuteIcon, PlayIcon, SoundIcon } from './icons'
import { mediaQuery } from './utils/media-query'
import { useInView } from 'react-intersection-observer'
import { hooks, kids } from '@story-telling-reporter/react-ui-toolkit'

const { Hint } = kids

/**
 *  @typedef {Object} KaraokeProps
 *  @property {string[]} audioUrls
 *  @property {string} webVtt - subtitles in WebVTT format
 *  @property {string} [className]
 *  @property {string} [preload='auto'] - 'auto', 'none' or 'metadata'. `preload` attribute of `audio` tag.
 *  @property {string} [quoteBy]
 *  @property {boolean} [hint=false] - render `Karaoke` along with `Hint` component
 *  @property {boolean} [hintOnly=false] - render `Hint` component only, without `Karaoke`
 */

/**
 *  @param {KaraokeProps} props
 */
export function Karaoke({
  audioUrls,
  webVtt,
  className,
  preload = 'auto',
  quoteBy,
  hint = false,
  hintOnly = false,
}) {
  const audioRef = useRef(null)
  const trackRef = useRef(null)
  const [muted, setMuted] = hooks.useMuted(true, audioRef)
  const [containerRef, inView] = useInView({
    rootMargin: '-25% 0% -25% 0%',
    threshold: 0,
  })
  const [currentTime, setCurrentTime] = useState(0)
  const [ended, setEnded] = useState(false)
  const [paused, setPaused] = useState(false)
  const [hasBeenPlayed, setHasBeenPlayed] = useState(false)
  const [cues, setCues] = useState([])
  const [activeCue, setActiveCue] = useState(null)
  const [webVttBlob, setWebVttBlob] = useState(null)

  // Due to `<track>` tag needs `src` attribute to load vtt file.
  // So, we create blob url for it.
  useEffect(() => {
    const vttBlob = new Blob([webVtt], {
      type: 'text/plain',
    })
    setWebVttBlob(URL.createObjectURL(vttBlob))
  }, [])

  // listen track's `cuechange` event to load active cue
  useEffect(() => {
    const track = trackRef.current
    const handleLoad = (event) => {
      const cuesList = event.target?.track?.cues || []

      if (cues.length !== cuesList.length) {
        console.log("[react-karaoke] track's cues list: ", cuesList)
        const trackCues = []
        for (const cue of cuesList) {
          trackCues.push(cue)
        }
        setCues(trackCues)
      }
    }

    const handleCueChange = (event) => {
      const activeCue = event.target?.track?.activeCues?.[0]
      if (activeCue) {
        console.log('[react-karaoke] cue changed. active cue: ', activeCue)
        setActiveCue(activeCue)
      }
    }
    if (track) {
      track.addEventListener('cuechange', handleCueChange)
      track.addEventListener('load', handleLoad)
    }

    return () => {
      if (track) {
        track.removeEventListener('cuechange', handleCueChange)
        track.removeEventListener('load', handleLoad)
      }
    }
  }, [cues, activeCue])

  // listen audio's `timeupdate` and  `ended` events
  useEffect(() => {
    const audio = audioRef.current
    const handleEnded = () => {
      setEnded(true)
    }
    const handleTimeUpdate = () => {
      const currentTime = audio.currentTime
      setCurrentTime(currentTime)
    }
    if (audio) {
      audio.addEventListener('timeupdate', handleTimeUpdate)
      audio.addEventListener('ended', handleEnded)
    }
    return () => {
      if (audio) {
        audio.removeEventListener('timeupdate', handleTimeUpdate)
        audio.removeEventListener('ended', handleEnded)
      }
    }
  }, [currentTime])

  // set audio muted attribute according to browser muted state
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) {
      return
    }
    // set audio muted attribute according to browser muted state
    audio.muted = muted
  }, [muted])

  // pause audio when `Karaoke` is leaving the viewport
  // and play audio when `Karaoke` is entering the viewport for the first time.
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) {
      return
    }
    // in the viewport
    if (inView) {
      if (!hasBeenPlayed) {
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
        setHasBeenPlayed(true)
        setPaused(false)
        audio.setAttribute('data-played', true)
      }
    } else {
      // leave the viewport
      audio.pause()
      setPaused(true)
    }
  }, [inView, paused, hasBeenPlayed])

  const audioBtJsx =
    !hasBeenPlayed || (hasBeenPlayed && paused) || ended ? (
      <AudioBt
        onClick={() => {
          const audio = audioRef.current
          if (audio) {
            if (ended) {
              setEnded(false)
              setCurrentTime(0)
              audio.currentTime = 0
            }
            audio.play()
            audio.setAttribute('data-played', true)
            setPaused(false)
          }
        }}
      >
        <PlayIcon />
      </AudioBt>
    ) : (
      <AudioBt
        onClick={() => {
          const audio = audioRef.current
          if (audio) {
            if (muted) {
              audio.muted = false
              setMuted(false)
            } else {
              audio.muted = true
              setMuted(true)
            }
            audio.setAttribute('data-played', true)
          }
        }}
      >
        {muted ? <MuteIcon /> : <SoundIcon />}
      </AudioBt>
    )

  const textArr = useMemo(() => getTextArrayFromCues(cues), [cues])
  let currentCharIdx = useMemo(
    () => getLastEndCharIdx(cues, activeCue),
    [cues, activeCue]
  )

  if (activeCue) {
    const cText = activeCue.text
    const cDuration = activeCue.endTime - activeCue.startTime
    const durationPerChar = cDuration / cText.length
    if (currentTime > activeCue.startTime) {
      currentCharIdx =
        currentCharIdx +
        Math.floor((currentTime - activeCue.startTime) / durationPerChar)
    }
  }

  if (hintOnly) {
    return <Hint />
  }

  return (
    <>
      {hint && <Hint />}
      <OuterBox>
        <QuoteContainer className={className} ref={containerRef}>
          <Logo />
          {/**
           *  The reason we  use `<video>` tag, instead of `<audio>` tag, for workaround is because
           *  <audio> elements can't have subtitles or captions associated with them in the same way that <video> elements can.
           *  See [WebVTT and Audio](https://www.iandevlin.com/blog/2015/12/html5/webvtt-and-audio/) by Ian Devlin
           *  for some useful information and workarounds.
           */}
          <video
            ref={audioRef}
            preload={preload}
            data-twreporter-story-telling
            data-react-karaoke
            data-muted={muted}
            data-played={false}
            playsInline
            style={{ display: 'none' }}
          >
            <track
              ref={trackRef}
              default
              kind="metadata"
              src={webVttBlob}
            ></track>
            {audioUrls.map((url, index) => (
              <source key={`audio_source_${index}`} src={url}></source>
            ))}
          </video>
          <Quote textArr={textArr} currentCharIdx={currentCharIdx} />
          {quoteBy ? <QuoteBy>{quoteBy}</QuoteBy> : null}
          {audioBtJsx}
        </QuoteContainer>
      </OuterBox>
    </>
  )
}

const AudioBt = styled.div`
  cursor: pointer;
`

const QuoteBy = styled.div`
  font-family: Noto Sans TC, Sans-Serif, serif;
  font-size: 16px;
  font-weight: 500;
  line-height: 1.5;
  letter-spacing: 0.05em;

  margin-top: 15px;

  color: #747474;
`

const QuoteContainer = styled.blockquote`
  /* clear default margin */
  margin: 0;

  box-sizing: border-box;

  /* clients should provide below fonts */
  font-family: SweiMarkerSansCJKtc-Regular, Noto Sans TC, Sans-Serif, serif;
  letter-spacing: 1.5px;

  position: relative;
  width: 100%;

  background-color: #f4f4f4;

  border-radius: 20px;

  padding: 60px 40px 90px 40px;

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

const OuterBox = styled.div`
  padding-top: 54px;
  width: 100%;
  max-width: 700px;
`

const Logo = styled(LogoIcon)`
  position: absolute;

  left: 50%;
  top: 0;

  transform: translate(-50%, -50%);
  width: 100px;
`

function getTextArrayFromCues(cues) {
  if (!Array.isArray(cues)) {
    return []
  }
  const textArr = cues
    .map((cue) => cue?.text)
    ?.filter((txt) => typeof txt === 'string')
  return textArr
}

function getLastEndCharIdx(cues, activeCue) {
  if (!Array.isArray(cues) || !activeCue) {
    return 0
  }

  const previousCues = getCuesBeforeActiveCue(cues, activeCue)
  const lastEndCharIdx = previousCues
    .map((cue) => cue.text)
    .filter((txt) => typeof txt === 'string')
    .join('').length
  return lastEndCharIdx
}

function getCuesBeforeActiveCue(cues, activeCue) {
  if (!Array.isArray(cues) || !activeCue) {
    return []
  }

  const cueIdx = cues.findIndex(
    (cue) => cue?.startTime === activeCue?.startTime
  )
  return cues.slice(0, cueIdx)
}
