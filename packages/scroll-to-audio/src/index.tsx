import React, { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import styled from 'styled-components'
import { MuteIcon, SoundIcon } from './icons'
import debounce from 'lodash/debounce'
import { hooks, twreporter } from '@story-telling-reporter/react-ui-toolkit'

const { Hint } = twreporter

const _ = {
  debounce,
}

function ScrollToAudio({
  id = 'scroll-to-audio-id',
  audioUrls,
  className,
  preload = 'auto',
  hintOnly = false,
  hintId,
}: {
  id: string
  audioUrls: string[]
  className?: string
  preload?: string
  bottomEntryOnly?: boolean
  hintOnly?: boolean
  hintId?: string
}) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [muted, setMuted] = hooks.useMuted(true, audioRef)
  const topEntryPointRef = useRef<HTMLDivElement>(null)
  const bottomEntryPointRef = useRef<HTMLDivElement>(null)

  const [paused, setPaused] = useState(true)
  const [mounted, setMounted] = useState(false)
  const [hideMuteButton, setHideMuteButton] = useState(true) // hide mute button initially

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (hintOnly) {
      return
    }

    const handleScroll = _.debounce(() => {
      const topEntryElement = topEntryPointRef.current
      const bottomEntryElement = bottomEntryPointRef.current

      if (
        !topEntryElement ||
        topEntryElement.getBoundingClientRect().width == 0 ||
        topEntryElement.getBoundingClientRect().height == 0
      ) {
        console.log(
          `[react-scroll-to-audio][${id}] \`topEntryElement\` is not available. Remove scroll event listener.`
        )
        window.removeEventListener('scroll', handleScroll)
        return
      }

      const viewportHeight = window.innerHeight
      const rootMargin = Math.ceil(viewportHeight * 0.25)
      const topEntryY = topEntryElement.getBoundingClientRect().y

      // top entry point is below viewport
      // which means element is outside viewport bottom
      if (topEntryY > viewportHeight - rootMargin) {
        setHideMuteButton(true)
        setPaused(true)
        return
      }

      let bottomEntryY = 0
      // bottom entry point is not existed
      // give it a default value: top entry + 100vh
      if (!bottomEntryElement) {
        bottomEntryY = topEntryY + viewportHeight
      } else {
        bottomEntryY = bottomEntryElement.getBoundingClientRect().y
      }

      // bottom entry point is above viewport top,
      // which means element is outside viewport
      if (bottomEntryY < 0 + rootMargin) {
        setHideMuteButton(true)
        setPaused(true)
      }

      // top entry point is in the viewport or above viewport bottom
      // AND
      // bottom entry point is in the viewport or below viewport top
      // which means element is inside viewport
      if (
        topEntryY < viewportHeight - rootMargin &&
        bottomEntryY > 0 + rootMargin
      ) {
        setHideMuteButton(false)
        if (!muted) {
          // do not play audio since it's muted
          setPaused(false)
        }
      }
    }, 50)

    console.log(
      `[react-scroll-to-audio][${id}] add scroll event listener. \`muted\` state is ${muted}`
    )
    window.addEventListener('scroll', handleScroll)

    return () => {
      console.log(
        `[react-scroll-to-audio][${id}] useEffect cleanup function. Remove scroll event listener.`
      )
      window.removeEventListener('scroll', handleScroll)
    }
  }, [muted, hintOnly])

  // set audio muted attribute according to browser muted state
  useEffect(() => {
    const audioElement = audioRef.current
    if (!audioElement) {
      return
    }
    audioElement.muted = muted
  }, [muted])

  useEffect(() => {
    const audioElement = audioRef.current
    if (!audioElement) {
      return
    }

    if (paused) {
      audioElement.pause()
      console.log(`[react-scroll-to-audio][${id}] audio paused.`)
    } else {
      const startPlayPromise = audioElement.play()
      if (startPlayPromise !== undefined) {
        startPlayPromise
          // play successfully
          .then(() => {
            console.log(
              `[react-scroll-to-audio][${id}] audio plays successfully.`
            )
            audioElement.setAttribute('data-played', 'true')
          })
          // fail to play
          .catch((error) => {
            // browser prevent from playing audio before user interactions
            console.log(`[react-scroll-to-audio][${id}] unable to play audio`)
            console.log(`[react-scroll-to-audio][${id}] error: `, error)

            // pause and mute audio since browser does not allow to play it
            setPaused(true)
            setMuted(true)
          })
      }
    }
  }, [paused])

  const onMuteButtonClick = () => {
    const nextMuted = !muted
    setMuted(nextMuted)

    // pause audio if muted, otherwise play the audio
    setPaused(nextMuted)
  }

  const bottomEntryId = id + '-bottom-entry-point'
  let buttonJsx = null
  let bottomEntryPlaceholder = null

  if (mounted) {
    bottomEntryPlaceholder = document.getElementById(bottomEntryId)

    const mobileButtonJsx = (
      <MobileOnly>
        <MuteButtonWithMobileToolBar
          className="scroll-to-audio-muted-button"
          $hide={hideMuteButton}
          onClick={onMuteButtonClick}
        >
          {muted ? <MuteIcon /> : <SoundIcon />}
        </MuteButtonWithMobileToolBar>
      </MobileOnly>
    )

    const desktopButtonJsx = (
      <DesktopOnly>
        <FixedMuteButton
          className="scroll-to-audio-muted-button"
          $hide={hideMuteButton}
          onClick={onMuteButtonClick}
        >
          {muted ? <MuteIcon /> : <SoundIcon />}
        </FixedMuteButton>
      </DesktopOnly>
    )

    buttonJsx = (
      <>
        {mobileButtonJsx}
        {desktopButtonJsx}
      </>
    )
  }

  if (hintOnly) {
    return <Hint id={hintId} />
  }

  const audioJsx = (
    <audio
      ref={audioRef}
      preload={preload}
      data-played={false}
      data-paused={paused}
      data-twreporter-story-telling
      data-muted={muted}
      style={{ display: 'none' }}
      playsInline
      loop
    >
      {audioUrls.map((url, index) => (
        <source key={`audio_source_${index}`} src={url}></source>
      ))}
    </audio>
  )

  return (
    <>
      <TopEntryContainer
        data-twreporter-story-telling
        data-react-scroll-to-audio
        data-id={`${id}-top-entry-point`}
        data-top-entry
        className={className}
        ref={topEntryPointRef}
      >
        {audioJsx}
      </TopEntryContainer>
      {bottomEntryPlaceholder &&
        createPortal(
          <BottomEntryContainer
            data-twreporter-story-telling
            data-react-scroll-to-audio
            data-id={bottomEntryId}
            data-bottom-entry
            ref={bottomEntryPointRef}
          />,
          bottomEntryPlaceholder
        )}
      {buttonJsx}
    </>
  )
}

