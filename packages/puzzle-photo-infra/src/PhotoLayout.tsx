// PhotoLayout.tsx
import styled, { css } from 'styled-components'
import { LayoutProps } from './types'

export const PhotoLayout = styled.div<LayoutProps>`
  box-sizing: border-box;
  display: flex;
  // justify-content: center;
  align-items: center;
  // align-content: center;
  overflow: hidden;
  background-color: green;

  ${({ variant, index }) => {
    const AREA_MAP = ['a', 'b', 'c', 'd']
    if (variant === 'grid' && index != null) {
      return css`
        grid-area: ${AREA_MAP[index]};
      `
    }
  }}
  /* compute width/height/aspect-ratio for every combination */
  ${({ photoCount, shape, hasPadding, variant, grid, isVertical, index }) => {
    // helper blocks for each shape+count
    const square = () => {
      if (photoCount == 1) {
        return `width: 100%; height: 100%;`
      }
      if (photoCount === 2) {
        return isVertical
          ? `height:calc((100vh - 150px) / 2); aspect-ratio: 3/2;`
          : `width: calc((100vh - 150px) / 2); aspect-ratio: 2/3;`
      }
      if (photoCount === 3 && variant === 'line') {
        return isVertical
          ? `height:calc((100vh - 120px) / 3); aspect-ratio:3/2;`
          : `width: calc((100vh - 120px) / 3); aspect-ratio:2/3;`
      }
      if (grid === 'leftBig') {
        return index == 0
          ? `height: calc((100vh - 130px) / 3 * 2 + 30px); aspect-ratio: 2/3;`
          : `width: calc((100vh - 130px) / 2 ); aspect-ratio: 3/2;`
      }
      if (grid === 'topBig') {
        return index == 0
          ? `width: calc((100vh - 100px) / 3 * 2 + 30px); aspect-ratio: 3/2;`
          : `height: calc((100vh - 100px) / 2 ); aspect-ratio: 2/3;`
      }
      return `width:100%; height:100%;`
    }

    const horizRect = () => {
      if (photoCount === 1) {
        return hasPadding
          ? `height: calc(100vw / 3 * 2 - 100px); aspect-ratio: 3 / 2`
          : `width: 100%; height: 100%`
      }
      if (photoCount === 2) {
        return isVertical
          ? `height:calc((100vw / 3 * 2) - 100px); aspect-ratio: 3/2;`
          : `width: calc(((100vw / 3 * 2) - 100px) / 3 * 2); aspect-ratio: 2/3;`
      }
      if (photoCount === 3 && variant === 'line') {
        return isVertical
          ? `height:calc(((100vw / 3 * 2) - 120px)/ 3); aspect-ratio: 3/2;`
          : `width: calc((100vw - 120px) / 3); aspect-ratio: 2/3;`
      }
      if (grid === 'leftBig') {
        return index == 0
          ? `height: calc(100vw / 3 * 2 - 100px); aspect-ratio: 2/3;`
          : `height: calc((100vw / 3 * 2 - 130px) / 2 ); aspect-ratio: 3/2;`
      }
      if (grid === 'topBig') {
        return index == 0
          ? `width: calc((100vw / 3 * 2 - 100px) / 3 * 2 + 30px); aspect-ratio: 3/2;`
          : `height: calc((100vw / 3 * 2 - 100px) / 2); aspect-ratio: 2/3;`
      }
      return `width:100%; height:100%;`
    }

    const vertRect = () => {
      if (photoCount === 1) {
        return hasPadding
          ? `width: calc(100vh / 3 * 2 - 100px); aspect-ratio: 2 / 3`
          : `width: 100%; height: 100%`
      }
      if (photoCount === 2) {
        return isVertical
          ? `height: calc((100vh - 150 px) / 2); aspect-ratio: 3/2;`
          : `width: calc(((100vh / 3 * 2) - 90px) / 2); aspect-ratio: 2/3;`
      }
      if (photoCount === 3 && variant === 'line') {
        return isVertical
          ? `height: calc((100vh - 120px) / 3); aspect-ratio: 3/2;`
          : `width: calc(((100vh / 3 * 2) - 120px) / 3); aspect-ratio: 2/3;`
      }
      if (grid === 'leftBig') {
        return index == 0
          ? `height: calc((100vh / 3 * 2 - 90px) / 3 * 2 + 30px ); aspect-ratio: 2/3;`
          : `width: calc((100vh / 3 * 2 - 90px) / 2 ); aspect-ratio: 3/2;`
      }
      if (grid === 'topBig') {
        return index == 0
          ? `width: calc(100vh / 3 * 2 - 60px) ; aspect-ratio: 3/2;`
          : `width: calc((100vh / 3 * 2 - 90px) / 2); aspect-ratio: 2/3;`
      }
      return `width:100%; height:100%;`
    }

    // dispatch by shape
    switch (shape) {
      case 'square':
        return css`
          ${square()}
        `
      case 'horizontalRectangle':
        return css`
          ${horizRect()}
        `
      case 'verticalRectangle':
        return css`
          ${vertRect()}
        `
      default:
        return ``
    }
  }}
`
