import Immutable from 'immutable'
import React from 'react'
import styled from '../../styled-components'
import { DefaultDraftBlockRenderMap } from 'draft-js'

export const Blockquote = styled.blockquote`
  width: 100%;
  padding: 0 16px;
  margin-bottom: 16px;

  font-size: 16px;
  line-height: 1.75;
  color: #808080;
`

export const Paragraph = styled.div`
  width: 100%;
  margin-bottom: 16px;

  font-size: 16px;
  font-weight: 400;
  line-height: 1.75;
  color: #404040;
  letter-spacing: 0.6px;
`

export const Heading = styled.div`
  width: 100%;
  margin-bottom: 16px;

  font-weight: 700;
  color: #404040;
  letter-spacing: 0.4px;
  line-height: 1.25;

  h2 {
    font-size: 30px;
  }

  h3 {
    font-size: 24px;
  }
`

export const List = styled.ol`
  width: 100%;
  margin: 0 0 16px 3em;
  margin-block-start: 0;
  margin-block-end: 0;
  padding: 0;

  font-size: 16px;
  font-weight: 400;
  line-height: 1.75;
  letter-spacing: 0.6px;
  color: #404040;

  > li {
    margin: 0 0 1em 0;
    padding: 0;
    &:last-child {
      margin-bottom: 0;
    }
  }
`

export const Atomic = styled.div`
  /* reset browser default styles */
  > figure {
    margin: 0;
  }

  margin-bottom: 16px;
`

const _blockRenderMap = Immutable.Map({
  atomic: {
    element: 'figure',
    wrapper: <Atomic />,
  },
  blockquote: {
    element: 'blockquote',
    wrapper: <Blockquote />,
  },
  'header-two': {
    element: 'h2',
    wrapper: <Heading />,
  },
  'header-three': {
    element: 'h3',
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
