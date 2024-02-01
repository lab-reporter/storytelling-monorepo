import Immutable from 'immutable'
import React from 'react'
import styled from '../../styled-components'
import { DefaultDraftBlockRenderMap } from 'draft-js'
import { Atomic, Paragraph, List } from './default'

const ListForAnnotation = styled(List)`
  color: ${({ theme }) => (theme.darkMode ? '#fff' : '#404040')};

  h4 {
    font-size: 20px;
    line-height: 25px;
  }
`

const ParagraphForAnnotation = styled(Paragraph)`
  color: ${({ theme }) => (theme.darkMode ? '#fff' : '#404040')};

  margin-bottom: 10px;
  letter-spacing: 0.5px;
`

const _blockRenderMapForAnnotation = Immutable.Map({
  atomic: {
    element: 'figure',
    wrapper: <Atomic />,
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
