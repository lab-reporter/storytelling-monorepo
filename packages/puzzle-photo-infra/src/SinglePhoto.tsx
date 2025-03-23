import styled from 'styled-components'
import React from 'react'

export function SinglePhoto({
  photoUrls,
  hasPadding = false,
}: {
  photoUrls: string[]
  hasPadding?: boolean
}) {
  // hasPadding = false
  return (
    <>
      <Container>
        <Square hasPadding={hasPadding}>
          <Img src={photoUrls[0]} alt="Puzzle Photo" />
        </Square>
      </Container>
      <Container>
        <HorizontalRectangle hasPadding={hasPadding}>
          <Img src={photoUrls[0]} alt="Puzzle Photo" />
        </HorizontalRectangle>
      </Container>
      <Container>
        <VerticalRectangle hasPadding={hasPadding}>
          <Img src={photoUrls[0]} alt="Puzzle Photo" />
        </VerticalRectangle>
      </Container>
    </>
  )
}

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: start;
  height: 100vh;
  width: 100vw;
  overflow: hidden; /* Prevents any unwanted scrollbars */
`

const Square = styled.div<{ hasPadding: boolean }>`
  box-sizing: border-box;
  display: flex;
  width: 100vh;
  height: 100vh;
  padding: ${({ hasPadding }) => (hasPadding ? '50px' : '0')};
  // object-fit: contain; /* Optional: Keeps aspect ratio */
`

const HorizontalRectangle = styled.div<{ hasPadding: boolean }>`
  // box-sizing: border-box;
  width: 100vw;
  height: calc(100vw / 3 * 2);
  padding: ${({ hasPadding }) => (hasPadding ? '50px' : '0')};
  // object-fit: contain; /* Optional: Keeps aspect ratio */
`

const VerticalRectangle = styled.div<{ hasPadding: boolean }>`
  box-sizing: border-box;
  width: calc(100vh / 3 * 2);
  height: 100vh;
  padding: ${({ hasPadding }) => (hasPadding ? '50px' : '0')};
  // object-fit: contain; /* Optional: Keeps aspect ratio */
`

const Img = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`
