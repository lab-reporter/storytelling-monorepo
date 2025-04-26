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
        height: 100vh;
        aspect-ratio: 1; 
      `
    } else if (shape === 'horizontalRectangle') {
      return `
        width: 100vw;
        height: auto;
        max-height: 100vh;
        aspect-ratio: 3 / 2; 
      `
    } else if (shape === 'verticalRectangle') {
      return `
        width: auto;
        height: 100vh;
        aspect-ratio: 2 / 3; 
      `
    }
  }}
`
