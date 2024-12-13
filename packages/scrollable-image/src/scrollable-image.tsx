import React, { useEffect, useRef, useState } from 'react'
import debounce from 'lodash/debounce'
import { gsap } from 'gsap/dist/gsap'
import styled, { ThemeProvider } from './styled-components'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { ImgObj, Caption } from './type'
import { EmbeddedCodeBlock } from './embedded-code-block'
// import { LexicalTextRenderer } from './lexical-text-renderer/index'

const _ = {
  debounce,
} // lodash

gsap.registerPlugin(ScrollTrigger)

const Container = styled.div``

const StickyBlock = styled.div`
  width: 100vw;
  height: 100vh;
  overflow: hidden;

  position: sticky;
  top: 0;

  display: flex;
  align-items: center;

  /* @TODO background-color should be configurable */
  background-color: transparent;
`

const ImgsBlock = styled.div`
  position: relative;
  width: fit-content;
  height: 100%;

  display: flex;
  flex-wrap: nowrap;
  margin: auto;
`

const Img = styled.img`
  vertical-align: middle;
  height: 100%;
  border: none;
`

const CaptionBlock = styled.div`
  position: absolute;
  color: ${(props) => (props.theme.darkMode ? '#fff' : '#000')};
`

const EmptyBlockForScrolling = styled.div`
  margin-top: -100vh;
`

export type ScrollableImageProps = {
  className?: string
  imgObjs: ImgObj[] // urls of image objects
  captions?: Caption[]

  // minimum height of the images.
  // Since `height` could be `100vh`,
  // if the viewport height is very narrow,
  // and the `ScrollableImage` will look very small.
  // `minHeight` could be used to set minimum height of images.
  minHeight?: string

  // height of the images.
  // If `height` is `100vh`, and then the images of the `ScrollableImage` will
  // cover the whole viewport.
  // If `height` is `50vh`, and then the images will only contain half viewport,
  // and will be aligned in the center vertically.
  height?: string

  // maximum height of the images.
  // Since `height` could be `100vh`,
  // if the viewport height is very tall,
  // and the `ScrollableImage` will look very big.
  // `maxHeight` could be used to restrict the height of images.
  maxHeight?: string
  darkMode?: boolean
  scrollerRef?: React.RefObject<HTMLElement>
}

export function ScrollableImage({
  className,
  imgObjs,
  captions = [],
  minHeight = '',
  height = '100vh',
  maxHeight = '',
  darkMode = false,
  scrollerRef,
}: ScrollableImageProps) {
  const [scrollDistance, setScrollDistance] = useState(0)
  const scrollTriggerInstance = useRef<ScrollTrigger | null>(null)
  const scrollTriggerRef = useRef<HTMLDivElement>(null)
  const imgsBlockRef = useRef<HTMLDivElement>(null)
  const [debugMode, setDebugMode] = useState(true)

  // use gsap ScrollTrigger to check if
  // `ScrollableImage` is in the viewport or not,
  // and if it is in the viewport,
  // use the scroll progress to transform images of `ScrollableImage`.
  useGSAP(
    () => {
      if (!scrollTriggerRef.current || scrollDistance === 0) {
        return
      }

      if (scrollTriggerInstance.current) {
        // kill old instance to avoid getting stale dependencies
        scrollTriggerInstance.current.kill()
      }

      scrollTriggerInstance.current = ScrollTrigger.create({
        markers: debugMode,
        trigger: scrollTriggerRef.current,
        start: 'top 0%',
        end: 'bottom 100%',
        scroller: scrollerRef?.current || window,
        onUpdate: ({ progress }: { progress: number }) => {
          const height = scrollTriggerRef.current?.offsetHeight
          if (height) {
            const distance = Number((progress * height).toFixed(2))

            const imgsBlockEle = imgsBlockRef.current

            if (imgsBlockEle) {
              imgsBlockEle.style.transform = `translateX(-${distance}px)`
            }
          }
        },
      })

      return () => {
        if (scrollTriggerInstance.current) {
          scrollTriggerInstance.current.kill()
        }
      }
    },
    {
      scope: scrollTriggerRef,
      dependencies: [debugMode, scrollDistance],
    }
  )

  // use query param to enable debugMode
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search)
    if (searchParams.has('debug')) {
      setDebugMode(true)
    }
  }, [])

  // After images loaded, calculate the scroll distance.
  // Bind resize event listener to re-calculate the scroll distance.
  useEffect(() => {
    if (!imgsBlockRef.current) {
      return
    }

    const images = imgsBlockRef.current.querySelectorAll('img')
    let loadedImagesCount = 0

    function onImageLoad() {
      loadedImagesCount++

      if (loadedImagesCount === images.length) {
        const blockWidth = imgsBlockRef.current?.offsetWidth
        if (blockWidth) {
          // The first viewport width does not need to scroll.
          setScrollDistance(blockWidth - window.innerWidth)
        }
      }
    }

    images.forEach((img) => {
      if (img.complete) {
        onImageLoad()
      } else {
        img.onload = () => onImageLoad()
      }
    })

    const handleResize = _.debounce(() => {
      if (loadedImagesCount === images.length) {
        const blockWidth = imgsBlockRef.current?.offsetWidth
        if (blockWidth) {
          // The first viewport width does not need to scroll.
          setScrollDistance(blockWidth - window.innerWidth)
        }
      }
    }, 300)

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <ThemeProvider
      theme={{
        darkMode,
      }}
    >
      <Container
        className={className}
        data-twreporter-story-telling
        data-react-scrollable-image
      >
        <StickyBlock>
          <ImgsBlock
            ref={imgsBlockRef}
            style={{ height, maxHeight, minHeight }}
          >
            {imgObjs.map((imgObj, idx) => {
              return <Img key={idx} src={imgObj.url}></Img>
            })}
            {captions.map((captionObj, idx) => {
              return (
                <CaptionBlock
                  key={idx}
                  style={{
                    ...captionObj.position,
                    width: captionObj.width,
                    height: captionObj.height,
                  }}
                >
                  <EmbeddedCodeBlock embeddedCode={captionObj.data} />
                </CaptionBlock>
              )
            })}
          </ImgsBlock>
        </StickyBlock>
        <EmptyBlockForScrolling
          ref={scrollTriggerRef}
          style={{ height: scrollDistance }}
        />
      </Container>
    </ThemeProvider>
  )
}