function buildBottomEntryPointStaticMarkup({
  id = 'scroll-to-audio-id',
}: {
  id: string
}) {
  const bottomEntryId = id + '-bottom-entry-point'

  return `<div id="${bottomEntryId}"></div>`
}

export { ScrollToAudio, buildBottomEntryPointStaticMarkup }

const TopEntryContainer = styled.div`
  min-height: 10px;
`

const BottomEntryContainer = styled.div`
  min-height: 10px;
`

const MuteButton = styled.div`
  height: 40px;
  width: 40px;
  border-radius: 100%;
  background-color: #00000040;
  display: flex;
  cursor: pointer;

  > svg {
    width: 20px;
    height: 20px;
    margin: auto;
    fill: white;
  }

  &:hover {
    background-color: #00000080;
  }
`

const MuteButtonWithMobileToolBar = styled(MuteButton)<{ $hide: boolean }>`
  position: fixed;
  /* above the mobile tool bar */
  /* 40px is mute button height, 48px is the margin between mute button and mobile tool bar */
  bottom: calc(40px + 48px);

  /* push mute button to the right edge of viewport */
  /* 40px is the width of mute button */
  /* 16px is the margin between mute button and the right edge of viewport */
  /* 50% is the half width of mobile tool bar */
  /* 50vw is the half width of viewport */
  left: calc(50vw + 50% - 40px - 16px);

  ${(props) => {
    return props?.$hide
      ? `transform: translateY(150px);` // slide out the viewport
      : `transform: translateY(0);`
  }}
  transition: transform 300ms ease-in-out;
`

const FixedMuteButton = styled(MuteButton)<{ $hide: boolean }>`
  position: fixed;
  bottom: 16px;
  right: 16px;
  z-index: 800;

  ${(props) => {
    return props?.$hide
      ? 'transform: translateY(calc((40px + 16px) * 2));' // slide out the viewport
      : 'transform: translateY(0);'
  }}
  transition: transform 300ms ease-in-out;
`

const MobileOnly = styled.div`
  display: none;
  @media (max-width: 1023px) {
    display: block;
  }
`

const DesktopOnly = styled.div`
  display: none;
  @media (min-width: 1024px) {
    display: block;
  }
`

//function fadeOut(
//  audioElement: HTMLVideoElement,
//  targetVolume: number,
//  duration: number
//) {
//  // make sure volume is between 0 to 1
//  targetVolume = Math.max(0, Math.min(1, targetVolume))
//  // decrease volume step by step
//  const volumeDecreaseStep =
//    (audioElement.volume - targetVolume) / (duration / 100)
//  const interval = setInterval(() => {
//    if (audioElement.volume > targetVolume + volumeDecreaseStep) {
//      audioElement.volume -= volumeDecreaseStep
//    } else {
//      // decrease to the target volume
//      audioElement.volume = targetVolume
//      audioElement.pause()
//      console.log('[react-scroll-to-audio] audio paused.')
//      clearInterval(interval)
//    }
//  }, 100)
//}

//function fadeIn(
//  audioElement: HTMLVideoElement,
//  targetVolume: number,
//  duration: number
//) {
//  // make sure volume is between 0 to 1
//  targetVolume = Math.max(0, Math.min(1, targetVolume))
//  // increase volume step by step
//  const volumeIncreaseStep = targetVolume / (duration / 100)
//  audioElement.volume = 0 // start audio with 0 volume

//  // play the audio
//  const startPlayPromise = audioElement.play()
//  if (startPlayPromise !== undefined) {
//    startPlayPromise
//      // play successfully
//      .then(() => {
//        console.log('[react-scroll-to-audio] audio plays successfully.')
//        audioElement.setAttribute('data-played', 'true')
//        const interval = setInterval(() => {
//          if (audioElement.volume < targetVolume - volumeIncreaseStep) {
//            audioElement.volume += volumeIncreaseStep
//          } else {
//            // increase to the target volume
//            audioElement.volume = targetVolume
//            clearInterval(interval)
//          }
//        }, 100)
//      })
//      // fail to play
//      .catch((error) => {
//        // browser prevent from playing audio before user interactions
//        console.log('[react-scroll-to-audio] unable to play audio')
//        console.log('[react-scroll-to-audio] error: ', error)
//      })
//  }
//}
