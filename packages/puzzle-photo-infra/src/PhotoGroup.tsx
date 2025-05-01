import styled, { css } from 'styled-components'
import { RectangleContainer } from './RectangleContainer'
import { LayoutProps } from './types'

// const SMALL_GAP = '30px'
// const BIG_GAP = '50px'

export const PhotoGroup = styled(RectangleContainer)<LayoutProps>`
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  overflow: hidden;

  /* 1) flex‑direction */
  flex-direction: ${({ photoCount, variant, isVertical }) =>
    photoCount === 3 && variant === 'grid'
      ? 'row'
      : isVertical
      ? 'column'
      : 'row'};

  /* grid */
  ${({ variant, grid }) => {
    if (variant === 'grid') {
      if (grid === 'leftBig') {
        return css`
          display: grid;
          grid-template-areas:
            'a b'
            'a c';
          grid-template-columns: auto auto;
          grid-template-rows: auto auto;
          align-content: center;
          justify-content: center;
        `
      } /* topBig */ else if (grid == 'topBig') {
        return css`
          display: grid;
          grid-template-areas:
            'a a'
            'b c';
          grid-template-columns: auto auto;
          grid-template-rows: auto auto;
          align-content: center;
          justify-content: center;
        `
      } else if (grid == 'uniform') {
        return css`
          display: grid;
          grid-template-areas:
            'a b'
            'c d';
          grid-template-columns: auto auto;
          grid-template-rows: auto auto;
          align-content: center;
          justify-content: center;
        `
      } else if (grid == 'mixed') {
        return css`
          display: grid;
          grid-template-areas:
            'a a b'
            'c d d';
          grid-template-columns: auto auto;
          grid-template-rows: auto auto;
          align-content: center;
          justify-content: center;
        `
      }
    }
  }}

  @media (min-width: 1440px) {
    ${({ ...props }) => {
      return css`
        ${hd(props)}
      `
    }}
  }

  @media (min-width: 1024px) and (max-width: 1439px) {
    ${({ ...props }) => {
      return css`
        ${desktop(props)}
      `
    }}
  }

  @media (min-width: 768px) and (max-width: 1023px) {
    ${({ ...props }) => {
      return css`
        ${tablet(props)}
      `
    }}
  }

  @media (max-width: 767px) {
    ${({ ...props }) => {
      return css`
        ${mobile(props)}
      `
    }}
  }
`

export function hd(p: LayoutProps) {
  const { shape, photoCount, hasPadding, isVertical, grid } = p
  if (photoCount === 1 && !hasPadding) {
    return ``
  } else if (
    (photoCount === 1 && hasPadding) ||
    (photoCount === 2 && (shape != 'verticalRectangle' || isVertical == true))
  ) {
    return css`
      gap: 50px;
      padding: 50px;
    `
  } else if (grid == 'topBig' || grid == 'leftBig') {
    return css`
      gap: 30px;
    `
  } else if (grid == 'mixed' && shape != 'verticalRectangle') {
    return css`
      gap: 30px;
      padding: 60px 0px;
    `
  } else if (grid == 'mixed' && shape == 'verticalRectangle') {
    return css`
      gap: 30px;
      padding: 0px auto;
    `
  } else {
    return css`
      gap: 30px;
      padding: 30px;
    `
  }
}

export function desktop(p: LayoutProps) {
  const { shape, photoCount, hasPadding, isVertical, grid } = p
  if (photoCount === 1 && !hasPadding) {
    return ``
  } else if (
    (photoCount === 1 && hasPadding) ||
    (photoCount === 2 && (shape != 'verticalRectangle' || isVertical == true))
  ) {
    return css`
      gap: 50px;
      padding: 50px;
    `
  } else if (grid == 'topBig' || grid == 'leftBig') {
    return css`
      gap: 30px;
    `
  } else if (grid == 'mixed' && shape != 'verticalRectangle') {
    return css`
      gap: 30px;
      padding: 60px 0px;
    `
  } else if (grid == 'mixed' && shape == 'verticalRectangle') {
    return css`
      gap: 30px;
      padding: 0px auto;
    `
  } else {
    return css`
      gap: 30px;
      padding: 30px;
    `
  }
}

export function tablet(p: LayoutProps) {
  const { shape, photoCount, hasPadding, isVertical, grid } = p
  if (photoCount === 1 && !hasPadding) {
    return ``
  } else if (
    (photoCount === 1 && hasPadding) ||
    (photoCount === 2 && (shape != 'verticalRectangle' || isVertical == true))
  ) {
    return css`
      gap: 30px;
      padding: 30px;
    `
  } else if (grid == 'topBig' || grid == 'leftBig') {
    return css`
      gap: 30px;
    `
  } else if (grid == 'mixed' && shape != 'verticalRectangle') {
    return css`
      gap: 30px;
      padding: 60px 0px;
    `
  } else if (grid == 'mixed' && shape == 'verticalRectangle') {
    return css`
      gap: 30px;
      padding: 0px auto;
    `
  } else {
    return css`
      gap: 20px;
      padding: 20px;
    `
  }
}

export function mobile(p: LayoutProps) {
  const { shape, photoCount, hasPadding, isVertical, grid } = p
  if (photoCount === 1 && !hasPadding) {
    return ``
  } else if (
    (photoCount === 1 && hasPadding) ||
    (photoCount === 2 && (shape != 'verticalRectangle' || isVertical == true))
  ) {
    return css`
      gap: 20px;
      padding: 20px;
    `
  } else if (grid == 'topBig' || grid == 'leftBig') {
    return css`
      gap: 30px;
    `
  } else if (grid == 'mixed' && shape != 'verticalRectangle') {
    return css`
      gap: 30px;
      padding: 60px 0px;
    `
  } else if (grid == 'mixed' && shape == 'verticalRectangle') {
    return css`
      gap: 30px;
      padding: 0px auto;
    `
  } else {
    return css`
      gap: 10px;
      padding: 10px;
    `
  }
}
