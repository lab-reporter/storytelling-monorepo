import styled from 'styled-components'
import React from 'react'
import { LayoutType, AlignmentType, FitModeType } from './types'

export function ThreePhotoGridLayout({
  photoUrls,
  layout = 'square',
  isVertical = false,
  aligment = ['start', 'center', 'end'],
  fitMode = ['width', 'width', 'width'],
}: {
  photoUrls: string[]
  layout?: LayoutType
  isVertical?: boolean
  aligment?: AlignmentType[]
  fitMode?: FitModeType[]
}) {
  return (
    <Container>
      <GalleryContainer isVertical={isVertical} layout={layout}>
        <PhotoGroup isVertical={isVertical}>
          <Wrapper isMain={true} isVertical={isVertical} layout={layout}>
            <MainPhoto
              src={photoUrls[0]}
              alt="A1"
              fitMode={fitMode[0]}
              isVertical={isVertical}
              alignment={aligment[0]}
            />
          </Wrapper>
          <Wrapper isMain={false} isVertical={isVertical} layout={layout}>
            {[1, 2].map((index) => (
              <ThumbnailPhoto
                key={index}
                src={photoUrls[index]}
                alt={`A${index + 1}`}
                fitMode={fitMode[index]}
                isVertical={isVertical}
                alignment={aligment[index]}
              />
            ))}
          </Wrapper>
        </PhotoGroup>
      </GalleryContainer>
    </Container>
  )
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: start;
  height: 100vh;
  width: 100vw;
  overflow: hidden; /* Prevents any unwanted scrollbars */
  box-sizing: border-box;
  // background-color: blue;
`

const GalleryContainer = styled.div<{
  isVertical: boolean
  layout: LayoutType
}>`
  ${({ layout }) => {
    if (layout === 'square') {
      return `
            width: 100vh;
            height: 100vh;
          `
    } else if (layout === 'horizontalRectangle') {
      return `
            width: 100vw;
            max-height: 100vh;
            height: auto;
            aspect-ratio: 3 / 2;
          `
    } else if (layout === 'verticalRectangle') {
      return `
            height: 100vh;
            aspect-ratio: 2/3;
          `
    }
  }}

  display: flex;
  justify-content: center;
  overflow: hidden;
`

const PhotoGroup = styled.div<{ isVertical: boolean }>`
  width: 100%;
  heigth: 100%;
  flex-direction: ${({ isVertical }) => (isVertical ? 'column' : 'row')};
  display: flex;
  align-items: center;
  justify-content: center;
  justify-items: center;
  justify-self: center;

  gap: 30px;
`

const Wrapper = styled.div<{
  isVertical: boolean
  isMain: boolean
  layout: LayoutType
}>`
  ${({ isMain, isVertical }) => {
    if (!isMain) {
      return `
          display: flex;
          flex-direction: ${isVertical ? 'row' : 'column'};
          gap: 30px;
       `
    }
  }}
  display: flex;
  box-sizing: border-box;
  justify-content: center;
  justify-items: center;
  align-items: center;
  ${({ isVertical, layout }) => {
    if (layout === 'square') {
      return `
            width: ${
              isVertical ? 'calc((100vh - 100px) / 3 * 2 + 30px)' : 'auto'
            };
            height: ${
              isVertical ? 'auto' : 'calc((100vh - 100px) / 3 * 2 + 30px)'
            };
            aspect-ratio: ${isVertical ? '3 / 2' : '2 / 3'};
          `
    } else if (layout === 'horizontalRectangle') {
      return `
            width: ${
              isVertical
                ? 'calc(((100vw / 3 * 2) - 100px) / 3 * 2 + 30px)'
                : 'auto'
            };
            height: ${
              isVertical ? 'auto' : 'min(100vh, calc((100vw / 3 * 2) - 100px))'
            };
            aspect-ratio: ${isVertical ? '3 / 2' : '2 / 3'};
          `
    } else if (layout === 'verticalRectangle') {
      return `
            width: ${isVertical ? 'calc(100vh / 3 * 2 - 60px)' : 'auto'};
            height: ${
              isVertical
                ? 'auto'
                : 'calc(((100vh / 3 * 2) - 90px) / 3 * 2 + 30px)'
            };
            aspect-ratio: ${isVertical ? '3 / 2' : '2 / 3'};
          `
    }
  }}
`

const MainPhoto = styled.img<{
  fitMode: FitModeType
  isVertical: boolean
  alignment: AlignmentType
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
  ${({ isVertical, alignment }) => {
    return `
              justify-self: ${isVertical ? 'center' : alignment};
              align-self: ${isVertical ? alignment : 'center'};
            `
  }}
`

const ThumbnailPhoto = styled(MainPhoto)`
  flex: 1;
`
