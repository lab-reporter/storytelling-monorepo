import React from 'react'
import styled from 'styled-components'
import { ContentBlock, ContentState } from 'draft-js'

const LinkWrapper = styled.a`
  &:link,
  &:visited,
  &:active {
    color: #9f7544;
    text-decoration: none;
    border-bottom: 1px solid #d8d8d8;
  }
  &:hover {
    border-color: #9f7544;
  }
`

function findLinkEntities(
  contentBlock: ContentBlock,
  callback: (start: number, end: number) => void,
  contentState: ContentState
) {
  contentBlock.findEntityRanges((character) => {
    const entityKey = character.getEntity()
    return (
      entityKey !== null &&
      contentState.getEntity(entityKey).getType() === 'LINK'
    )
  }, callback)
}

export const linkDecorator = {
  strategy: findLinkEntities,
  component: Link,
}

function Link(props: {
  contentState: ContentState
  entityKey: string
  children: React.ReactNode
}) {
  const { url } = props.contentState.getEntity(props.entityKey).getData()
  return (
    <LinkWrapper href={url} target="_blank">
      {props.children}
    </LinkWrapper>
  )
}
