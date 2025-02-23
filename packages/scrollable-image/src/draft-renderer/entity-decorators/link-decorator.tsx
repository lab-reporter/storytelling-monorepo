import React from 'react'
import styled from '../../styled-components'
import { ContentBlock, ContentState } from 'draft-js'

const LinkWrapper = styled.a`
  &:link,
  &:visited,
  &:active {
    color: ${({ theme }) => (theme.darkMode ? '#F0D5BE' : '#9f7544')};
    text-decoration: none;
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
    <LinkWrapper href={url} target="_blank" className="draft-link">
      {props.children}
    </LinkWrapper>
  )
}
