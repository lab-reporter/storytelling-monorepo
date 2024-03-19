import React/* eslint-disable-line */, { createRef, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { LogoIcon, MuteIcon, SoundIcon, PlayIcon, PauseIcon } from './icons'
import { TransitionGroup, CSSTransition } from 'react-transition-group'
import { mediaQuery } from './utils/media-query'
import { useInView } from 'react-intersection-observer'
import { hooks, kids } from '@story-telling-reporter/react-ui-toolkit'

const { Hint } = kids

/**
 *  @typedef {Object} SubtitledAduioProps
 *  @property {string[]} audioUrls
 *  @property {string} webVtt - subtitles in WebVTT format
 *  @property {string} [className]
 *  @property {string} [preload='auto'] - 'auto', 'none' or 'metadata'. `preload` attribute of `audio` tag.
 *  @property {string} [hintText=''] - render `SubtitledAudio` along with `Hint` component
 *  @property {boolean} [hintOnly=false] - render `Hint` component only, without `SubtitledAudio`
 */

/**
 *  @param {SubtitledAduioProps} props
 */
export function SubtitledAudio({
  audioUrls,
  webVtt,
  className,
  preload = 'auto',
  hintText = '',
  hintOnly = false,
}) {
  const firstCueTextRef = useRef('')
  const clickPauseIconRef = useRef(false)
  // const hasBeenInViewRef = useRef(false)
  const audioRef = useRef(null)
  const trackRef = useRef(null)
  const [muted, setMuted] = hooks.useMuted(true, audioRef)
  const [bodyRef, inView] = useInView({
    rootMargin: hintText ? '-25% 0% -50% 0%' : '-25% 0% -25% 0%',
    threshold: 0,
  })
  const [duration, setDuration] = useState(0)
  const [paused, setPaused] = useState(false)
  const [progressBarValue, setProgressBarValue] = useState(0)
  const [cues, setCues] = useState([])
  const [webVttBlob, setWebVttBlob] = useState(null)

  // Due to `<track>` tag needs `src` attribute to load vtt file.
  // So, we create blob url for it.
  useEffect(() => {
    const vttBlob = new Blob([webVtt], {
      type: 'text/plain',
    })
    setWebVttBlob(URL.createObjectURL(vttBlob))
  }, [])

  // add event listener to load audio's duration
  useEffect(() => {
    const audio = audioRef.current
    const onLoadedMetadata = () => {
      console.log(
        '[react-subtitled-audio] `onLoadedMetadata` event invoked. audio duration:',
        audio.duration
      )
      setDuration(audio.duration)
    }

    if (audio) {
      if (audio.readyState > 0) {
        console.log(
          '[react-subtitled-audio] set duration without `onLoadedMetadata` event triggered. duration: ',
          audio.duration
        )
        setDuration(audio.duration)
        return
      }

      audio.addEventListener('loadedmetadata', onLoadedMetadata)
    }

    // clear event listeners
    return () => {
      if (audio) {
        audio.removeEventListener('loadedmetadata', onLoadedMetadata)
      }
    }
  }, [])

  // listen track's `cuechange` event to update subtitles
  useEffect(() => {
    const track = trackRef.current
    const onCueChange = (event) => {
      const subtitle = event.target?.track?.activeCues?.[0]?.text
      console.log(
        '[react-subtitled-audio] subtitle changed. subtitle: ',
        subtitle
      )
      if (typeof subtitle === 'string') {
        if (!firstCueTextRef.current) {
          firstCueTextRef.current = subtitle
        }
        setCues([])
        setTimeout(() => {
          setCues([
            {
              text: subtitle,
              id: Date.now(),
              nodeRef: createRef(null),
            },
          ])
        }, 200)
      } else {
        setCues([])
      }
    }
    if (track) {
      track.addEventListener('cuechange', onCueChange)
    }

    return () => {
      if (track) {
        track.removeEventListener('cuechange', onCueChange)
      }
    }
  }, [cues])

  // listen audio's `timeupdate` event to update progress bar
  useEffect(() => {
    if (duration === 0) {
      return
    }

    const audio = audioRef.current
    const handleEnded = () => {
      // pause audio
      setPaused(true)

      // reset currentTime to start
      audio.currentTime = 0

      // reset progress bar
      setProgressBarValue(0)
    }
    const handleTimeUpdate = () => {
      const currentTime = audio.currentTime
      const nextProgressBarValue = Math.floor((currentTime / duration) * 100)
      if (nextProgressBarValue - progressBarValue > 0.5) {
        setProgressBarValue(nextProgressBarValue)
      }
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
  }, [duration, progressBarValue])

  // set audio muted attribute according to browser muted state
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) {
      return
    }
    audio.muted = muted
  }, [muted])

  // play/pause audio when `SubtitledAuduio` is entering/leaving the viewport
  useEffect(
    () => {
      const audio = audioRef.current
      if (!audio) {
        return
      }
      // in the viewport
      if (inView) {
        // const hasBeenInView = hasBeenInViewRef.current
        // if (!hasBeenInView) {
        //   hasBeenInViewRef.current = true
        //   ...
        // }
        const clickPauseIcon = clickPauseIconRef.current
        if (!clickPauseIcon) {
          const startPlayPromise = audio.play()
          setPaused(false)
          startPlayPromise
            // play successfully
            .then(() => {
              console.log('[react-subtitled-audio] audio plays successfully.')
            })
            // fail to play
            .catch((error) => {
              // browser prevent from playing audio before user interactions
              console.log('[react-subtitled-audio] unable to play audio')
              console.log('[react-subtitled-audio] error: ', error)
            })
          return
        }
      } else if (!inView) {
        // leave the viewport
        audio.pause()
        setPaused(true)
      }
    },
    // `inView` is used to avoid from infinite re-rendering.
    [inView]
  )

  const rightBtJsx = (
    <Button
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
        }
      }}
    >
      {muted ? <MuteIcon /> : <SoundIcon />}
    </Button>
  )

  const leftBtJsx = (
    <Button
      onClick={() => {
        const audio = audioRef.current
        if (audio) {
          if (paused) {
            audio.play()
            setPaused(false)
            clickPauseIconRef.current = false
          } else {
            audio.pause()
            setPaused(true)
            clickPauseIconRef.current = true
          }
          audio.setAttribute('data-played', true)
        }
      }}
    >
      {paused ? <PlayIcon /> : <PauseIcon />}
    </Button>
  )

  if (hintOnly) {
    return <Hint text={hintText} />
  }

  const audioJsx = (
    //  Using `<video>` tag is a workaround.
    //  <audio> elements can't have subtitles or captions associated with them in the same way that <video> elements can.
    //  See [WebVTT and Audio](https://www.iandevlin.com/blog/2015/12/html5/webvtt-and-audio/) by Ian Devlin
    //  for some useful information and workarounds.
    <video
      ref={audioRef}
      preload={preload}
      data-twreporter-story-telling
      data-react-subtitled-audio
      data-muted={true}
      data-played={false}
      style={{ display: 'none' }}
      playsInline
    >
      <track ref={trackRef} default kind="metadata" src={webVttBlob}></track>
      {audioUrls.map((url, index) => (
        <source key={`audio_source_${index}`} src={url}></source>
      ))}
    </video>
  )

  return (
    <Container className={className}>
      {hintText && <Hint text={hintText} />}
      <PaddingTop />
      <Body ref={bodyRef}>
        <Logo />
        {audioJsx}
        <SubtitleAndControls>
          <Subtitle>
            <TransitionGroup>
              {cues.map(({ id, text, nodeRef }) => (
                <CSSTransition
                  key={id}
                  nodeRef={nodeRef}
                  timeout={200}
                  classNames="subtitle"
                >
                  <span ref={nodeRef}>{text}</span>
                </CSSTransition>
              ))}
            </TransitionGroup>
          </Subtitle>
          <Controls>
            <Progress>
              <ProgressBar style={{ width: progressBarValue + '%' }} />
            </Progress>
            <Buttons>
              {leftBtJsx}
              {rightBtJsx}
            </Buttons>
          </Controls>
        </SubtitleAndControls>
      </Body>
    </Container>
  )
}

