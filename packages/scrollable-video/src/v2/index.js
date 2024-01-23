import React, { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import styled from '../styled-components'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { RawDraftContentState } from 'draft-js' // eslint-disable-line
import debounce from 'lodash/debounce'

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

  @media (min-width: 1024px) {
    &[data-narrow-width='true'] {
      width: 360px;
    }
  }

  @media (max-width: 1023px) {
    &[data-narrow-width='true'] {
      width: calc(279 / 375 * 100%);
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

/**
 *  @typedef {'right'|'left'|'center'} Alignment
 *  @typedef {'wide'|'narrow'} SectionWidth
 */

/**
 *  @typedef {Object} ArticleSection
 *  @property {RawDraftContentState} rawContentState
 *  @property {number} startTime
 *  @property {Alignment} alignment
 *  @property {SectionWidth} width
 */

/**
 *  @typedef {Object} VideoObj
 *  @property {number} duration
 *  @property {string} src
 *  @property {number} [frameRate]
 *  @property {string} [type]
 *  @property {boolean} [preload=true]
 */

/**
 *  @param {Object} props
 *  @param {string} [props.className]
 *  @param {ArticleSection[]} props.sections
 *  @param {VideoObj} props.video
 *  @param {number} [props.secondsPer100vh=1.5]
 */
export function ScrollableVideoV2({
  className,
  sections,
  video,
  secondsPer100vh = 1.5,
}) {
  const scrollTriggerInstance = useRef(null)
  const scrollTriggerRef = useRef(null)
  const lastSectionRef = useRef(null)
  const [lastSectionOverflowHeight, setLastSectionOverflowHeight] = useState(0) // px
  const videoRef = useRef(null)
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
          const time = (progress * duration).toFixed(3)
          console.log('progress:', progress)
          console.log('time:', time)
          if (videoEle && !videoEle?.seeking) {
            const time = (progress * duration).toFixed(3)
            videoEle.currentTime = (progress * duration).toFixed(3)
            console.log('progress:', progress)
            console.log('time:', time)
          }
        },
      })
    },
    { scope: scrollTriggerRef }
  )

  // mute video to enable video autoplay
  useEffect(() => {
    const video = videoRef.current
    if (!video) {
      return
    }
    video.muted = true
  }, [])

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

  const sectionsJsx = sections.map((section, idx) => {
    const startTime = section.startTime
    console.log('startTime:', startTime)
    return (
      <Section
        data-narrow-width
        ref={idx === sections.length - 1 ? lastSectionRef : undefined}
        key={idx}
        style={{
          top: `${(startTime / 1.5) * 100}vh`,
        }}
      >
        <div style={{ height: '100vh', backgroundColor: 'pink' }}></div>
      </Section>
    )
  })

  return (
    <Container className={className}>
      <BackgroundVideo>
        <video
          ref={videoRef}
          preload={
            typeof video.preload === 'boolean' ? `${video.preload}` : 'true'
          }
          data-twreporter-story-telling
          data-react-scrollable-video
          data-autoplay={true}
          data-played={false}
          playsInline
        >
          <source src={video.src} type={video.type}></source>
        </video>
      </BackgroundVideo>
      <Sections
        ref={scrollTriggerRef}
        style={{ height: `${(duration / secondsPer100vh) * 100}vh` }}
      >
        {sectionsJsx}
      </Sections>
      <LastSectionOverflowHeight
        style={{ height: `${lastSectionOverflowHeight}px` }}
      />
    </Container>
  )
}

const LastSectionOverflowHeight = styled.div``
