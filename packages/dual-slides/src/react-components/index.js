import Background from './background.js'
import Foreground from './foreground.js'
import styled from '../styled-components.js'
import { useState } from 'react'

const Block = styled.div`
  background-color: #fff;
  position: relative;
  left: calc(50% - 50vw);
  width: 100vw;
  height: ${
    /**
     *  @param {Object} props
     *  @param {number} props.slidesLen
     */
    (props) => `${props.slidesLen}00vh;`
  };
`

const ForegroundBlock = styled.div`
  position: absolute;
  z-index: 0;
  width: 100vw;
  height: 100vh;
`

const StyledBackground = styled(Background)`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  height: 100%;
`

const StickyBackground = styled.div`
  z-index: 1;
  position: sticky;
  top: 0px;
  width: 100vw;
  height: 100vh;
`

/**
 *  @typedef {import('./background').Slide} Slide
 */

/**
 *  @typedef {Object} DualSlidesProps
 *  @property {Slide[]} slides
 */

/**
 *  @param {DualSlidesProps} props
 *  @returns {React.ReactElement}
 */
export default function DualSlides({ slides }) {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0)

  const foregrounds = slides.map((slide, index) => {
    return (
      <Foreground
        key={index}
        slideIndex={index}
        onEnterViewport={(slideIndex) => {
          setCurrentSlideIndex(slideIndex)
        }}
      />
    )
  })

  const backgrounds = slides.map((slide, index) => {
    return (
      <StyledBackground
        key={index}
        slide={slides[index]}
        inProp={index === currentSlideIndex}
        showScrollDown={
          // Do not show scroll down at last slide
          index !== slides.length - 1 && currentSlideIndex === index
        }
      />
    )
  })

  return (
    <Block slidesLen={slides.length}>
      <ForegroundBlock>{foregrounds}</ForegroundBlock>
      <StickyBackground>{backgrounds}</StickyBackground>
    </Block>
  )
}
