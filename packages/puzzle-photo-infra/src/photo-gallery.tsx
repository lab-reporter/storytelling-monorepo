import React, { useEffect } from 'react'
import styled from 'styled-components'
import type { FitModeType, FocusPositionType, LayoutProps } from './types'
import { PhotoGroup } from './photo-group'
import { PhotoLayout } from './photo-layout'

import mediumZoom from 'medium-zoom'
import { ZoomGlobalStyle } from './zoom-global-style'

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
        <PhotoGroup {...config}>
          {photoUrls?.map((url, i) => (
            <PhotoLayout key={i} {...config} index={i}>
              <Img
                key={i}
                src={url}
                fitMode={fitModes?.[i] ?? 'width'}
                focusPosition={focusPositions?.[i] ?? 'center'}
                data-zoomable
              />
            </PhotoLayout>
          ))}
        </PhotoGroup>
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
          width: 100%;
          height: auto;
          max-height: 100%;
        `
      : `
          height: 100%;
          width: auto;
          max-width: 100%;
        `}

  object-fit: cover;
  object-position: ${({ focusPosition }) => focusPosition};
  box-sizing: border-box;
  overflow: hidden;
`
