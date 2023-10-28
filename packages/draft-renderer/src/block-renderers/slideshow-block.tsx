import Multimedia from './multimedia'
import React, { useState, useEffect, useMemo } from 'react'
import styled from 'styled-components'
import { getColorHex } from '../utils/index'
import { mediaQuery } from '../utils/media-query'

const mockup = {
  mobile: {
    container: {
      width: 375, // px
    },
    slide: {
      width: 339, // px
      height: 189, // px
      paddingRight: 2, // px
    },
    offset: {
      left: 18, // px
    },
  },
  tablet: {
    container: {
      width: 768, // px
    },
    slide: {
      width: 687, // px
      height: 387, // px
      paddingRight: 4, // px
    },
    offset: {
      left: 41, // px
    },
  },
  desktop: {
    container: {
      width: 752, // px
    },
    slide: {
      width: 688, // px
      height: 387, // px
      paddingRight: 4, // px
    },
    offset: {
      left: 32, // px
    },
  },
  hd: {
    container: {
      width: 1034, // px
    },
    slide: {
      width: 944, // px
      height: 531, // px
      paddingRight: 4, // px
    },
    offset: {
      left: 45, // px
    },
  },
}

// Assuming there are three images [ A, B, C ] for slideshow.
// If image B is rendered in the center,
// users can see part of image A(left side) and image C(right side) with masks.
// When users click right button to see image C, which means, C is in the center,
// users still can see part of image B(left side) and image A(right side) with masks.
//
// Hence, there are four images rendered arround B at the beginning.
// The image array should be [ C, A, B, C, A ].
//
// `slidesOffset` indicates how many slides rendered before/after image B, which is, 2 (A and C).
//
const slidesOffset = 2

// duration of transition of transform(translateX(?px))
const duration = 300

// current index to indicate which image should be rendered in the center
const defaultCurIndex = 0

const SlidesSection = styled.div`
  flex-shrink: 0;
  flex-basis: 100%;
  overflow: hidden;
  position: relative;

  ${mediaQuery.smallOnly} {
    order: 2;
  }

  ${mediaQuery.smallOnly} {
    padding-bottom: calc(
      ${mockup.mobile.slide.height} / ${mockup.mobile.container.width}*100%
    );
  }

  ${mediaQuery.mediumOnly} {
    padding-bottom: calc(
      ${mockup.desktop.slide.height} / ${mockup.desktop.container.width}*100%
    );
  }

  ${mediaQuery.largeOnly} {
    padding-bottom: calc(
      ${mockup.hd.slide.height} / ${mockup.hd.container.width}*100%
    );
  }
`

const PrevNextSection = styled.div`
  margin-top: 20px;

  ${mediaQuery.smallOnly} {
    order: 3;
  }

  ${mediaQuery.smallOnly} {
    margin-left: 25px;
  }

  ${mediaQuery.mediumAbove} {
    margin-left: 47px;
  }
`

const PrevButton = styled.div`
  cursor: pointer;
  width: 59px;
  height: 59px;
  display: inline-flex;
  border: solid 1px;

  > svg {
    margin: auto;
    width: 21px;
  }

  ${mediaQuery.largeOnly} {
    width: 83px;
    height: 83px;

    > svg {
      width: 31px;
    }
  }

  &:hover {
    > svg {
      transform: translateX(-5px);
      transition: transform 0.3s ease;
    }
  }
`

const NextButton = styled(PrevButton)`
  border-left: none;

  &:hover {
    > svg {
      transform: translateX(5px);
    }
  }
`

const ImageNumberCircle = styled.div`
  display: inline-block;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  vertical-align: top;

  position: relative;

  &::after {
    content: '';
    position: absolute;
    width: 62px;
    border-top: solid 1px;
    transform: rotate(-45deg);
    transform-origin: bottom left;
    top: 67px;
    left: 7px;
  }

  ${mediaQuery.smallOnly} {
    order: 1;

    /* align right */
    margin-left: auto;
    /* 10px is the border-right width of body */
    margin-right: 10px;
  }

  ${mediaQuery.mediumAbove} {
    margin-top: 6px;

    /* align right */
    margin-left: auto;
  }

  ${mediaQuery.largeOnly} {
    margin-right: -18px;
    width: 110px;
    height: 110px;

    &::after {
      width: 89px;
      top: 93px;
      left: 10px;
    }
  }
`

