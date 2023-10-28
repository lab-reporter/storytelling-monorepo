import Immutable from 'immutable'
import React from 'react'
import styled, { css } from 'styled-components'
import { DefaultDraftBlockRenderMap } from 'draft-js'
import { Atomic, Paragraph, Heading, List } from './article-content'

const HeadingForInfoBox = styled(Heading)`
  margin-top: 0px;
  margin-bottom: 20px;
`

const ListForInfoBox = styled(List)`
  margin-bottom: 20px;

  color: #232323;
  li {
    font-size: ${({ theme }) =>
      theme?.fontSizeLevel === 'large' ? '20px' : '16px'};
    line-height: 1.5;
  }
`

const ParagraphForInfoBox = styled(Paragraph)`
  /* overwrite css */
  font-size: ${({ theme }) =>
    theme?.fontSizeLevel === 'large' ? '20px' : '16px'};
  font-weight: 400;
  margin-bottom: 20px;
  line-height: 1.5;
  color: #232323;
`

const _blockRenderMapForAnnotation = Immutable.Map({
  atomic: {
    element: 'div',
    wrapper: <Atomic />,
  },
  'header-four': {
    element: 'h4',
    wrapper: <HeadingForInfoBox />,
  },
  'header-five': {
    element: 'h5',
    wrapper: <HeadingForInfoBox />,
  },
  'ordered-list-item': {
    element: 'li',
    wrapper: <ListForInfoBox />,
  },
  'unordered-list-item': {
    element: 'li',
    wrapper: <ListForInfoBox as="ul" />,
  },
  unstyled: {
    element: 'div',
    wrapper: <ParagraphForInfoBox />,
  },
})

export const blockRenderMap = DefaultDraftBlockRenderMap.merge(
  _blockRenderMapForAnnotation
)

const dividerStyles = css`
  content: '';
  width: 100%;
  height: 12px;
  display: block;
  background-image: url(https://kids.twreporter.org/wp-content/themes/blocksy-child/assets/js/components/rpjr-box/box2_768.png);
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
`

const HeadingForInfoBoxWithHeaderBorder = styled(HeadingForInfoBox)`
  h4 {
    margin-top: 12px;
    margin-bottom: 12px;
  }

  &::before {
    ${dividerStyles}
  }

  &::after {
    ${dividerStyles}
  }
`

export const blockRenderMapForInfoBoxWithHeaderBorder = blockRenderMap.merge(
  Immutable.Map({
    'header-four': {
      element: 'h4',
      wrapper: <HeadingForInfoBoxWithHeaderBorder />,
    },
  })
)
