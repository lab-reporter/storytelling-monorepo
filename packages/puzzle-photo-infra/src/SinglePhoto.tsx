import styled from 'styled-components'
import React from 'react'
import { LayoutType } from './types'

export function SinglePhoto({
  photoUrls,
  layout,
  hasPadding = false,
}: {
  photoUrls: string[]
  layout: LayoutType
  hasPadding?: boolean
}) {
  // hasPadding = false
  return (
    <Container>
      <PhotoGroup hasPadding={hasPadding} layout={layout}>
        <Img src={photoUrls[0]} alt="Puzzle Photo" />
      </PhotoGroup>
    </Container>
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

const PhotoGroup = styled.div<{ layout: LayoutType; hasPadding: boolean }>`
  box-sizing: border-box;
  padding: ${({ hasPadding }) => (hasPadding ? '50px' : '0')};
  ${({ layout }) => {
    if (layout === 'square') {
      return `
        width: 100vh;
        height: 100vh;
        display: flex;
      `
    } else if (layout === 'horizontalRectangle') {
      return `
        width: 100vw;
        aspect-ratio: 3 / 2; 
      `
    } else if (layout === 'verticalRectangle') {
      return `
        // width: calc(100vh / 3 * 2);
        // height: 100vh;
        
        height: 100vh;
        // width: calc(100vh / 3 * 2);
        aspect-ratio: 2 / 3; 
      `
    }
  }}
`

const Img = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`
