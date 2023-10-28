import Immutable from 'immutable'
import React from 'react'
import styled from 'styled-components'
import { DefaultDraftBlockRenderMap } from 'draft-js'
import {
  Atomic,
  Paragraph as _Paragraph,
  List,
  Heading as _Heading,
} from './article-content'

export const Paragraph = styled(_Paragraph)`
  text-align: center;
  max-width: 750px;
`

export const Heading = styled(_Heading)`
  text-align: center;
`

const _blockRenderMap = Immutable.Map({
  atomic: {
    element: 'figure',
    wrapper: <Atomic />,
  },
  'header-two': {
    element: 'h2',
    wrapper: <Heading />,
  },
  'header-three': {
    element: 'h3',
    wrapper: <Heading />,
  },
  'header-four': {
    element: 'h4',
    wrapper: <Heading />,
  },
  'header-five': {
    element: 'h5',
    wrapper: <Heading />,
  },
  'ordered-list-item': {
    element: 'li',
    wrapper: <List />,
  },
  'unordered-list-item': {
    element: 'li',
    wrapper: <List as="ul" />,
  },
  unstyled: {
    element: 'div',
    wrapper: <Paragraph />,
  },
})

export const blockRenderMap = DefaultDraftBlockRenderMap.merge(_blockRenderMap)
