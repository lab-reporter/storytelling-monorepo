// import React, { useState, useEffect, useRef } from 'react'
// import styled from 'styled-components'
import React from 'react'
import { PhotoGallery } from './PhotoGallery'
import {
  ShapeType,
  FitModeType,
  FocusPositionType,
  VariantType,
  GridType,
} from './types'
/* function Sqaure() {
  return <div></div>
} */

function PuzzlePhotoInfra({
  // id = 'puzzle-photo-infra-id',
  // layout = 'A',
  // className,
  // alignment,
  id,
  shape,
  hasPadding,
  focusPositions,
  fitModes,
  photoUrls,
  isVertical,
  grid,
  variant,
}: {
  id: string
  photoUrls: string[]
  shape: ShapeType
  hasPadding: boolean
  isVertical?: boolean
  fitModes?: FitModeType[]
  focusPositions: FocusPositionType[]
  className?: string
  grid?: GridType
  variant: VariantType
}) {
  // photoUrls = [
  //   './photo-1.jpg',
  //   './photo-2.jpg',
  //   './photo-3.jpg',
  //   './photo-4.jpg',
  // ]
  fitModes = ['width', 'height', 'width']
  focusPositions = ['left', 'center', 'right']
  console.log(`[react-puzzle-photo-infra][${id}]`)

  return (
    <>
      <PhotoGallery
        photoUrls={photoUrls.slice(0, 1)}
        fitModes={fitModes}
        focusPositions={focusPositions}
        config={{
          photoCount: photoUrls.length,
          shape: shape,
          hasPadding: hasPadding,
          isVertical: isVertical,
          variant: variant,
          grid: grid,
        }}
      />
      <PhotoGallery
        photoUrls={photoUrls.slice(0, 1)}
        fitModes={fitModes}
        focusPositions={focusPositions}
        config={{
          photoCount: 1,
          shape: 'square',
          hasPadding: true,
          isVertical: false,
          // variant: 'grid',
          // grid: 'mixed',
        }}
      />
    </>
  )
}

export { PuzzlePhotoInfra }
