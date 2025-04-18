import React from 'react'
import styled from 'styled-components'
import { RectangleContainer } from './RectangleContainer'
import { ShapeType } from './types'

export const PhotoGroup = styled(RectangleContainer)<{ hasPadding: boolean }>`
  padding: ${({ hasPadding }) => (hasPadding ? '50px' : '0px')};
  display: flex;
  justify-content: center;
  align-items: center;
`

export const PhotoLayout = styled.div<{
  shape: ShapeType
  children?: React.ReactNode
}>`
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
`
