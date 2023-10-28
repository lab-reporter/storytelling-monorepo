import React, { useState } from 'react'
import styled from 'styled-components'
import {
  ContentBlock,
  ContentState,
  Editor,
  EditorState,
  convertFromRaw,
} from 'draft-js'
import blockRenderMaps from '../block-render-maps/index'
import { decorator } from '../entity-decorators/index'

const AnnotationWrapper = styled.span`
  display: inline-block;
  cursor: pointer;
  color: #27b5f7;
`

const AnnotationBody = styled.div`
  color: #494949;
  margin-bottom: 10px;
  border-top: 2px solid #27b5f7;
  background-color: #fff;
  padding: 25px 25px;
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
    background-color: #27b5f7;
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
    background-color: #27b5f7;
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
            blockRenderMap={blockRenderMaps.annotation}
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
