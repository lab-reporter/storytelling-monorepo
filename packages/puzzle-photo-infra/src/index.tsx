import React from 'react'
import { PhotoGallery } from './PhotoGallery'
import {
  ShapeType,
  FitModeType,
  FocusPositionType,
  VariantType,
  GridType,
} from './types'

function PuzzlePhotoInfra({
  photoUrls,
  shape,
  hasPadding,
  focusPositions,
  isVertical = true,
  fitModes,
  grid,
  variant = 'line',
}: // className,
{
  photoUrls: string[]
  shape: ShapeType
  hasPadding?: boolean
  focusPositions: FocusPositionType[]
  isVertical?: boolean
  fitModes: FitModeType[]
  grid?: GridType
  variant?: VariantType
  // className?: string
}) {
  return (
    <>
      <PhotoGallery
        photoUrls={photoUrls}
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
    </>
  )
}

export { PuzzlePhotoInfra }
