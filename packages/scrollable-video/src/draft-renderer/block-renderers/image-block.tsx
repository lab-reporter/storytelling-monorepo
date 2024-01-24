import React from 'react'
import styled from 'styled-components'

const Figure = styled.figure`
  /* clear browser default styles */
  margin: 0;

  width: 100%;
`

const FigureCaption = styled.figcaption`
  font-size: 14px;
  font-weight: 400;
  line-height: 21px;
  color: #666;
  color: ${({ theme }) => (theme.darkMode ? '#f1f1f1' : '#666')};

  /* clear browser default styles */
  margin: 8px 0 0 0;
`

const Img = styled.img`
  width: 100%;
`

type ImageBlockProps = {
  className?: string
  data: {
    alignment?: string
    desc?: string
    imageFile: {
      url: string
      width: number
      height: number
    }
    resized?: {
      small: string
      medium: string
      large: string
    }
  }
}

export function ImageBlock({ className = '', data }: ImageBlockProps) {
  const { desc, imageFile, resized } = data || {}

  const imgSrcSetArr = []
  if (resized?.small) {
    imgSrcSetArr.push(`${resized.small} 800w`)
  }

  if (resized?.medium) {
    imgSrcSetArr.push(`${resized.medium} 1200w`)
  }

  const imgBlock = (
    <Figure className={className}>
      <Img
        alt={desc}
        src={imageFile?.url}
        srcSet={imgSrcSetArr.join(',')}
        sizes="(min-width: 768px) 700px, 75vw"
      />
      {desc && <FigureCaption>{desc}</FigureCaption>}
    </Figure>
  )

  return imgBlock
}
