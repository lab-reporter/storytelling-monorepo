import React/* eslint-disable-line */, { createRef, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import styled from './styled-components'
import { Hint } from './hint'
import { MuteIcon, SoundIcon } from './icons'
import { useInView } from 'react-intersection-observer'
import { useMuted } from './hooks'

enum ThemeEnum {
  TWREPORTER = 'twreporter',
  KIDS = 'kids',
  ID_SELECTOR = 'id-selector',
}

export function ScrollToAudio({
  id = 'scroll-to-audio-id',
  audioUrls,
  className,
  preload = 'auto',
  hintOnly = false,
  bottomEntryOnly = false,
  idForHintContainer = 'muted-controller-hint-id',
  theme = ThemeEnum.TWREPORTER,
  idForMuteButton = '',
}: {
  id: string
  audioUrls: string[]
  className?: string
  preload?: string
  hintOnly?: boolean
  bottomEntryOnly?: boolean
  idForHintContainer?: string
  theme?: string
  idForMuteButton?: string // enabled when theme === `ThemeEnum.ID_SELECTOR`
}) {
  const audioRef = useRef<HTMLVideoElement>(null)
  const [muted, setMuted] = useMuted(true)
  const [topEntryPointRef, topEntryPointInView, topEntry] = useInView({
    rootMargin: '-25% 0% -50% 0%',
    threshold: 0,
  })
  const [bottomEntryPointRef, bottomEntryPointInView, bottomEntry] = useInView({
    rootMargin: '-50% 0% 0% 0%',
    threshold: 0,
  })
  const [paused, setPaused] = useState(true)
  const [mounted, setMounted] = useState(false)
  const [hideMuteButton, setHideMuteButton] = useState(true) // hide mute button initially

  useEffect(() => {
    setMounted(true)

    const audio = audioRef.current
    if (!audio) {
      return
    }

    // Subscribe `data-muted` attribute changes,
    // and sync audio `muted` state with `data-muted` attribute.
    const observer = new MutationObserver((mutaions) => {
      mutaions.forEach((mutation) => {
        if (
          mutation.type === 'attributes' &&
          mutation?.attributeName === 'data-muted'
        ) {
          const dataMuted = audio?.getAttribute('data-muted')
          setMuted(dataMuted === 'true')
        }
      })
    })

    observer.observe(audio, { attributes: true })

    return () => {
      observer.disconnect()
    }
  }, [])

  // set audio muted attribute according to browser muted state
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) {
      return
    }
    audio.muted = muted
  }, [muted])

  // play/pause audio when `ScrollToAudio` is entering/leaving the viewport
  useEffect(() => {
    // in the viewport
    if (topEntryPointInView) {
      setHideMuteButton(false)

      if (!muted) {
        setPaused(false)
      }
      return
    }

    if (!topEntry) {
      return
    }

    // User scrolls up and leaves the viewport
    const rootBoundsY = topEntry.rootBounds?.y
    if (
      typeof rootBoundsY === 'number' &&
      topEntry.boundingClientRect.y > rootBoundsY
    ) {
      setHideMuteButton(true)
      setPaused(true)
    }
  }, [muted, topEntryPointInView, topEntry])

  // play/pause audio when `ScrollToAudio` is entering/leaving the viewport
  useEffect(() => {
    // bottom entry point in the viewport
    if (bottomEntryPointInView) {
      setHideMuteButton(false)
      if (!muted) {
        setPaused(false)
      }
      return
    }

    if (!bottomEntry) {
      return
    }

    // User scrolls down and leaves the viewport
    const rootBoundsY = bottomEntry.rootBounds?.y
    if (
      typeof rootBoundsY === 'number' &&
      bottomEntry.boundingClientRect.y < rootBoundsY
    ) {
      setPaused(true)
      setHideMuteButton(true)
    }
  }, [bottomEntryPointInView, bottomEntry])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) {
      return
    }

    if (paused) {
      audio.pause()
      console.log('[react-scroll-to-audio] audio paused.')
    } else {
      const startPlayPromise = audio.play()
      if (startPlayPromise !== undefined) {
        startPlayPromise
          // play successfully
          .then(() => {
            console.log('[react-scroll-to-audio] audio plays successfully.')
            audio.setAttribute('data-played', 'true')
          })
          // fail to play
          .catch((error) => {
            // browser prevent from playing audio before user interactions
            console.log('[react-scroll-to-audio] unable to play audio')
            console.log('[react-scroll-to-audio] error: ', error)
          })
      }
    }
  }, [paused])

  if (hintOnly) {
    return <Hint id={idForHintContainer} />
  }

  const bottomEntryId = id + '-bottom-entry-point'

  if (bottomEntryOnly) {
    return <div id={bottomEntryId}></div>
  }

  const onMuteButtonClick = () => {
    const nextMuted = !muted
    setMuted(nextMuted)
    setPaused(false)

    const hintContainer = document.getElementById(idForHintContainer)
    if (hintContainer) {
      // Tell `Hint` component to sync the `muted` state.
      hintContainer.setAttribute('data-muted', nextMuted.toString())
    }
  }

  let buttonJsx = null
  let bottomEntryPlaceholder = null

  if (mounted) {
    bottomEntryPlaceholder = document.getElementById(bottomEntryId)

    switch (theme) {
      case ThemeEnum.ID_SELECTOR: {
        const buttonContainer = document.getElementById(idForMuteButton)
        if (buttonContainer) {
          buttonJsx = createPortal(
            <MuteButton $hide={hideMuteButton} onClick={onMuteButtonClick}>
              {muted ? <MuteIcon /> : <SoundIcon />}
            </MuteButton>,
            buttonContainer
          )
        }
        break
      }
      case ThemeEnum.TWREPORTER:
      default: {
        const mobileToolBarDiv = document.getElementById('mobile-tool-bar')
        let mobileButtonJsx = null
        if (mobileToolBarDiv) {
          mobileButtonJsx = createPortal(
            <MuteButton $hide={hideMuteButton} onClick={onMuteButtonClick}>
              {muted ? <MuteIcon /> : <SoundIcon />}
            </MuteButton>,
            mobileToolBarDiv
          )
        }
        const fixedButtonJsx = (
          <FixedMuteButton $hide={hideMuteButton} onClick={onMuteButtonClick}>
            {muted ? <MuteIcon /> : <SoundIcon />}
          </FixedMuteButton>
        )
        buttonJsx = (
          <>
            <DesktopOnly>{fixedButtonJsx}</DesktopOnly>
            {mobileButtonJsx || fixedButtonJsx}
          </>
        )
      }
    }
  }

  const audioJsx = (
    /**
     *  Using `<video>` tag, instead of `<audio>` tag, is a workaround.
     *
     *  Even though we set `audio.muted=true` before auto playing audio,
     *  it still may encounter error to autoplay audio.
     *  The error message is 'error:  DOMException: play() failed because the user didn't interact with the document first. https://goo.gl/xX8pDD'.
     *  It seems that Chrome does not follow the autoplay policy which is designed by Google itself.
     *  The autoplay policy says that if we want to autoplay, and then we need to make audio muted.
     *  But, in our case, setting `audio.muted=true` is not working at all.
     *  However, audio can be autoplayed by setting `video.muted=true` instead.
     */
    <video
      ref={audioRef}
      preload={preload}
      data-autoplay={true}
      data-played={false}
      data-paused={paused}
      data-muted={muted}
      style={{ display: 'none' }}
      playsInline
      loop
    >
      {audioUrls.map((url, index) => (
        <source key={`audio_source_${index}`} src={url}></source>
      ))}
    </video>
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

const TopEntryContainer = styled.div`
  min-height: 10px;
`

const BottomEntryContainer = styled.div`
  min-height: 10px;
`

const MuteButton = styled.div<{ $hide: boolean }>`
  height: 40px;
  width: 40px;
  border-radius: 100%;
  background-color: #00000040;
  display: flex;
  cursor: pointer;

  position: absolute;
  right: 16px;
  top: calc(-40px - 16px);
  ${(props) => {
    return props?.$hide
      ? 'transform: translateY(calc((40px + 16px) * 2));'
      : 'transform: translateY(0);'
  }}
  transition: transform 300ms ease-in-out;

  > svg {
    width: 20px;
    height: 20px;
    margin: auto;
    fill: white;
  }

  &:hover {
    background-color: #00000080;
`

const FixedMuteButton = styled(MuteButton)`
  position: fixed;
  bottom: 16px;
  top: auto;
`

const DesktopOnly = styled.div`
  display: none;
  @media (min-width: 1024px) {
    display: block;
  }
`
