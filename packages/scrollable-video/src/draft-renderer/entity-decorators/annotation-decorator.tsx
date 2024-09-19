import React, { useState } from 'react'
import styled from '../../styled-components'
import {
  ContentBlock,
  ContentState,
  Editor,
  EditorState,
  convertFromRaw,
} from 'draft-js'
import { annotationBlockRenderMap } from '../block-render-maps/index'
import { decorator } from '../entity-decorators/index'
import { EmbeddedCodeBlock } from '../block-renderers/embedded-code-block'

const AnnotationWrapper = styled.span`
  display: inline;
  cursor: pointer;
  color: ${({ theme }) => (theme.darkMode ? '#F0D5BE' : '#9F7544')};
`

const AnnotationBody = styled.div`
  border-style: solid;
  border-color: #c09662;
  border-width: 2px 0;
  background-color: ${({ theme }) =>
    theme.darkMode ? 'rgba(0, 0, 0, 0.5)' : 'rgba(255, 255, 255, 0.5)'};
  margin-bottom: 8px;
  padding: 24px 16px 24px 16px;
`

const ArrowIcon = styled.span<{ $showContent: boolean }>`
  margin-left: 2px;
  margin-right: 2px;
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
    background-color: ${({ theme }) =>
      theme.darkMode ? '#F0D5BE' : '#9F7544'};
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
    background-color: ${({ theme }) =>
      theme.darkMode ? '#F0D5BE' : '#9F7544'};
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

const AtomicBlock = (props: {
  block: ContentBlock
  contentState: ContentState
}) => {
  const entity = props.contentState.getEntity(props.block.getEntityAt(0))
  const data = entity.getData()
  const entityType = entity.getType()

  switch (entityType) {
    case 'EMBEDDEDCODE': {
      return EmbeddedCodeBlock({ data })
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
  const editorState = EditorState.createWithContent(contentState, decorator)

  const [preRawContentState, setPreRawContentState] = useState(rawContentState)

  // Pattern for monitoring props change:
  // https://react.dev/learn/you-might-not-need-an-effect#adjusting-some-state-when-a-prop-changes
  if (preRawContentState !== rawContentState) {
    setPreRawContentState(rawContentState)
    setShowContent(false)
  }

  return (
    <React.Fragment>
      <AnnotationWrapper
        className="annotation-wrapper"
        onClick={(e) => {
          e.preventDefault()
          setShowContent(!showContent)
        }}
      >
        <span className="annotation-title">{annotated}</span>
        <ArrowIcon className="arrow" $showContent={showContent} />
      </AnnotationWrapper>
      {showContent ? (
        <AnnotationBody className="annotation-body">
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

function findAnnotationEntities(
  contentBlock: ContentBlock,
  callback: (start: number, end: number) => void,
  contentState: ContentState
) {
  contentBlock.findEntityRanges((character) => {
    const entityKey = character.getEntity()
    return (
      entityKey !== null &&
      contentState.getEntity(entityKey).getType() === 'ANNOTATION'
    )
  }, callback)
}

export const annotationDecorator = {
  strategy: findAnnotationEntities,
  component: AnnotationBlock,
}
