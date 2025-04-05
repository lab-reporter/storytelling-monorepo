import styled from 'styled-components'
import React from 'react'
import { LayoutType, AlignmentType, FitModeType } from './types'

export function ThreePhotoLayout({
  photoUrls,
  layout = 'square',
  isVertical = false,
  aligment = ['start', 'center', 'end'],
  fitMode = ['width', 'height', 'width'],
}: {
  photoUrls: string[]
  layout?: LayoutType
  isVertical?: boolean
  aligment?: AlignmentType[]
  fitMode?: FitModeType[]
}) {
  return (
    <Container>
      <PhotoGroup isVertical={isVertical} layout={layout}>
        <PhotoWrapper
          layout={layout}
          isVertical={isVertical}
          alignment={aligment[0]}
        >
          <Photo
            src={photoUrls[0]}
            alt="Puzzle Photo"
            isVertical={isVertical}
            fitMode={fitMode[0]}
          />
        </PhotoWrapper>
        <PhotoWrapper
          layout={layout}
          isVertical={isVertical}
          alignment={aligment[1]}
        >
          <Photo
            src={photoUrls[1]}
            alt="Puzzle Photo"
            isVertical={isVertical}
            fitMode={fitMode[1]}
          />
        </PhotoWrapper>
        <PhotoWrapper
          layout={layout}
          isVertical={isVertical}
          alignment={aligment[2]}
        >
          <Photo
            src={photoUrls[2]}
            alt="Puzzle Photo"
            isVertical={isVertical}
            fitMode={fitMode[2]}
          />
        </PhotoWrapper>
      </PhotoGroup>
    </Container>
  )
}

const Container = styled.div`
  display: flex;
  justify-content: start;
  flex-direction: column;
  align-items: center;
  height: 100vh;
  width: 100vw;
  overflow: hidden; /* Prevents any unwanted scrollbars */
  box-sizing: border-box;
`

const PhotoGroup = styled.div<{ isVertical: boolean; layout: LayoutType }>`
  ${({ layout }) => {
    if (layout === 'square') {
      return `
            aspect-ratio: 1; /* Ensures width and height are equal */
            width: min(100%, 100vh);
            height: 100%;
          `
    } else if (layout === 'horizontalRectangle') {
      return `
        width: min(100%, calc(100vh / 2 * 3));
        width: 100vw;
        height: calc(100vw / 3 * 2);
        aspect-ratio: 3/2; /* Ensures width and height are equal */
      `
    } else if (layout === 'verticalRectangle') {
      return `
        // width: min(calc(100vh / 3 * 2), 100%);
        height: 100%;
        aspect-ratio: 2/3; /* Ensures width and height are equal */
      `
    }
  }}

  flex-direction: ${({ isVertical }) => (isVertical ? 'column' : 'row')};
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  gap: 30px;
  padding: 30px;
  overflow: hidden;
  // @media (max-width: 768px) {
  //   flex-direction: column;
  // }
`

const PhotoWrapper = styled.div<{
  layout: LayoutType
  isVertical: boolean
  alignment: AlignmentType
}>`
  box-sizing: border-box;
  ${({ isVertical, layout }) => {
    if (layout === 'square') {
      return `
            max-width: ${
              isVertical ? '100%' : 'min(100%, calc((100vh - 120px) / 3))'
            };
            max-height: ${
              isVertical ? 'min(50%, calc((100vh - 120px) / 3))' : '100%'
            };
            aspect-ratio: ${isVertical ? '3 / 2' : '2 / 3'};
      `
    } else if (layout === 'horizontalRectangle') {
      return `
            max-width: ${
              isVertical ? '100%' : 'min(50%, calc((100vw - 120px) / 3))'
            };
            max-height: ${
              isVertical
                ? 'min(50%, calc(((100vw / 3 * 2) - 120px) /3))'
                : '100%'
            };

            aspect-ratio: ${isVertical ? '3 / 2' : '2 / 3'};
        `
    } else if (layout === 'verticalRectangle') {
      return `
              max-width: ${
                isVertical
                  ? '100%'
                  : 'min(100%, calc(((100vh / 3 * 2) - 120px) / 3))'
              };
              max-height: ${
                isVertical ? 'min(50%, calc((100vh - 120px) / 3))' : '100%'
              };
              aspect-ratio: ${isVertical ? '3 / 2' : '2 / 3'};
        `
    }
  }}

  ${({ isVertical, alignment }) => {
    return `
              align-self: ${isVertical ? alignment : 'center'};
              justify-self: ${isVertical ? 'center' : alignment};
            `
  }} 
    align-items: center;
  justify-content: center;
  display: flex;
  flex: 0 1 1;
  overflow: hidden;
`
const Photo = styled.img<{ isVertical: boolean; fitMode: FitModeType }>`
  // aspect-ratio: ${({ isVertical }) => (isVertical ? '3 / 2' : '2 / 3')};
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
  box-sizing: border-box;
  overflow: hidden;
`
