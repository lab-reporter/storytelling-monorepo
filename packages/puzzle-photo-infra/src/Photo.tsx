import React, { useCallback, useState } from 'react'
import styled from 'styled-components'
import { Controlled as ControlledZoom } from 'react-medium-image-zoom'
import 'react-medium-image-zoom/dist/styles.css'
import {
  PhotoGroup as SinglePhotoGroup,
  PhotoLayout as SinglePhotoLayout,
} from './SinglePhoto'
import {
  PhotoGroup as TwoPhotoGroup,
  PhotoLayout as TwoPhotoLayout,
} from './TwoPhotoLayout'
import {
  PhotoGroup as ThreePhotoLineGroup,
  PhotoLayout as ThreePhotoLineLayout,
} from './ThreePhotoLine'
import {
  ShapeType,
  FitModeType,
  FocusPositionType,
  VariantType,
  GridType,
} from './types'
// import { LayoutWrapper } from './LayoutWrapper' // whatever you called it
// import { Img } from './PhotoWrapper' // your styled Img

type PhotoGroupProps = {
  photoUrls: string[] // array of URLs
  photoCount: number // should === srcs.length
  fitModes: FitModeType[] // one per image
  focusPositions: FocusPositionType[]
  shape: ShapeType
  isVertical?: boolean
  variant?: VariantType
  grid?: GridType
  alts?: string[] // optional array of alts
  isMain?: boolean[] // optional flags per image
}

export function PhotoGroup({
  photoUrls,
  alts = [],
  fitModes,
  focusPositions,
  photoCount,
  shape,
  isVertical = false,
  variant,
  grid,
  isMain = [],
}: PhotoGroupProps) {
  const [zoomStates, setZoomStates] = useState<boolean[]>(() =>
    new Array(photoCount).fill(false)
  )

  const handleZoomChange = useCallback(
    (i: number) => (shouldZoom: boolean) => {
      setZoomStates((prev) => {
        const next = [...prev]
        next[i] = shouldZoom
        return next
      })
    },
    []
  )

  return (
    <Container>
      <PhotoGroupWrapper
        photoCount={photoCount}
        isVertical={isVertical}
        shape={shape}
      >
        {photoUrls.map((url, i) => (
          <ControlledZoom
            key={i}
            isZoomed={zoomStates[i]}
            onZoomChange={handleZoomChange(i)}
          >
            <LayoutWrapper
              photoCount={photoCount}
              isVertical={isVertical}
              shape={shape}
              variant={variant}
              grid={grid}
              isMain={isMain[i]}
            >
              <Img
                src={url}
                alt={alts[i] || ''}
                fitMode={fitModes[i]}
                focusPosition={focusPositions[i]}
              />
            </LayoutWrapper>
          </ControlledZoom>
        ))}
      </PhotoGroupWrapper>
    </Container>
  )
}

const Container = styled.div`
  display: flex;
  // justify-content: start;
  flex-direction: column;
  align-items: center;
  height: 100vh;
  width: 100vw;
  overflow: hidden; /* Prevents any unwanted scrollbars */
  box-sizing: border-box;
`

function PhotoGroupWrapper({
  photoCount,
  isVertical,
  shape,
  // variant,
  // grid,
  // isMain,
  children,
}: //
{
  photoCount: number
  isVertical?: boolean
  shape?: ShapeType
  variant?: VariantType
  grid?: GridType
  isMain?: boolean
  children: React.ReactNode
}) {
  switch (photoCount) {
    case 1:
      return (
        <SinglePhotoGroup shape={shape} hasPadding={false}>
          {children}
        </SinglePhotoGroup>
      )
    case 2:
      return (
        <TwoPhotoGroup shape={shape} isVertical={isVertical}>
          {children}
        </TwoPhotoGroup>
      )
    case 3:
      return (
        <ThreePhotoLineGroup shape={shape} isVertical={isVertical}>
          {children}
        </ThreePhotoLineGroup>
      )
    default:
      return <></>
  }
}

export function LayoutWrapper({
  photoCount,
  isVertical,
  shape,
  // variant,
  // grid,
  // isMain,
  children,
}: //
{
  photoCount: number
  isVertical?: boolean
  shape?: ShapeType
  variant?: VariantType
  grid?: GridType
  isMain?: boolean
  children: React.ReactNode
}) {
  switch (photoCount) {
    case 1:
      return <SinglePhotoLayout shape={shape}>{children}</SinglePhotoLayout>
    case 2:
      return (
        <TwoPhotoLayout shape={shape} isVertical={isVertical}>
          {children}
        </TwoPhotoLayout>
      )
    case 3:
      // if (variant == 'line') {
      return (
        <ThreePhotoLineLayout shape={shape} isVertical={isVertical}>
          {children}
        </ThreePhotoLineLayout>
      )
    // } //else {
    //     return (
    //       <ThreePhotoLayout_Grid
    //         isMain={isMain}
    //         shape={shape}
    //         isVertical={isVertical}
    //       >
    //         {children}
    //       </ThreePhotoLayout_Grid>
    //     )
    //   }
    default:
      return <></>
  }
}

export const Img = styled.img<{
  fitMode: FitModeType
  focusPosition: FocusPositionType
}>`
  ${({ fitMode }) =>
    fitMode === 'width'
      ? `
                width: 100%;
                height: auto;
                max-height: 100%;
              `
      : `
                height: 100%;
                width: auto;
                max-width: 100%;
              `}

  object-fit: cover;
  object-position: ${({ focusPosition }) => focusPosition};
  box-sizing: border-box;
  overflow: hidden;
`
