import React, { useState } from 'react'
import styled from 'styled-components'
import {
  ContentBlock,
  CompositeDecorator,
  ContentState,
  Editor,
  EditorState,
  convertFromRaw,
} from 'draft-js'
import { annotationBlockRenderMap } from '../block-render-maps/index'
import { readOnlyLinkDecorator } from '../entity-decorators/read-only-link'
import { Entity } from '../constants'
import { findEntitiesByType } from './utils'
import { EmbeddedCode } from '../block-renderers/embedded-code'

const AtomicBlock = (props: {
  block: ContentBlock
  contentState: ContentState
}) => {
  const entity = props.contentState.getEntity(props.block.getEntityAt(0))
  const data = entity.getData()
  const entityType = entity.getType()

  switch (entityType) {
    case 'EMBEDDEDCODE': {
      return EmbeddedCode({ embeddedCode: data?.embeddedCode })
    }
  }
  return null
}

const blockRendererFn = (block: ContentBlock) => {
  if (block.getType() === 'atomic') {
    return {
      component: AtomicBlock,
      editable: false,
      props: {},
    }
  }

  return null
}

const AnnotationWrapper = styled.span`
  display: inline;
  cursor: pointer;
  color: #9f7544;
`

const AnnotationBody = styled.div`
  border-style: solid;
  border-color: #c09662;
  border-width: 2px 0;
  background-color: #fff;
  margin-bottom: 10px;
  padding: 25px 11px;
`

const ArrowIcon = styled.span<{ $showContent: boolean }>`
  margin-left: 3px;
  display: inline-block;
  vertical-align: middle;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  border-width: 1px;
  border-style: solid;
  position: relative;
  top: -1px;

  &::before {
    background-color: #9f7544;
    content: '';
    width: 2px;
    height: 6.5px;
    top: 5px;
    right: 5px;
    transform: ${(props) =>
      props.$showContent ? 'rotate(-45deg)' : 'rotate(45deg)'};
    display: block;
    position: absolute;
    transition: transform 200ms ease 0s;
  }

  &::after {
    background-color: #9f7544;
    content: '';
    width: 2px;
    height: 6.5px;
    top: 5px;
    left: 5px;
    transform: ${(props) =>
      props.$showContent ? 'rotate(45deg)' : 'rotate(-45deg)'};
    display: block;
    position: absolute;
    transition: transform 200ms ease 0s;
  }
`

function AnnotationBlock(props: {
  contentState: ContentState
  entityKey: string
  children: React.ReactNode
}) {
  const { children: annotated } = props
  const [showContent, setShowContent] = useState(false)
  const { rawContentState } = props.contentState
    .getEntity(props.entityKey)
    .getData()

  const contentState = convertFromRaw(rawContentState)
  const editorState = EditorState.createWithContent(
    contentState,
    new CompositeDecorator([readOnlyLinkDecorator])
  )

  return (
    <React.Fragment>
      <AnnotationWrapper
        onClick={(e) => {
          e.preventDefault()
          setShowContent(!showContent)
        }}
      >
        <span>{annotated}</span>
        <ArrowIcon $showContent={showContent} />
      </AnnotationWrapper>
      {showContent ? (
        <AnnotationBody>
          <Editor
            editorState={editorState}
            blockRenderMap={annotationBlockRenderMap}
            blockRendererFn={blockRendererFn}
            readOnly
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            onChange={() => {}}
          />
        </AnnotationBody>
      ) : null}
    </React.Fragment>
  )
}

export const readOnlyAnnotationDecorator = {
  strategy: findEntitiesByType(Entity.Annotation),
  component: AnnotationBlock,
}
