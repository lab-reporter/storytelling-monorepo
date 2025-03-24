import styled from 'styled-components'
import React from 'react'

export function TwoPhotoLayout({
  photoUrls,
  hasPadding = false,
  isVertical = false,
}: {
  photoUrls: string[]
  hasPadding?: boolean
  isVertical?: boolean
}) {
  hasPadding = true
  // isVertical = false
  return (
    <>
      {/* <PhotoGroup hasPadding={hasPadding}> */}
      <Container hasPadding={hasPadding}>
        <SquareGroup isVertical={isVertical}>
          <Img src={photoUrls[0]} alt="Puzzle Photo" />
          <Img src={photoUrls[1]} alt="Puzzle Photo" />
        </SquareGroup>
      </Container>
      <Container hasPadding={hasPadding}>
        <HorizontalRectangleGroup isVertical={isVertical}>
          <HorizontalRectangleImg src={photoUrls[0]} alt="Puzzle Photo" />
          <HorizontalRectangleImg src={photoUrls[1]} alt="Puzzle Photo" />
        </HorizontalRectangleGroup>
      </Container>
      <Container hasPadding={hasPadding}>
        <VerticalRectangle isVertical={isVertical}>
          <Img src={photoUrls[0]} alt="Puzzle Photo" />
          <Img src={photoUrls[1]} alt="Puzzle Photo" />
        </VerticalRectangle>
      </Container>
    </>
  )
}

const Container = styled.div<{ hasPadding: boolean }>`
  display: flex;
  justify-content: start;
  flex-direction: column;
  align-items: center;
  height: 100vh;
  width: 100vw;
  overflow: hidden; /* Prevents any unwanted scrollbars */
  box-sizing: border-box;
  padding: ${({ hasPadding }) => (hasPadding ? '50px' : '0')};
`
const SquareGroup = styled.div<{ isVertical: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: ${({ isVertical }) => (isVertical ? 'column' : 'row')};
  // flex-direction: column;
  gap: 50px;
  aspect-ratio: 1; /* Ensures width and height are equal */
  width: min(100%, 100vh);
  height: 100%;

  box-sizing: border-box;
  overflow: hidden;

  // @media (max-width: 768px) {
  //   flex-direction: column;
  // }
`

const HorizontalRectangleGroup = styled.div<{ isVertical: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: ${({ isVertical }) => (isVertical ? 'column' : 'row')};
  gap: 50px;
  width: min(100%, 100vh / 2 * 3);
  height: min(calc(100vw / 3 * 2), 100vh);

  overflow: hidden;
  // padding: ${({ hasPadding }) => (hasPadding ? '50px' : '0')};
`

const VerticalRectangle = styled.div<{ isVertical: boolean }>`
  display: flex;
  box-sizing: border-box;
  justify-content: center;
  align-items: center;
  flex-direction: ${({ isVertical }) => (isVertical ? 'column' : 'row')};
  gap: 50px;
  width: min(calc(100vh / 3 * 2), 100%);
  height: 100vh;
  overflow: hidden;
`

const Img = styled.img`
  flex: 1;
  width: calc(((100vh - 150px) / 2) / 2 * 3);
  height: calc((100vh - 150px) / 2);
  object-fit: cover;
  overflow: hidden;
`
const HorizontalRectangleImg = styled.img`
  width: calc((((100vw / 3 * 2) - 150px) / 2) / 2 * 3);
  height: calc((100vw / 3 * 2 - 150px) / 2);
  flex: 1;
  object-fit: cover;
  // object-fit: contain; /* Ensures the entire image is visible without overflow */
  // box-sizing: border-box;
`
