import styled from 'styled-components'
import { ShapeType } from './types'
import { RectangleContainer } from './RectangleContainer'

export const PhotoGroup = styled(RectangleContainer)<{ isVertical: boolean }>`
  flex-direction: ${({ isVertical }) => (isVertical ? 'column' : 'row')};
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 30px;
  padding: 30px;
  overflow: hidden;
  box-sizing: border-box;
  // @media (max-width: 768px) {
  //   flex-direction: column;
  // }
`

export const PhotoLayout = styled.div<{
  shape: ShapeType
  isVertical: boolean
}>`
  box-sizing: border-box;
  ${({ isVertical, shape }) => {
    if (shape === 'square') {
      return `
        width: ${isVertical ? 'auto' : 'calc((100vh - 120px) / 3)'};
        height: ${isVertical ? 'calc((100vh - 120px) / 3)' : 'auto'};
      `
    } else if (shape === 'horizontalRectangle') {
      return `
        width: ${isVertical ? 'auto' : 'calc((100vw - 120px) / 3)'};
        height: ${isVertical ? 'calc(((100vw / 3 * 2) - 120px) /3)' : 'auto'};
      `
    } else if (shape === 'verticalRectangle') {
      return `
        width: ${isVertical ? 'auto' : 'calc(((100vh / 3 * 2) - 120px) / 3)'};
        height: ${isVertical ? 'calc((100vh - 120px) / 3)' : 'auto'};
      `
    }
  }}

  ${({ isVertical }) => {
    return `
            aspect-ratio: ${isVertical ? '3 / 2' : '2 / 3'};
        `
  }} 
  align-items: center;
  justify-content: center;
  display: flex;
  // flex: 0 1 1;
  overflow: hidden;
`
