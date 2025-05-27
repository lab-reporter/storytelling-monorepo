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
  id,
  photoUrls,
  shape,
  hasPadding,
  focusPositions,
  fitModes,
  variant,
  grid,
  isVertical,
}: {
  id: string
  photoUrls: string[]
  shape: ShapeType
  hasPadding?: boolean
  focusPositions: FocusPositionType[]
  fitModes: FitModeType[]
  variant?: VariantType
  grid?: GridType
  isVertical?: boolean
}) {
  return (
    <PhotoGallery
      id={id}
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
