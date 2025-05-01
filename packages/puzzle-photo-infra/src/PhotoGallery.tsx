import React, { useEffect } from 'react'
import styled from 'styled-components'
import { FitModeType, FocusPositionType, LayoutProps } from './types'
import { PhotoGroupWrapper } from './PhotoGroupWrapper' // whatever you called it

import mediumZoom from 'medium-zoom'
import { ZoomGlobalStyle } from './ZoomGlobalStyle'

export function PhotoGallery({
  photoUrls,
  fitModes,
  focusPositions,
  config,
}: {
  photoUrls: string[]
  fitModes: FitModeType[]
  focusPositions: FocusPositionType[]
  config: LayoutProps
}) {
  useEffect(() => {
    const zoom = mediumZoom('[data-zoomable]', {
      background: '#fff',
      margin: 24,
      scrollOffset: 30,
    })

    return () => {
      zoom.detach()
    }
  }, [photoUrls])

  return (
    <>
      <ZoomGlobalStyle />
      <Container>
        <PhotoGroupWrapper config={config}>
          {photoUrls?.map((url, i) => (
            <Img
              key={i}
              src={url}
              fitMode={fitModes?.[i] ?? 'width'} // fallback to 'width'
              focusPosition={focusPositions?.[i] ?? 'center'} // fallback to 'center'
              data-zoomable
            />
          ))}
        </PhotoGroupWrapper>
      </Container>
    </>
  )
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
  overflow: hidden; /* Prevents any unwanted scrollbars */
  box-sizing: border-box;
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
