// import React, { useState, useEffect, useRef } from 'react'
// import styled from 'styled-components'
import React from 'react'
import { SinglePhoto } from './SinglePhoto'
import { TwoPhotoLayout } from './TwoPhotoLayout'
import { ThreePhotoLayout } from './ThreePhotoLineLayout'
import { ThreePhotoGridLayout } from './ThreePhotoGrid'
import { LayoutType, AlignmentType, FitModeType } from './types'

/* function Sqaure() {
  return <div></div>
} */

function PuzzlePhotoInfra({
  // id = 'puzzle-photo-infra-id',
  // layout = 'A',
  // className,
  // alignment,
  photoUrls,
}: {
  id: string
  photoUrls: string[]
  layout: LayoutType
  isVertical?: boolean
  aligment?: AlignmentType
  fitMode?: FitModeType
  className?: string
}) {
  photoUrls = [
    './photo-1.jpg',
    './photo-2.jpg',
    './photo-3.jpg',
    './photo-4.jpg',
  ]
  return (
    <>
      <SinglePhoto photoUrls={photoUrls} layout="square" />
      {/* <SinglePhoto photoUrls={photoUrls} layout="horizontalRectangle" /> */}
      {/* <SinglePhoto photoUrls={photoUrls} layout="verticalRectangle" /> */}
      <TwoPhotoLayout photoUrls={photoUrls} layout="square" />
      {/* <TwoPhotoLayout photoUrls={photoUrls} layout="horizontalRectangle" /> */}
      {/* <TwoPhotoLayout photoUrls={photoUrls} layout="verticalRectangle" /> */}
      <ThreePhotoLayout photoUrls={photoUrls} layout="square" />
      <ThreePhotoLayout photoUrls={photoUrls} layout="horizontalRectangle" />
      <ThreePhotoLayout photoUrls={photoUrls} layout="verticalRectangle" />
      <ThreePhotoGridLayout photoUrls={photoUrls} layout="square" />
      <ThreePhotoGridLayout
        photoUrls={photoUrls}
        layout="horizontalRectangle"
      />
      <ThreePhotoGridLayout photoUrls={photoUrls} layout="verticalRectangle" />
    </>
  )
}

export { PuzzlePhotoInfra }
