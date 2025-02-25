import Immutable from 'immutable'
import React from 'react'
import styled from '../../styled-components'
import { DefaultDraftBlockRenderMap } from 'draft-js'
import { mediaQuery } from '../../utils/media-query'

const textAlignCss = `
  .text-align-center {
    text-align: center;
  }

  .text-align-right {
    text-align: right;
  }
`

export const Blockquote = styled.div`
  width: 100%;
  padding: 0 16px;
  margin-bottom: 16px;

  &:last-child {
    margin-bottom: 0px;
  }

  font-size: 16px;
  line-height: 1.75;
  color: ${({ theme }) => (theme.darkMode ? '#e2e2e2' : '#808080')};

  /* clear default margin */
  blockquote {
    margin: 0;
  }
`

export const Paragraph = styled.div`
  width: 100%;
  margin-bottom: 16px;
  &:last-child {
    margin-bottom: 0px;
  }

  font-size: ${({ theme }) => theme.paragraphFontSize || '16px'};
  font-weight: 400;
  line-height: 1.75;
  letter-spacing: 0.6px;
  color: ${({ theme }) => (theme.darkMode ? '#fff' : '#404040')};

  > div[data-block='true']:not(:last-child) {
    margin-bottom: 16px;
  }

  ${textAlignCss}
`

export const Heading = styled.div`
  width: 100%;
  margin-bottom: 16px;
  &:last-child {
    margin-bottom: 0px;
  }

  font-weight: 700;
  line-height: 1.25;
  color: ${({ theme }) => (theme.darkMode ? '#fff' : '#404040')};

  h2 {
    font-size: 30px;
    /* clear default styles */
    margin: 0;
  }

  h3 {
    font-size: 24px;
    /* clear default styles */
    margin: 0;
  }

  ${mediaQuery.mobileOnly} {
    h2 {
      font-size: 26px;
    }
    h3 {
      font-size: 22px;
    }
  }

  ${textAlignCss}
`

export const List = styled.ol`
  width: 100%;
  margin: 0 0 16px 0;
  &:last-child {
    margin-bottom: 0px;
  }
  padding: 0 0 0 24px;

  font-size: 16px;
  font-weight: 400;
  line-height: 1.75;
  letter-spacing: 0.6px;
  color: ${({ theme }) => (theme.darkMode ? '#fff' : '#404040')};

  > li {
    /* clear default styles */
    margin: 0;
    padding: 0;
  }
`

export const Atomic = styled.div`
  /* reset browser default styles */
  > figure {
    margin: 0;
  }

  margin-bottom: 16px;

  &:last-child {
    margin-bottom: 0px;
  }
`

const _blockRenderMap = Immutable.Map({
  atomic: {
    element: 'figure',
    wrapper: <Atomic />,
  },
  blockquote: {
    element: 'blockquote',
    wrapper: <Blockquote className="draft-blockquote" />,
  },
  'header-two': {
    element: 'h2',
    wrapper: <Heading className="draft-header-two" />,
  },
  'header-three': {
    element: 'h3',
    wrapper: <Heading className="draft-header-three" />,
  },
  'ordered-list-item': {
    element: 'li',
    wrapper: <List className="draft-ordered-list" />,
  },
  'unordered-list-item': {
    element: 'li',
    wrapper: <List className="draft-unordered-list" as="ul" />,
  },
  unstyled: {
    element: 'div',
    wrapper: <Paragraph className="draft-paragraph" />,
  },
})

export const blockRenderMap = DefaultDraftBlockRenderMap.merge(_blockRenderMap)
