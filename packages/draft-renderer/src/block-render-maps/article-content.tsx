import Immutable from 'immutable'
import React from 'react'
import styled from 'styled-components'
import { DefaultDraftBlockRenderMap } from 'draft-js'

export const Paragraph = styled.div`
  width: 100%;
  max-width: 580px;
  font-size: ${({ theme }) =>
    theme?.fontSizeLevel === 'large' ? '22px' : '18px'};
  font-weight: 400;
  color: #404040;
  letter-spacing: 0.6px;
  line-height: 2.11;
  margin: 0 auto;
  margin: 40px auto;
`

export const Heading = styled.div`
  width: 100%;
  max-width: 580px;

  margin: 60px auto 40px;

  font-weight: 700;
  line-height: 1.4;
  color: #404040;
  letter-spacing: 04px;

  h2 {
    font-size: ${({ theme }) =>
      theme?.fontSizeLevel === 'large' ? '38px' : '34px'};
  }

  h3 {
    font-size: ${({ theme }) =>
      theme?.fontSizeLevel === 'large' ? '32px' : '28px'};
  }
`

export const List = styled.ol`
  width: 100%;
  max-width: 580px;

  margin: 0 0 0 3em;
  margin-block-start: 0;
  margin-block-end: 0;
  padding: 0;

  font-size: ${({ theme }) =>
    theme?.fontSizeLevel === 'large' ? '22px' : '18px'};
  line-height: 2.11;
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
