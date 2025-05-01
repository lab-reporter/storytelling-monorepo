// PhotoLayout.tsx
import styled, { css } from 'styled-components'
import { LayoutProps } from './types'

import {
  square as hdSquare,
  horizRect as hdHorizRect,
  vertRect as hdVertRect,
} from './PhotoLayouts/HD'
import {
  square as desktopSquare,
  horizRect as desktopHorizRect,
  vertRect as desktopVertRect,
} from './PhotoLayouts/Desktop'
import {
  square as tabletSquarer,
  horizRect as tabletHorizRect,
  vertRect as tabletVertRect,
} from './PhotoLayouts/Tablet'
import {
  square as mobileSquarer,
  horizRect as mobileHorizRect,
  vertRect as mobileVertRect,
} from './PhotoLayouts/Mobile'

export const PhotoLayout = styled.div<LayoutProps>`
  box-sizing: border-box;
  display: flex;
  align-items: center;
  overflow: hidden;

  ${({ variant, index }) => {
    const AREA_MAP = ['a', 'b', 'c', 'd']
    if (variant === 'grid' && index != null) {
      return css`
        grid-area: ${AREA_MAP[index]};
      `
    }
  }}

  @media (min-width: 1440px) {
    ${({ shape, ...props }) => {
      if (shape === 'square')
        return css`
          ${hdSquare(props)}
        `
      if (shape === 'horizontalRectangle')
        return css`
          ${hdHorizRect(props)}
        `
      if (shape === 'verticalRectangle')
        return css`
          ${hdVertRect(props)}
        `
      return ``
    }}
  }

  @media (min-width: 1024px) and (max-width: 1439px) {
    ${({ shape, ...props }) => {
      if (shape === 'square')
        return css`
          ${desktopSquare(props)}
        `
      if (shape === 'horizontalRectangle')
        return css`
          ${desktopHorizRect(props)}
        `
      if (shape === 'verticalRectangle')
        return css`
          ${desktopVertRect(props)}
        `
      return ``
    }}
  }

  @media (min-width: 768px) and (max-width: 1023px) {
    ${({ shape, ...props }) => {
      if (shape === 'square')
        return css`
          ${tabletSquarer(props)}
        `
      if (shape === 'horizontalRectangle')
        return css`
          ${tabletHorizRect(props)}
        `
      if (shape === 'verticalRectangle')
        return css`
          ${tabletVertRect(props)}
        `
      return ``
    }}
  }

  @media (max-width: 767px) {
    ${({ shape, ...props }) => {
      if (shape === 'square')
        return css`
          ${mobileSquarer(props)}
        `
      if (shape === 'horizontalRectangle')
        return css`
          ${mobileHorizRect(props)}
        `
      if (shape === 'verticalRectangle')
        return css`
          ${mobileVertRect(props)}
        `
      return ``
    }}
  }
`
