import Immutable from 'immutable'
import React from 'react'
import styled from 'styled-components'
import { DefaultDraftBlockRenderMap } from 'draft-js'
import { Atomic, Paragraph, Heading, List } from './article-content'

const HeadingForAnnotation = styled(Heading)`
  margin: 0 auto 27px auto;
`

const ListForAnnotation = styled(List)`
  color: #494949;

  li {
    font-size: ${({ theme }) =>
      theme?.fontSizeLevel === 'large' ? '20px' : '16px'};
  }
`

const ParagraphForAnnotation = styled(Paragraph)`
  /* overwrite css */
  font-size: ${({ theme }) =>
    theme?.fontSizeLevel === 'large' ? '20px' : '16px'};
  font-weight: 400;
  margin-bottom: 20px;
  color: #494949;
`

const _blockRenderMapForAnnotation = Immutable.Map({
  atomic: {
    element: 'figure',
    wrapper: <Atomic />,
  },
  'header-four': {
    element: 'h4',
    wrapper: <HeadingForAnnotation />,
  },
  'header-five': {
    element: 'h5',
    wrapper: <HeadingForAnnotation />,
  },
  'ordered-list-item': {
    element: 'li',
    wrapper: <ListForAnnotation />,
  },
  'unordered-list-item': {
    element: 'li',
    wrapper: <ListForAnnotation as="ul" />,
  },
  unstyled: {
    element: 'div',
    wrapper: <ParagraphForAnnotation />,
  },
})

export const blockRenderMap = DefaultDraftBlockRenderMap.merge(
  _blockRenderMapForAnnotation
)
