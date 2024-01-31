import Immutable from 'immutable'
import React from 'react'
import styled from '../../styled-components'
import { DefaultDraftBlockRenderMap } from 'draft-js'
import { Atomic, Paragraph, Heading, List } from './default'

const HeadingForAnnotation = styled(Heading)`
  margin-bottom: 20px;
`

const ListForAnnotation = styled(List)`
  color: #4a4a4a;

  h4 {
    font-size: 20px;
    line-height: 25px;
  }
`

const ParagraphForAnnotation = styled(Paragraph)`
  margin-bottom: 10px;
  color: #4a4a4a;
  letter-spacing: 0.5px;
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
