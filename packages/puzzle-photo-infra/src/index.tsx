// import React, { useState, useEffect, useRef } from 'react'
// import styled from 'styled-components'
import React from 'react'
import { ShapeType, FitModeType, FocusPositionType } from './types'
import { PhotoGroup } from './Photo'

/* function Sqaure() {
  return <div></div>
} */

function PuzzlePhotoInfra({
  // id = 'puzzle-photo-infra-id',
  // layout = 'A',
  // className,
  // alignment,
  focusPositions,
  fitModes,
  photoUrls,
  isVertical,
}: {
  id: string
  photoUrls: string[]
  shape: ShapeType
  isVertical?: boolean
  fitModes?: FitModeType[]
  focusPositions: FocusPositionType[]
  className?: string
}) {
  photoUrls = [
    './photo-1.jpg',
    './photo-2.jpg',
    './photo-3.jpg',
    './photo-4.jpg',
  ]
  fitModes = ['width', 'height', 'width']
  focusPositions = ['left', 'center', 'right']
  isVertical = false
  return (
    <>
      <PhotoGroup
        shape="square"
        photoCount={1}
        photoUrls={photoUrls.slice(0, 1)}
        fitModes={fitModes}
        focusPositions={focusPositions}
      />
      <PhotoGroup
        shape="horizontalRectangle"
        photoCount={1}
        photoUrls={photoUrls.slice(0, 1)}
        fitModes={fitModes}
        focusPositions={focusPositions}
      />
      <PhotoGroup
        shape="verticalRectangle"
        photoCount={1}
        photoUrls={photoUrls.slice(0, 1)}
        fitModes={fitModes}
        focusPositions={focusPositions}
      />
      <PhotoGroup
        shape="square"
        photoCount={2}
        photoUrls={photoUrls.slice(0, 2)}
        fitModes={fitModes}
        focusPositions={focusPositions}
        isVertical={isVertical}
      />
      <PhotoGroup
        shape="square"
        photoCount={3}
        photoUrls={photoUrls.slice(0, 3)}
        fitModes={fitModes}
        focusPositions={focusPositions}
        isVertical={isVertical}
      />
    </>
  )
}

export { PuzzlePhotoInfra }
