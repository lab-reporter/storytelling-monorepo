import { useEffect } from 'react'
import { useInView } from 'react-intersection-observer'
import styled from '../styled-components.js'

const Block = styled.div`
  height: 100%;
  width: 100%;
`

/**
 *  @callback OnEnterViewport
 *  @param {number} slideIndex
 */

/**
 *  @callback OnLeaveViewport
 *  @param {number} slideIndex
 */

/**
 *  @param {Object} props
 *  @param {number} props.slideIndex
 *  @param {OnEnterViewport} props.onEnterViewport
 *  @returns {React.ReactElement}
 */
export default function Foreground({ slideIndex, onEnterViewport }) {
  const [inViewRef, inView] = useInView({
    threshold: [0.5],
  })

  useEffect(() => {
    console.log('slideIndex:', slideIndex)
    if (inView) {
      onEnterViewport(slideIndex)
      return
    }
  }, [inView])

  return <Block ref={inViewRef} />
}
