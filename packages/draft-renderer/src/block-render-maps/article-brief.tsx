import Immutable from 'immutable'
import React from 'react'
import styled from 'styled-components'
import { DefaultDraftBlockRenderMap } from 'draft-js'
import { Paragraph, List } from './article-content'

const ParagraphForIntroduction = styled(Paragraph)`
  font-size: ${({ theme }) =>
    theme?.fontSizeLevel === 'large' ? '24px' : '20px'};
  color: #575757;
`

const ListForIntroduction = styled(List)`
  color: #575757;
`

export const blockRenderMap = DefaultDraftBlockRenderMap.merge(
  Immutable.Map({
    'ordered-list-item': {
      element: 'li',
      wrapper: <ListForIntroduction />,
    },
    'unordered-list-item': {
      element: 'li',
      wrapper: <ListForIntroduction as="ul" />,
    },
    unstyled: {
      element: 'div',
      wrapper: <ParagraphForIntroduction />,
    },
  })
)
