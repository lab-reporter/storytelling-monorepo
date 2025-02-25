import React from 'react'
import styled from '../../styled-components'

const Figure = styled.figure`
  /* clear browser default styles */
  margin: 0;

  width: 100%;
`

const FigureCaption = styled.figcaption`
  font-size: 13px;
  font-weight: 400;
  line-height: 150%;
  color: ${({ theme }) => (theme.darkMode ? '#f1f1f1' : '#666')};

  /* clear browser default styles */
  margin: 8px 0 0 0;
`

const Img = styled.img`
  width: 100%;
`

type ImageLinkProps = {
  className?: string
  data: {
    desc?: string
    url: string
  }
}

export function ImageLink({ className = '', data }: ImageLinkProps) {
  const { desc, url } = data || {}

  return (
    <Figure className={className}>
      <Img alt={desc} src={url} />
      {desc && (
        <FigureCaption className="draft-image-desc">{desc}</FigureCaption>
      )}
    </Figure>
  )
}
