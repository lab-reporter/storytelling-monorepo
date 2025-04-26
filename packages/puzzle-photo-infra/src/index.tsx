// import React, { useState, useEffect, useRef } from 'react'
// import styled from 'styled-components'
import React from 'react'
import { PhotoGroup } from './Photo'
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
  photoUrls = [
    './photo-1.jpg',
    './photo-2.jpg',
    './photo-3.jpg',
    './photo-4.jpg',
  ]
  fitModes = ['width', 'height', 'width']
  focusPositions = ['left', 'center', 'right']
  return (
    <>
      <PhotoGroup
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
      <PhotoGroup
        photoUrls={photoUrls.slice(0, 1)}
        fitModes={fitModes}
        focusPositions={focusPositions}
        config={{
          photoCount: 1,
          shape: 'square',
          hasPadding: false,
        }}
      />
      <PhotoGroup
        photoUrls={photoUrls.slice(0, 1)}
        fitModes={fitModes}
        focusPositions={focusPositions}
        config={{
          photoCount: 1,
          shape: 'horizontalRectangle',
          hasPadding: false,
        }}
      />
      <PhotoGroup
        photoUrls={photoUrls.slice(0, 1)}
        fitModes={fitModes}
        focusPositions={focusPositions}
        config={{
          photoCount: 1,
          shape: 'verticalRectangle',
          hasPadding: false,
        }}
      />
      <PhotoGroup
        photoUrls={photoUrls.slice(0, 1)}
        fitModes={fitModes}
        focusPositions={focusPositions}
        config={{
          photoCount: 1,
          shape: 'square',
          hasPadding: true,
        }}
      />
      <PhotoGroup
        photoUrls={photoUrls.slice(0, 1)}
        fitModes={fitModes}
        focusPositions={focusPositions}
        config={{
          photoCount: 1,
          shape: 'horizontalRectangle',
          hasPadding: true,
        }}
      />
      <PhotoGroup
        photoUrls={photoUrls.slice(0, 1)}
        fitModes={fitModes}
        focusPositions={focusPositions}
        config={{
          photoCount: 1,
          shape: 'verticalRectangle',
          hasPadding: true,
        }}
      />
      <PhotoGroup
        photoUrls={photoUrls.slice(0, 3)}
        fitModes={fitModes}
        focusPositions={focusPositions}
        config={{
          photoCount: 3,
          shape: 'verticalRectangle',
          variant: 'grid',
          grid: 'leftBig',
        }}
      />
      {/* <PhotoGroup */}
      {/*   shape="horizontalRectangle" */}
      {/*   photoCount={1} */}
      {/*   photoUrls={photoUrls.slice(0, 1)} */}
      {/*   hasPadding={false} */}
      {/*   fitModes={fitModes} */}
      {/*   focusPositions={focusPositions} */}
      {/*   variant="line" */}
      {/* /> */}
      {/* <PhotoGroup */}
      {/*   shape="verticalRectangle" */}
      {/*   photoCount={1} */}
      {/*   photoUrls={photoUrls.slice(0, 1)} */}
      {/*   hasPadding={false} */}
      {/*   fitModes={fitModes} */}
      {/*   focusPositions={focusPositions} */}
      {/*   variant="line" */}
      {/* /> */}
      {/* <PhotoGroup */}
      {/*   shape="square" */}
      {/*   photoCount={1} */}
      {/*   photoUrls={photoUrls.slice(0, 1)} */}
      {/*   hasPadding={true} */}
      {/*   fitModes={fitModes} */}
      {/*   focusPositions={focusPositions} */}
      {/*   variant="line" */}
      {/* /> */}
      {/* <PhotoGroup */}
      {/*   shape="horizontalRectangle" */}
      {/*   photoCount={1} */}
      {/*   photoUrls={photoUrls.slice(0, 1)} */}
      {/*   hasPadding={true} */}
      {/*   fitModes={fitModes} */}
      {/*   focusPositions={focusPositions} */}
      {/*   variant="line" */}
      {/* /> */}
      {/* <PhotoGroup */}
      {/*   shape="verticalRectangle" */}
      {/*   photoCount={1} */}
      {/*   photoUrls={photoUrls.slice(0, 1)} */}
      {/*   hasPadding={true} */}
      {/*   fitModes={fitModes} */}
      {/*   focusPositions={focusPositions} */}
      {/*   variant="line" */}
      {/* /> */}
      {/* <PhotoGroup */}
      {/*   shape="square" */}
      {/*   photoCount={2} */}
      {/*   photoUrls={photoUrls.slice(0, 2)} */}
      {/*   fitModes={fitModes} */}
      {/*   focusPositions={focusPositions} */}
      {/*   isVertical={isVertical} */}
      {/*   variant="line" */}
      {/* /> */}
      {/* <PhotoGroup */}
      {/*   shape="horizontalRectangle" */}
      {/*   photoCount={2} */}
      {/*   photoUrls={photoUrls.slice(0, 2)} */}
      {/*   fitModes={fitModes} */}
      {/*   focusPositions={focusPositions} */}
      {/*   isVertical={isVertical} */}
      {/*   variant="line" */}
      {/* /> */}
      {/* <PhotoGroup */}
      {/*   shape="verticalRectangle" */}
      {/*   photoCount={2} */}
      {/*   photoUrls={photoUrls.slice(0, 2)} */}
      {/*   fitModes={fitModes} */}
      {/*   focusPositions={focusPositions} */}
      {/*   isVertical={isVertical} */}
      {/*   variant="line" */}
      {/* /> */}
      {/* <PhotoGroup */}
      {/*   shape="square" */}
      {/*   photoCount={3} */}
      {/*   photoUrls={photoUrls.slice(0, 3)} */}
      {/*   fitModes={fitModes} */}
      {/*   focusPositions={focusPositions} */}
      {/*   isVertical={isVertical} */}
      {/*   variant="line" */}
      {/* /> */}
      {/* <PhotoGroup */}
      {/*   shape="horizontalRectangle" */}
      {/*   photoCount={3} */}
      {/*   photoUrls={photoUrls.slice(0, 3)} */}
      {/*   fitModes={fitModes} */}
      {/*   focusPositions={focusPositions} */}
      {/*   isVertical={isVertical} */}
      {/*   variant="line" */}
      {/* /> */}
      {/* <PhotoGroup */}
      {/*   shape="verticalRectangle" */}
      {/*   photoCount={3} */}
      {/*   photoUrls={photoUrls.slice(0, 3)} */}
      {/*   fitModes={fitModes} */}
      {/*   focusPositions={focusPositions} */}
      {/*   isVertical={isVertical} */}
      {/*   variant="line" */}
      {/* /> */}
      {/* <PhotoGroup */}
      {/*   shape="square" */}
      {/*   photoCount={3} */}
      {/*   photoUrls={photoUrls.slice(1, 4)} */}
      {/*   fitModes={fitModes} */}
      {/*   focusPositions={focusPositions} */}
      {/*   isVertical={isVertical} */}
      {/*   variant="grid" */}
      {/*   grid="leftBig" */}
      {/* /> */}
      {/* <PhotoGroup */}
      {/*   shape="horizontalRectangle" */}
      {/*   photoCount={3} */}
      {/*   photoUrls={photoUrls.slice(0, 3)} */}
      {/*   fitModes={fitModes} */}
      {/*   focusPositions={focusPositions} */}
      {/*   isVertical={isVertical} */}
      {/*   variant="grid" */}
      {/*   grid="leftBig" */}
      {/* /> */}
      {/* <PhotoGroup */}
      {/*   shape="verticalRectangle" */}
      {/*   photoCount={3} */}
      {/*   photoUrls={photoUrls.slice(0, 3)} */}
      {/*   fitModes={fitModes} */}
      {/*   focusPositions={focusPositions} */}
      {/*   isVertical={isVertical} */}
      {/*   variant="grid" */}
      {/*   grid="leftBig" */}
      {/* /> */}
      {/* <PhotoGroup */}
      {/*   shape="square" */}
      {/*   photoCount={3} */}
      {/*   photoUrls={photoUrls.slice(1, 4)} */}
      {/*   fitModes={fitModes} */}
      {/*   focusPositions={focusPositions} */}
      {/*   isVertical={isVertical} */}
      {/*   variant="grid" */}
      {/*   grid="topBig" */}
      {/* /> */}
      {/* <PhotoGroup */}
      {/*   shape="horizontalRectangle" */}
      {/*   photoCount={3} */}
      {/*   photoUrls={photoUrls.slice(0, 3)} */}
      {/*   fitModes={fitModes} */}
      {/*   focusPositions={focusPositions} */}
      {/*   isVertical={isVertical} */}
      {/*   variant="grid" */}
      {/*   grid="topBig" */}
      {/* /> */}
      {/* <PhotoGroup */}
      {/*   shape="verticalRectangle" */}
      {/*   photoCount={3} */}
      {/*   photoUrls={photoUrls.slice(0, 3)} */}
      {/*   fitModes={fitModes} */}
      {/*   focusPositions={focusPositions} */}
      {/*   isVertical={isVertical} */}
      {/*   variant="grid" */}
      {/*   grid="topBig" */}
      {/* /> */}
    </>
  )
}

export { PuzzlePhotoInfra }