const ImageNumber = styled.span`
  position: absolute;
  top: 25px;
  left: 9px;
  font-size: 24px;
  font-weight: bold;
  line-height: 0.79;

  ${mediaQuery.largeOnly} {
    top: 35px;
    left: 10px;
  }
`

const ImageTotal = styled(ImageNumber)`
  top: 46px;
  left: 36px;

  ${mediaQuery.largeOnly} {
    top: 71px;
    left: 50px;
  }
`

const Desc = styled(Multimedia.Caption)`
  align-self: flex-start;
  display: inline-block;

  /* overwrite Multimedia.Caption styles */
  margin-bottom: 0;

  ${mediaQuery.smallOnly} {
    order: 4;
    padding-top: 15px;
  }

  ${mediaQuery.smallOnly} {
    width: calc(180 / 355 * 100%);
  }

  ${mediaQuery.mediumAbove} {
    padding-top: 30px;

    /* overwrite Multimedia.Caption styles */
    float: none;
  }
`

const EmptyDesc = styled(Desc)`
  &::after {
    border-bottom: none;
  }
`

const SlidesFlexBox = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  flex-wrap: nowrap;
  width: 100%;
  height: 100%;
  ${(props: {
    isSliding: boolean
    duration: number
    translateXUint: number
  }) => {
    if (props.isSliding) {
      return `transition: transform ${props.duration}ms ease-in-out;`
    }
  }}

  ${mediaQuery.smallOnly} {
    transform: translateX(
      ${(props: { translateXUint: number }) =>
        (getTranslateX(mockup.mobile, props.translateXUint) /
          getContainerWidth(mockup.mobile)) *
        100}%
    );
  }

  ${mediaQuery.mediumOnly} {
    transform: translateX(
      ${(props: { translateXUint: number }) =>
        getTranslateX(mockup.desktop, props.translateXUint)}px
    );
  }

  ${mediaQuery.largeOnly} {
    transform: translateX(
      ${(props: { translateXUint: number }) =>
        getTranslateX(mockup.hd, props.translateXUint)}px
    );
  }
`

const SlideFlexItem = styled.div`
  height: 100%;
  flex-shrink: 0;

  ${mediaQuery.smallOnly} {
    flex-basis: calc(
      ${getSlideWidth(mockup.mobile)} / ${getContainerWidth(mockup.mobile)}*100%
    );
    padding-right: calc(
      ${mockup.mobile.slide.paddingRight} /
        ${getContainerWidth(mockup.mobile)}*100%
    );
  }

  ${mediaQuery.mediumOnly} {
    flex-basis: ${getSlideWidth(mockup.desktop)}px;
    padding-right: ${mockup.desktop.slide.paddingRight}px;
  }

  ${mediaQuery.largeOnly} {
    flex-basis: ${getSlideWidth(mockup.hd)}px;
    padding-right: ${mockup.hd.slide.paddingRight}px;
  }
`

const SlideMask = styled.div`
  position: absolute;
  top: 0;
  height: 100%;
  opacity: 0.55;
`

const LeftSlideMask = styled(SlideMask)`
  left: 0;

  ${mediaQuery.smallOnly} {
    width: ${(getLeftMaskWidth(mockup.mobile) /
      getContainerWidth(mockup.mobile)) *
    100}%;
  }

  ${mediaQuery.mediumOnly} {
    width: ${getLeftMaskWidth(mockup.desktop)}px;
  }

  ${mediaQuery.largeOnly} {
    width: ${getLeftMaskWidth(mockup.hd)}px;
  }
`

const RightSlideMask = styled(SlideMask)`
  right: 0;

  ${mediaQuery.smallOnly} {
    width: ${(getRightMaskWidth(mockup.mobile) /
      getContainerWidth(mockup.mobile)) *
    100}%;
  }

  ${mediaQuery.mediumOnly} {
    width: ${getRightMaskWidth(mockup.desktop)}px;
  }

  ${mediaQuery.largeOnly} {
    width: ${getRightMaskWidth(mockup.hd)}px;
  }
