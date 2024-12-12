import React from 'react'
import styled from '../styled-components'
import { LinkNode } from '@lexical/link'
import { ContentEditable as _ContentEditable } from '@lexical/react/LexicalContentEditable'
import { LexicalComposer } from '@lexical/react/LexicalComposer'
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary'
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin'
import { theme } from './theme'

const ContentEditable = styled(_ContentEditable)<{
  theme: { darkMode: boolean }
}>`
  height: 100%;
  color: #000;
  line-height: 20px;
  font-weight: 400;
  text-align: left;
  background-color: rgba(255, 255, 255, 0.3);
  font-size: 15px;
  padding: 15px 10px;

  .editor-paragraph {
    margin: 0;
    margin-bottom: 8px;
    position: relative;
  }

  .editor-paragraph:last-child {
    margin-bottom: 0;
  }

  .editor-text-bold {
    font-weight: bold;
  }

  .editor-text-italic {
    font-style: italic;
  }

  .editor-text-underline {
    text-decoration: underline;
  }

  .editor-link {
    &:link,
    &:visited,
    &:active {
      color: ${({ theme }) => (theme.darkMode ? '#F0D5BE' : '#9f7544')};
      text-decoration: none;
    }
  }
`
const placeholder = '請輸入文字...'

export function LexicalTextRenderer({
  editorStateJSONString,
}: {
  editorStateJSONString: string
}) {
  return (
    <LexicalComposer
      initialConfig={{
        namespace: 'Scrollable Image Text Renderer',
        onError: (error: Error) => {
          console.error(error)
        },
        theme,
        editable: false,
        nodes: [LinkNode],
        editorState: editorStateJSONString,
      }}
    >
      <RichTextPlugin
        contentEditable={
          <ContentEditable
            aria-placeholder={placeholder}
            placeholder={<span>{placeholder}</span>}
          />
        }
        ErrorBoundary={LexicalErrorBoundary}
      />
    </LexicalComposer>
  )
}
