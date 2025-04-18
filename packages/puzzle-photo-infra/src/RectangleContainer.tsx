import styled from 'styled-components'
import { ShapeType } from './types'

export const RectangleContainer = styled.div<{
  shape: ShapeType
}>`
  box-sizing: border-box;
  ${({ shape }) => {
    if (shape === 'square') {
      return `
        width: 100vh;
        height: auto;
        aspect-ratio: 1; 
      `
    } else if (shape === 'horizontalRectangle') {
      return `
        width: 100%;
        height: auto;
        max-height: 100%;
        aspect-ratio: 3 / 2; 
      `
    } else if (shape === 'verticalRectangle') {
      return `
        width: auto;
        height: 100%;
        aspect-ratio: 2 / 3; 
      `
    }
  }}
`