const Container = styled.div`
  margin-top: 60px;
  margin-bottom: 60px;
`

const Body = styled.div`
  /* clear default margin */
  margin: 0;

  box-sizing: border-box;

  position: relative;
  width: 100%;

  background-color: #f4f4f4;

  border-radius: 20px;

  padding: 60px 40px 30px 40px;

  ${mediaQuery.mediumAbove} {
    min-width: 700px;
  }

  ${mediaQuery.smallOnly} {
    padding: 60px 20px 30px 20px;
  }
`

const PaddingTop = styled.div`
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

const SubtitleAndControls = styled.div`
  width: 420px;
  margin-left: auto;
  margin-right: auto;

  ${mediaQuery.smallOnly} {
    width: calc(283 / 329 * 100%);
  }
`

const Subtitle = styled.blockquote`
  /* clients should provide below fonts */
  font-family: source-han-sans-traditional, Noto Sans TC, PingFang TC,
    Apple LiGothic Medium, Roboto, Microsoft JhengHei, Lucida Grande,
    Lucida Sans Unicode, sans-serif;
  letter-spacing: 1.5px;
  font-size: 16px;
  font-weight: 700;
  line-height: 1.5;

  height: 50px;

  margin-left: auto;
  margin-right: auto;

  /* clear default margin*/
  margin-top: 0;
  margin-bottom: 0;

  position: relative;

  > span {
    position: absolute;
  }

  .subtitle-enter {
    opacity: 0;
  }

  .subtitle-enter-active {
    opacity: 1;
    transition: opacity 200ms;
  }

  .subtitle-exit {
    opacity: 1;
  }

  .subtitle-exit-active {
    opacity: 0;
    transition: opacity 200ms;
  }

  ${mediaQuery.smallOnly} {
    height: 100px;
  }
`

const Progress = styled.div`
  width: 400px;
  height: 5px;
  background-color: rgba(205, 205, 205, 0.2);
  border-radius: 10px;

  ${mediaQuery.smallOnly} {
    width: calc(150 / 283 * 100%);
    flex-shrink: 0;
  }
`

const ProgressBar = styled.div`
  background-color: rgba(102, 102, 102, 0.2);
  height: 100%;
  border-radius: 10px;
`

const Button = styled.div`
  cursor: pointer;
  width: 36px;
  height: 36px;

  ${mediaQuery.smallOnly} {
    width: 45px;
    height: 45px;
  }
`

const Buttons = styled.div`
  display: flex;
  justify-content: space-between;

  width: 92px;

  ${mediaQuery.smallOnly} {
    width: 110px;
  }
`

const Controls = styled.div`
  display: flex;
  gap: 20px;
  align-items: center;
  flex-wrap: nowrap;
  justify-content: flex-start;

  margin-top: 30px;

  ${Buttons} {
    flex-shrink: 0;
  }

  ${Progress} {
    flex-shrink: 0;
  }

  ${mediaQuery.smallOnly} {
    margin-top: 20px;
  }
`
