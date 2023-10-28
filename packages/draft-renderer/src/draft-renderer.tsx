import React from 'react'
import blockRenderMaps from './block-render-maps/index'
import {
  Editor,
  EditorState,
  RawDraftContentState,
  convertFromRaw,
} from 'draft-js'
import { ThemeColorEnum } from './utils/index'
import { ThemeProvider } from 'styled-components'
import { atomicBlockRenderer } from './block-renderer-fn'
import { customStyleFn } from './custom-style-fn'
import { decorator } from './entity-decorators/index'

const blockRendererFn = (block: any) => {
  const atomicBlockObj = atomicBlockRenderer(block)
  return atomicBlockObj
}

enum FontSizeLevel {
  NORMAL = 'normal',
  LARGE = 'large',
}

type DraftRendererProps = {
  themeColor: ThemeColorEnum
  fontSizeLevel: FontSizeLevel
  rawContentState: RawDraftContentState
}

function DraftRenderer({
  rawContentState,
  themeColor = ThemeColorEnum.RED,
  fontSizeLevel = FontSizeLevel.NORMAL,
}: DraftRendererProps) {
  const contentState = convertFromRaw(rawContentState)
  const editorState = EditorState.createWithContent(contentState, decorator)

  return (
    <ThemeProvider
      theme={{
        themeColor,
        fontSizeLevel,
      }}
    >
      <Editor
        editorState={editorState}
        blockRenderMap={blockRenderMaps.content}
        blockRendererFn={blockRendererFn}
        customStyleFn={customStyleFn}
        readOnly
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        onChange={() => {}}
      />
    </ThemeProvider>
  )
}

const ArticleBodyDraftRenderer = DraftRenderer

function ArticleIntroductionDraftRenderer({
  rawContentState,
  themeColor = ThemeColorEnum.RED,
  fontSizeLevel = FontSizeLevel.NORMAL,
}: DraftRendererProps) {
  const contentState = convertFromRaw(rawContentState)
  const editorState = EditorState.createWithContent(contentState, decorator)

  return (
    <ThemeProvider
      theme={{
        themeColor,
        fontSizeLevel,
      }}
    >
      <Editor
        editorState={editorState}
        blockRenderMap={blockRenderMaps.brief}
        customStyleFn={customStyleFn}
        readOnly
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        onChange={() => {}}
      />
    </ThemeProvider>
  )
}

function ProjectContentDraftRenderer({
  rawContentState,
  themeColor = ThemeColorEnum.BLUE,
  fontSizeLevel = FontSizeLevel.NORMAL,
}: DraftRendererProps) {
  const contentState = convertFromRaw(rawContentState)
  const editorState = EditorState.createWithContent(contentState, decorator)

  return (
    <ThemeProvider
      theme={{
        themeColor,
        fontSizeLevel,
      }}
    >
      <Editor
        editorState={editorState}
        blockRenderMap={blockRenderMaps.projectContent}
        blockRendererFn={blockRendererFn}
        customStyleFn={customStyleFn}
        readOnly
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        onChange={() => {}}
      />
    </ThemeProvider>
  )
}

export {
  DraftRenderer,
  ArticleBodyDraftRenderer,
  ArticleIntroductionDraftRenderer,
  ProjectContentDraftRenderer,
}