`

const SlideshowFlexBox = styled.div`
  ${PrevButton} {
    border-color: #d8d8d8;
  }
  ${ImageNumberCircle} {
    background-color: ${({ theme }) => getColorHex(theme?.themeColor)};
    &::after {
      border-color: #fff;
    }
  }
  ${ImageNumber} {
    color: #fff;
  }
  ${SlideMask} {
    background-color: ${({ theme }) => getColorHex(theme?.themeColor)};
  }

  width: 100%;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;

  ${mediaQuery.smallOnly} {
    width: 100%;
  }

  ${mediaQuery.mediumOnly} {
    width: ${mockup.desktop.container.width}px;
  }

  ${mediaQuery.largeOnly} {
    width: ${mockup.hd.container.width}px;
  }
`

type DeviceMockup = {
  slide: {
    width: number
    height: number
    paddingRight: number
  }
  container: {
    width: number
  }
  offset: {
    left: number
  }
}

function getTranslateX(deviceMockup: DeviceMockup, unit: number) {
  const slideWidth = getSlideWidth(deviceMockup)

  // total slides width including padding
  let translateX = unit * slideWidth

  // add left mask width and padding
  translateX = translateX + deviceMockup.offset.left
  return translateX // px
}

/**
 * @param {DeviceMockup} deviceMockup
 * @return {number}
 */
function getContainerWidth(deviceMockup: DeviceMockup) {
  return deviceMockup.container.width
}

/**
 * @param {DeviceMockup} deviceMockup
 * @return {number}
 */
function getSlideWidth(deviceMockup: DeviceMockup) {
  return deviceMockup.slide.width + deviceMockup.slide.paddingRight
}

/**
 * @param {DeviceMockup} deviceMockup
 * @return {number}
 */
function getLeftMaskWidth(deviceMockup: DeviceMockup) {
  return deviceMockup.offset.left - deviceMockup.slide.paddingRight // px
}

/**
 * @param {DeviceMockup} deviceMockup
 * @return {number}
 */
function getRightMaskWidth(deviceMockup: DeviceMockup) {
  return (
    deviceMockup.container.width -
    deviceMockup.offset.left -
    getSlideWidth(deviceMockup)
  ) // px
}

type ImageFile = {
  width: number
  height: number
  url: string
}

type ImageEntity = {
  id: string
  desc: string // figure caption
  imageFile: ImageFile
  resized?: {
    small: string
    medium: string
    large: string
  }
}

type SlideshowBlockProps = {
  className?: string
  data: {
    delay?: number
    alignment?: string
    images: ImageEntity[]
  }
}

export function SlideshowBlock({ className = '', data }: SlideshowBlockProps) {
  const defaultTranslateXUnit = -slidesOffset

  // value of curSlideIndex would be in [ 0 ~ props.data.content.length ] range,
  // it indicates which image should be placed in the center
  const [curSlideIndex, setCurSlideIndex] = useState(defaultCurIndex)
  const [slideTo, setSlideTo] = useState('') // '', 'previous' or 'next'. '' means no sliding.
  const [translateXUnit, setTranslateXUnit] = useState(defaultTranslateXUnit)
  const images = (data?.images || []).filter((img) => img?.imageFile?.url)
  const total = images?.length
  const desc = images?.[curSlideIndex]?.desc
  const appendedClassName = className + ' avoid-break'

  const slides = useMemo(() => {
    // add last `slidesOffset` elements into top of images array.
    // add first `slidesOffset` elements into bottom of images array.
    // EX:
    // slidesOffset: 2
    // input images: [ a, b, c, d ]
    // output images: [c, d, a, b, c, d, a, b]
    const _images = [
      ...images.slice(-slidesOffset),
      ...images,
      ...images.slice(defaultCurIndex, slidesOffset),
    ]

    return _images?.map((img: ImageEntity, index: number) => {
      const width = img.imageFile.width ?? 0
      const height = img.imageFile.height ?? 0
      const imgSrc = img.resized?.medium ?? img.imageFile.url
      const imgSrcSetArr = []

      if (img.resized?.small) {
        imgSrcSetArr.push(`${img.resized.medium} 600w`)
      }

      if (img.resized?.medium) {
        imgSrcSetArr.push(`${img.resized.medium} 1200w`)
      }

      if (img.resized?.large) {
        imgSrcSetArr.push(`${img.resized.large} 2000w`)
      }

      const objectFit = width > height ? 'cover' : 'contain'

      return (
        // since the items of _images would have the same id,
        // hence, we append `index` on the key
        <SlideFlexItem key={`slide_${img.id}_${index}`}>
          <img
            srcSet={imgSrcSetArr.join(',')}
            src={imgSrc}
            style={{ objectFit, width: '100%' }}
            sizes="(max-width: 768px) 100vw, (min-width: 1400px) 1000px, 500px"
          />
        </SlideFlexItem>
      )
    })
  }, [images])

  const slideToPrev = () => {
    setSlideTo('previous')
    setTranslateXUnit(translateXUnit + 1)
  }

  const slideToNext = () => {
    setSlideTo('next')
    setTranslateXUnit(translateXUnit - 1)
  }

  useEffect(() => {
    if (slideTo === '') {
      return
    }
    let _curSlideIndex: number
    if (slideTo === 'previous') {
      _curSlideIndex = curSlideIndex - 1

      if (_curSlideIndex < defaultCurIndex) {
        _curSlideIndex = total + _curSlideIndex
      }
    } else if (slideTo === 'next') {
      _curSlideIndex = curSlideIndex + 1

      if (_curSlideIndex >= total) {
        _curSlideIndex = _curSlideIndex % total
      }
    }
    setTimeout(() => {
      setSlideTo('')
      setCurSlideIndex(_curSlideIndex)
      setTranslateXUnit(defaultTranslateXUnit - _curSlideIndex)
    }, duration * 2)
  }, [slideTo, curSlideIndex, translateXUnit])

  const isSliding = slideTo !== ''

  return (
    <SlideshowFlexBox className={appendedClassName}>
      <SlidesSection>
        <SlidesFlexBox
          translateXUint={translateXUnit}
          duration={duration}
          isSliding={isSliding}
        >
          {slides}
        </SlidesFlexBox>
        <LeftSlideMask />
        <RightSlideMask />
      </SlidesSection>
      <PrevNextSection>
        <PrevButton onClick={isSliding ? undefined : slideToPrev}>
          <PreArrowSvg />
        </PrevButton>
        <NextButton onClick={isSliding ? undefined : slideToNext}>
          <NextArrowSvg />
        </NextButton>
      </PrevNextSection>
      <ImageNumberCircle>
        <ImageNumber>{curSlideIndex + 1}</ImageNumber>
        <ImageTotal>{total}</ImageTotal>
      </ImageNumberCircle>
      {desc ? <Desc>{desc}</Desc> : <EmptyDesc />}
    </SlideshowFlexBox>
  )
}

function NextArrowSvg() {
  return (
    <svg
      viewBox="0 0 31 17"
      width="31"
      height="17"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M29.33 7.854H0v1h29.256l-7.11 7.148.708.705 8-8.042-.001-.707-8-7.958-.706.709 7.183 7.145z"
        fill="gray"
        fillRule="nonzero"
      />
    </svg>
  )
}

function PreArrowSvg() {
  return (
    <svg
      viewBox="0 0 31 17"
      width="31"
      height="17"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M2.17 8.5H31.5v1H2.244l7.11 7.147-.708.706-8-8.042.001-.707 8-7.958.706.708L2.17 8.5z"
        fill="gray"
      />
    </svg>
  )
}

const ArticleBodyContainer = styled.div`
  margin: 0 auto 27px auto;
`

export function SlideshowInArticleBody({
  className = '',
  data,
}: SlideshowBlockProps) {
  return (
    <ArticleBodyContainer className={className}>
      <SlideshowBlock data={data} />
    </ArticleBodyContainer>
  )
}
