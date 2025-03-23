// import React, { useState, useEffect, useRef } from 'react'
// import styled from 'styled-components'
import React from 'react'
import { SinglePhoto } from './SinglePhoto'
// import { TwoPhotoLayout } from './TwoPhotoLayout'

/* function Sqaure() {
  return <div></div>
} */

function PuzzlePhotoInfra({
  // id = 'puzzle-photo-infra-id',
  // frame = 'square',
  // layout = 'A',
  photoUrls,
}: // className,
{
  id: string
  size: string
  layout: string
  photoUrls: string[]
  className?: string
}) {
  return (
    <>
      <SinglePhoto photoUrls={photoUrls} hasPadding={true} />
      {/* <TwoPhotoLayout photoUrls={photoUrls} /> */}
    </>
  )
}

export { PuzzlePhotoInfra }
