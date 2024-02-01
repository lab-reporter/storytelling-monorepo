import React, { useEffect, useRef, useState } from 'react'
import debounce from 'lodash/debounce'
import gsap from 'gsap'
import styled from '../styled-components'
import { DraftRenderer } from '../draft-renderer/index'
import { RawDraftContentState } from 'draft-js' // eslint-disable-line
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { mediaQuery } from '../utils/media-query'
import { useGSAP } from '@gsap/react'

const _ = {
  debounce,
} // lodash

gsap.registerPlugin(ScrollTrigger)

const Container = styled.div`
  background-color: #e2e2e2;
`

const Sections = styled.div`
  position: relative;
`

const Section = styled.div`
  position: absolute;
  padding: 24px 16px;

  &[data-section-dark-mode='false'] {
    background-color: rgba(255, 255, 255, 0.5);
  }

  &[data-section-dark-mode='true'] {
    background-color: rgba(0, 0, 0, 0.5);
  }

  ${mediaQuery.mobileOnly} {
    &[data-section-narrow-width='true'] {
      width: 75vw;
      left: 50%;
      transform: translateX(-50%);
    }

    &[data-section-narrow-width='false'] {
      width: 100vw;
    }
  }

  ${mediaQuery.tabletAbove} {
    &[data-section-narrow-width='true'] {
      width: 320px;
    }

    &[data-section-narrow-width='false'] {
      width: 46vw;
      max-width: 720px;
    }

    &[data-section-alignment='left'] {
      left: 4vw;
    }
    &[data-section-alignment='right'] {
      right: 4vw;
    }
    &[data-section-alignment='center'] {
      left: 50%;
      transform: translateX(-50%);
    }
  }
`

const BackgroundVideo = styled.div`
  width: 100vw;
  height: 100vh;

  background-color: lightblue;

  position: sticky;
  top: 0;

  > video {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`

export enum WidthEnum {
  WIDE = 'wide',
  NARROW = 'narrow',
}

export enum AlignmentEnum {
  RIGHT = 'right',
  LEFT = 'left',
  CENTER = 'center',
}

export type CaptionState = {
  rawContentState: RawDraftContentState
  startTime: number
  alignment?: AlignmentEnum
  width?: WidthEnum
}

type VideoObj = {
  duration: number
  src: string
  type?: string
  preload?: boolean
  mobileSrc: string
  mobileType?: string
}

export type ScrollableVideoProps = {
  className?: string
  captions: CaptionState[]
  video: VideoObj
  darkMode?: boolean
  secondsPer100vh?: number
}

export function ScrollableVideo({
  className,
  captions,
  video,
  darkMode = false,
  secondsPer100vh = 1.5,
}: ScrollableVideoProps) {
  const scrollTriggerInstance = useRef<ScrollTrigger | null>(null)
  const scrollTriggerRef = useRef<HTMLDivElement>(null)
  const lastSectionRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [lastSectionOverflowHeight, setLastSectionOverflowHeight] = useState(0) // px
  const [pickedVideoSource, setPickedVideoSource] = useState('')
  const duration = video.duration

  // use gsap ScrollTrigger to check if
  // Sections are in the viewport or not,
  // and if the Sections are in the viewport,
  // use the scroll progress to manipulate the video player.
  useGSAP(
    () => {
      const videoEle = videoRef.current

      scrollTriggerInstance.current = ScrollTrigger.create({
        trigger: scrollTriggerRef.current,
        start: 'top 50%',
        end: 'bottom 50%',
        onUpdate: ({ progress }) => {
          if (videoEle && !videoEle?.seeking) {
            const time = Number((progress * duration).toFixed(3))
            videoEle.currentTime = time
          }
        },
      })
    },
    { scope: scrollTriggerRef }
  )

  // pick video.src according to viewport width
  useEffect(() => {
    const pickVideoSource = () => {
      const viewportWidth = window.innerWidth

      if (viewportWidth >= 768 && video?.src) {
        return video.src
      } else if (viewportWidth < 768 && video?.mobileSrc) {
        return video.mobileSrc
      } else if (video?.src) {
        return video.src
      }

      return video.mobileSrc
    }

    const handleResize = _.debounce(() => {
      const videoSource = pickVideoSource()
      setPickedVideoSource(videoSource)
    }, 300)

    setPickedVideoSource(pickVideoSource())

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  // mute video to enable video autoplay
  useEffect(() => {
    const video = videoRef.current
    if (!video) {
      return
    }
    video.muted = true
  }, [pickedVideoSource])

  // In some edge cases,
  // if the last section contains lots of paragraphs,
  // it might overflow the its container.
  // If the edge case happens, the following side effect
  // will increase height of the container to not overflow
  // the last section.
  useEffect(() => {
    const handleLastSectionOverflow = _.debounce(() => {
      const sections = scrollTriggerRef.current
      const lastSection = lastSectionRef.current
      if (sections && lastSection) {
        const overflowHeight =
          lastSection?.getBoundingClientRect()?.bottom -
          sections?.getBoundingClientRect()?.bottom
        if (overflowHeight > 0) {
          setLastSectionOverflowHeight(overflowHeight)
        }
      }
    }, 300)
    handleLastSectionOverflow()
    window.addEventListener('resize', handleLastSectionOverflow)
    return () => {
      window.removeEventListener('resize', handleLastSectionOverflow)
    }
  }, [])

  const sectionsJsx = captions.map((caption, idx) => {
    const startTime = caption.startTime
    const top = `${(startTime / secondsPer100vh) * 100}vh`
    const classNames = `scrollable-video section section-${idx}`
    return (
      <Section
        className={classNames}
        data-section-narrow-width={caption.width !== 'wide'}
        data-section-dark-mode={darkMode}
        data-section-alignment={caption.alignment ?? 'left'}
        ref={idx === captions.length - 1 ? lastSectionRef : undefined}
        key={idx}
        style={{
          top,
        }}
      >
        <DraftRenderer
          darkMode={darkMode}
          rawContentState={caption.rawContentState}
        />
      </Section>
    )
  })

  const preload =
    typeof video.preload === 'boolean' ? `${video.preload}` : 'true'
  const sectionsHeight = `${(duration / secondsPer100vh) * 100}vh`
  const lastSectionHeight = `${lastSectionOverflowHeight}px`

  return (
    <Container className={className}>
      <BackgroundVideo>
        <video
          ref={videoRef}
          preload={preload}
          data-twreporter-story-telling
          data-react-scrollable-video
          data-autoplay={true}
          data-played={false}
          playsInline
          src={pickedVideoSource}
        />
      </BackgroundVideo>
      <Sections
        ref={scrollTriggerRef}
        style={{ height: sectionsHeight }}
        className="scrollable-video sections"
      >
        {sectionsJsx}
      </Sections>
      <LastSectionOverflowHeight style={{ height: lastSectionHeight }} />
    </Container>
  )
}

const LastSectionOverflowHeight = styled.div``
