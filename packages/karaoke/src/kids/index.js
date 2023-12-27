import React/* eslint-disable-line */, { useEffect, useRef, useState } from 'react'
import Quote from './quote'
import styled from 'styled-components'
import { Hint, safariWorkaround, useMuted } from './hint'
import { LogoIcon, MuteIcon, PlayIcon, SoundIcon } from './icons'
import { mediaQuery } from './utils/media-query'
import { useInView } from 'react-intersection-observer'

/**
 *  @typedef {Object} KaraokeProps
 *  @property {string[]} audioUrls,
 *  @property {string} [className]
 *  @property {string} [preload='auto'] - 'auto', 'none' or 'metadata'. `preload` attribute of `audio` tag.
 *  @property {string[]} quoteArr - quote text
 *  @property {string} [quoteBy]
 *  @property {boolean} [hint=false] - render `Karaoke` along with `Hint` component
 *  @property {boolean} [hintOnly=false] - render `Hint` component only, without `Karaoke`
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
  hint = false,
  hintOnly = false,
}) {
  const defaultDuration = 10 // second
  const audioRef = useRef(null)
  const [muted, setMuted] = useMuted(true)
  const [containerRef, inView] = useInView({
    rootMargin: '-25% 0% -25% 0%',
    threshold: 0,
  })
  const [duration, setDuration] = useState(defaultDuration)
  const [currentTime, setCurrentTime] = useState(0)
  const [ended, setEnded] = useState(false)
  const [paused, setPaused] = useState(false)
  const [hasBeenPlayed, setHasBeenPlayed] = useState(false)

  // add event listener to load audio's duration
  useEffect(() => {
    const audio = audioRef.current
    const onLoadedMetadata = () => {
      console.log(
        '[react-karaoke] `onLoadedMetadata` event invoked. audio duration:',
        audio.duration
      )
      setDuration(audio.duration)
    }

    if (audio) {
      if (audio.readyState > 0) {
        console.log(
          '[react-karaoke] set duration without `onLoadedMetadata` event triggered. duration: ',
          audio.duration
        )
        setDuration(audio.duration)
        return
      }

      audio.addEventListener('loadedmetadata', onLoadedMetadata)
    }

    // clear event listeners
    return () => {
      audio.removeEventListener('loadedmetadata', onLoadedMetadata)
    }
  }, [])

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
  }, [])

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
      }
    } else {
      // leave the viewport
      audio.pause()
      setPaused(true)
    }
  }, [inView, paused, hasBeenPlayed])

  const audioBtJsx =
    (hasBeenPlayed && paused) || ended ? (
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

          safariWorkaround()
        }}
      >
        {muted ? <MuteIcon /> : <SoundIcon />}
      </AudioBt>
    )

  if (hintOnly) {
    return <Hint />
  }

  const textLen = quoteArr.join('').length
  const durationPerChar = duration / textLen // sec
  const currentCharIdx = Math.floor(currentTime / durationPerChar)

  return (
    <>
      {hint && <Hint />}
      <OuterBox>
        <QuoteContainer className={className} ref={containerRef}>
          <Logo />
          {/**
           *  There are two reasons to use `<video>` tag, instead of `<audio>` tag, for workaround.
           *
           *  1. <audio> elements can't have subtitles or captions associated with them in the same way that <video> elements can.
           *  See [WebVTT and Audio](https://www.iandevlin.com/blog/2015/12/html5/webvtt-and-audio/) by Ian Devlin
           *  for some useful information and workarounds.
           *
           *  2. Even though we set `audio.muted=true` before auto playing audio,
           *  it still may encounter error to autoplay audio.
           *  The error message is 'error:  DOMException: play() failed because the user didn't interact with the document first. https://goo.gl/xX8pDD'.
           *  It seems that Chrome does not follow the autoplay policy which is designed by Google itself.
           *  The autoplay policy says that if we want to autoplay, and then we need to make audio muted.
           *  But, in our case, setting `audio.muted=true` is not working at all.
           *  However, audio can be autoplayed by setting `video.muted=true` instead.
           */}
          <video
            ref={audioRef}
            preload={preload}
            data-twreporter-story-telling
            data-react-karaoke
            data-autoplay={true}
            data-played={false}
            playsInline
            style={{ display: 'none' }}
          >
            {audioUrls.map((url, index) => (
              <source key={`audio_source_${index}`} src={url}></source>
            ))}
          </video>
          <Quote textArr={quoteArr} currentCharIdx={currentCharIdx} />
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
