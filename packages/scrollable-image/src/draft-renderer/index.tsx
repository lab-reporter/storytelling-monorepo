import React from 'react'
import { blockRenderMap } from './block-render-maps/index'
import { blockStyleFn } from './block-style-fn'
import {
  Editor,
  EditorState,
  RawDraftContentState,
  convertFromRaw,
} from 'draft-js'
import { atomicBlockRenderer } from './block-renderer-fn'
import { customStyleFn } from './custom-style-fn'
import { decorator } from './entity-decorators/index'

const blockRendererFn = (block: any) => {
  const atomicBlockObj = atomicBlockRenderer(block)
  return atomicBlockObj
}

type DraftRendererProps = {
  rawContentState: RawDraftContentState
}

export function DraftRenderer({ rawContentState }: DraftRendererProps) {
  const emptyBlockRemoved = rawContentState.blocks.filter((b) => {
    if (b.type === 'unstyled' && b.text === '') {
      return false
    }
    return true
  })
  const contentState = convertFromRaw({
    blocks: emptyBlockRemoved,
    entityMap: rawContentState.entityMap,
  })
  const editorState = EditorState.createWithContent(contentState, decorator)

  return (
    <Editor
      editorState={editorState}
      blockRenderMap={blockRenderMap}
      blockRendererFn={blockRendererFn}
      blockStyleFn={blockStyleFn}
      customStyleFn={customStyleFn}
      readOnly
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      onChange={() => {}}
    />
  )
}
