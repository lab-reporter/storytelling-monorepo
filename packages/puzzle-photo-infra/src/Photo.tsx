import React from 'react'
import styled from 'styled-components'
// import { Controlled as ControlledZoom } from 'react-medium-image-zoom'
import Zoom from 'react-medium-image-zoom'

import 'react-medium-image-zoom/dist/styles.css'
import './zoom‑overrides.css'
import { FitModeType, FocusPositionType, LayoutProps } from './types'
import { PhotoGroupWrapper } from './PhotoGroupWrapper' // whatever you called it

export function PhotoGroup({
  photoUrls,
  alts = [],
  fitModes,
  focusPositions,
  config,
}: {
  photoUrls: string[]
  alts?: string[]
  fitModes: FitModeType[]
  focusPositions: FocusPositionType[]
  config: LayoutProps
}) {
  return (
    <Container>
      <PhotoGroupWrapper config={config}>
        {photoUrls.map((url, i) => (
          <Zoom key={i}>
            <Img
              key={i}
              src={url}
              alt={alts[i] || ''}
              fitMode={fitModes[i]}
              focusPosition={focusPositions[i]}
            />
          </Zoom>
        ))}
      </PhotoGroupWrapper>
    </Container>
  )
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
  overflow: hidden; /* Prevents any unwanted scrollbars */
  box-sizing: border-box;
  background-color: red;
  justify-content: start;
  align-items: center;
`

export const Img = styled.img<{
  fitMode: FitModeType
  focusPosition: FocusPositionType
}>`
  ${({ fitMode }) =>
    fitMode === 'width'
      ? `
          width: 100%;     /* fill the parent’s width */
          height: auto;
          max-height: 100%; /* but never overflow its height */
        `
      : `
          height: 100%;
          width: auto;
          max-width: 100%;  /* but never overflow its width */
        `}

  object-fit: cover;
  object-position: ${({ focusPosition }) => focusPosition};
  box-sizing: border-box;
  overflow: hidden;
`
