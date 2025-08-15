import styled from 'styled-components'
import type { LayoutProps } from './types'

export const RectangleContainer = styled.div<LayoutProps>`
  box-sizing: border-box;

  @media (min-width: 1440px) {
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
  }

  @media (min-width: 1024px) and (max-width: 1439px) {
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
  }

  @media (min-width: 768px) and (max-width: 1023px) {
    ${({ shape }) => {
      if (shape === 'square') {
        return `
        width: 100vw;
        height: 100vw;
        aspect-ratio: 1; 
      `
      } else if (shape === 'horizontalRectangle') {
        return `
        width: 100vw;
        height: auto;
        // max-height: 100vh;
        aspect-ratio: 3 / 2; 
      `
      } else if (shape === 'verticalRectangle') {
        return `
        width: 100vw;
        height: auto;
        aspect-ratio: 2 / 3; 
      `
      }
    }}
  }

  @media (max-width: 767px) {
    ${({ shape, photoCount, isVertical, variant, grid }) => {
      const RATIO_MAP = {
        square: '1 / 1',
        horizontalRectangle: '3 / 2',
        verticalRectangle: '2 / 3',
      } as const

      if (
        photoCount === 1 ||
        (photoCount === 2 && !isVertical) ||
        (photoCount === 3 &&
          variant === 'line' &&
          isVertical &&
          shape === 'verticalRectangle') ||
        (photoCount === 4 && grid === 'uniform' && !isVertical)
      ) {
        return `
            width: 100vw;
            height: auto;
            aspect-ratio: ${RATIO_MAP[shape]};
        `
      } else {
        return `
        width: 100vw;
        height: auto;
      `
      }
    }}
  }
`
