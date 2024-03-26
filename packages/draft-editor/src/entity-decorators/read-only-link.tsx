import React from 'react'
import styled from 'styled-components'
import { ContentState } from 'draft-js'
import { Entity } from '../constants'
import { findEntitiesByType } from './utils'

const LinkWrapper = styled.a`
  &:link,
  &:visited,
  &:active {
    color: ${({ theme }) => (theme.darkMode ? '#F0D5BE' : '#9f7544')};
    text-decoration: none;
  }
`

export const readOnlyLinkDecorator = {
  strategy: findEntitiesByType(Entity.Link),
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
