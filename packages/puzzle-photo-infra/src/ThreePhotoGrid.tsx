import styled from 'styled-components'
import 'react-medium-image-zoom/dist/styles.css'
import React from 'react'

import { RectangleContainer } from './RectangleContainer'
import { ShapeType } from './types'

export function ThreePhotoGridLayout() {
  // TODO:兩方的高寬只有其一會一樣，另一個不一定，C3是高會一樣，C4是寬會一樣
  // isVertical = true
  return <></>
}

export const PhotoGroup = styled(RectangleContainer)<{ isVertical: boolean }>`
  // width: 100%;
  // heigth: 100%;
  flex-direction: ${({ isVertical }) => (isVertical ? 'column' : 'row')};
  display: flex;
  align-items: center;
  justify-content: center;
  justify-items: center;
  justify-self: center;
  gap: 30px;
`

export const MainPhotoWrapper = styled.div`
  // flex-shrink: 0;
  height: calc((100vh - 130px) / 3 * 2);
  width: auto;
  aspect-ratio: 2 / 3;
  overflow: hidden;
`

export const ThumbnailPhotoContainer = styled.div`
  width: calc((100vh - 130px) / 2);
  height: auto;
  display: flex;
  flex-direction: column;
  gap: 30px; /* Equal spacing between horizontal photos */
`

export const ThumbnailPhotoWrapper = styled.div`
  // flex-shrink: 0;
  width: 300px; /* Should match or be coordinated with the vertical photo width for consistent shape */
  aspect-ratio: 3 / 2;
  overflow: hidden;
`

export const Wrapper = styled.div<{
  isVertical: boolean
  isMain: boolean
  shape: ShapeType
}>`
  display: flex;
  box-sizing: border-box;
  // justify-content: center;
  align-items: center;

  ${({ isMain, isVertical }) => {
    if (!isMain) {
      return `
          display: flex;
          flex-direction: ${isVertical ? 'row' : 'column'};
          gap: 30px;
       `
    }
  }}

  ${({ isVertical }) => {
    return `
        aspect-ratio: ${isVertical ? '3 / 2' : '2 / 3'};
    `
  }} 

  ${({ isVertical, shape }) => {
    if (shape === 'square') {
      return `
        width: ${isVertical ? 'calc((100vh - 100px) / 3 * 2 + 30px)' : 'auto'};
        height: ${isVertical ? 'auto' : 'calc((100vh - 100px) / 3 * 2 + 30px)'};
      `
    } else if (shape === 'horizontalRectangle') {
      return `
        width: ${
          isVertical ? 'calc(((100vw / 3 * 2) - 100px) / 3 * 2 + 30px)' : 'auto'
        };
        height: ${
          isVertical ? 'auto' : 'min(100vh, calc((100vw / 3 * 2) - 100px))'
        };
      `
    } else if (shape === 'verticalRectangle') {
      return `
        width: ${isVertical ? 'calc(100vh / 3 * 2 - 60px)' : 'auto'};
        height: ${
          isVertical ? 'auto' : 'calc(((100vh / 3 * 2) - 90px) / 3 * 2 + 30px)'
        };
      `
    }
  }}
`
