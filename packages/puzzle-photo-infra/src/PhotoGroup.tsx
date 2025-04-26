import styled, { css } from 'styled-components'
import { RectangleContainer } from './RectangleContainer'
import { LayoutProps } from './layoutProps'

// const SMALL_GAP = '30px'
// const BIG_GAP = '50px'

export const PhotoGroup = styled(RectangleContainer)<LayoutProps>`
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  overflow: hidden;
  background-color: blue;

  /* 1) flex‑direction */
  flex-direction: ${({ photoCount, variant, isVertical }) =>
    photoCount === 3 && variant === 'grid'
      ? 'row'
      : isVertical
      ? 'column'
      : 'row'};

  /* 2) gap & padding */
  ${({ photoCount, hasPadding, shape, isVertical }) => {
    if (
      (photoCount === 1 && hasPadding) ||
      (photoCount === 2 && (shape != 'verticalRectangle' || isVertical == true))
    ) {
      return css`
        gap: 50px;
        padding: 50px;
      `
    } else if (photoCount === 1) return `padding: 0px`
    // const useBig =
    // photoCount == 2 && !(!isVertical && shape === 'verticalRectangle')
    // const g = useBig ? BIG_GAP : SMALL_GAP
    return css`
      gap: 30px;
      padding: 30px;
    `
  }}

    ${({ photoCount, variant, grid }) => {
      // const gap = hasPadding ? BIG_GAP : SMALL_GAP
      // 1) handle the 3‑photo grid cases:
      if (photoCount === 3 && variant === 'grid') {
        if (grid === 'leftBig') {
          return css`
            display: grid;
            grid-template-areas:
              'a b'
              'a c';
            grid-template-columns: auto auto;
            grid-template-rows: auto auto;
            gap: 30px;
            align-content: center;
            justify-content: center;
          `
        } /* topBig */ else {
          return css`
            display: grid;
            grid-template-areas:
              'a a'
              'b c';
            grid-template-columns: auto auto;
            grid-template-rows: auto auto;
            gap: 30px;
            align-content: center;
            justify-content: center;
          `
        }
      }
    }}



        @media(max - width: 768px) {
            flex - direction: column;
            gap: 20px;
            padding: 20px;
        }
        `
