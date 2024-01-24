import React from 'react'
import { blockRenderMap } from './block-render-maps/index'
import {
  Editor,
  EditorState,
  RawDraftContentState,
  convertFromRaw,
} from 'draft-js'
import { ThemeProvider } from 'styled-components'
import { atomicBlockRenderer } from './block-renderer-fn'
import { customStyleFn } from './custom-style-fn'
import { decorator } from './entity-decorators/index'

const blockRendererFn = (block: any) => {
  const atomicBlockObj = atomicBlockRenderer(block)
  return atomicBlockObj
}

type DraftRendererProps = {
  darkMode: boolean // true to enable dark mode
  rawContentState: RawDraftContentState
}

export function DraftRenderer({
  darkMode,
  rawContentState,
}: DraftRendererProps) {
  const contentState = convertFromRaw(rawContentState)
  const editorState = EditorState.createWithContent(contentState, decorator)

  return (
    <ThemeProvider
      theme={{
        darkMode,
      }}
    >
      <Editor
        editorState={editorState}
        blockRenderMap={blockRenderMap}
        blockRendererFn={blockRendererFn}
        customStyleFn={customStyleFn}
        readOnly
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        onChange={() => {}}
      />
    </ThemeProvider>
  )
}
