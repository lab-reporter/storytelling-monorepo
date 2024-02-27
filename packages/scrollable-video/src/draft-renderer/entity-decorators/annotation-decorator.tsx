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

const AnnotationWrapper = styled.span`
  display: inline-block;
  cursor: pointer;
  color: ${({ theme }) => (theme.darkMode ? '#F0D5BE' : '#9F7544')};
`

const AnnotationBody = styled.div`
  border-top: 2px solid #c09662;
  background-color: ${({ theme }) =>
    theme.darkMode ? 'rgba(0, 0, 0, 0.5)' : 'rgba(255, 255, 255, 0.5)'};
  margin-bottom: 8px;
  padding: 24px 16px 8px 16px;
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

  return (
    <React.Fragment>
      <AnnotationWrapper
        className="scrollable-video annotation-wrapper"
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
