import React from 'react'
import { PhotoGallery } from './photo-gallery'
import type {
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
  fitModes,
  variant,
  grid,
  isVertical,
}: // className,
{
  photoUrls: string[]
  shape: ShapeType
  hasPadding?: boolean
  focusPositions: FocusPositionType[]
  fitModes: FitModeType[]
  variant?: VariantType
  grid?: GridType
  isVertical?: boolean
  // className?: string
}) {
  return (
    <PhotoGallery
      photoUrls={photoUrls}
      fitModes={fitModes}
      focusPositions={focusPositions}
      config={{
        photoCount: photoUrls.length,
        shape: shape,
        hasPadding: hasPadding,
        variant: variant,
        grid: grid,
        isVertical: isVertical,
      }}
    />
  )
}

export { PuzzlePhotoInfra }
