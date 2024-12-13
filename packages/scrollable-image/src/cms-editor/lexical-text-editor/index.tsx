import React, { useEffect, useRef, useState } from 'react'
import styled from '../../styled-components'
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin'
import { ContentEditable as _ContentEditable } from '@lexical/react/LexicalContentEditable'
import { EditorRefPlugin } from '@lexical/react/LexicalEditorRefPlugin'
import { FloatingLinkEditorPlugin } from './plugins/floating-link-editor-plugin/index'
import { FloatingTextFormatToolbarPlugin } from './plugins/floating-text-format-tool-bar-plugin/index'
import { LexicalComposer } from '@lexical/react/LexicalComposer'
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary'
import { LinkPlugin } from './plugins/link-plugin/index'
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin'
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin'
import { LexicalEditor } from 'lexical'
import { lexicalNodes } from './nodes/index'
import { theme } from './theme'

const placeholder = '請輸入文字...'

const EditorContainer = styled.div`
  height: 100%;
`

const ContentEditable = styled(_ContentEditable)`
  color: #000;
  line-height: 20px;
  font-weight: 400;
  text-align: left;
  background-color: rgba(255, 255, 255, 0.3);
  height: 100%;
  min-height: 150px;
  resize: none;
  font-size: 15px;
  position: relative;
  tab-size: 1;
  outline: 0;
  padding: 15px 10px;
  caret-color: #444;

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
    color: rgb(33, 111, 219);
    text-decoration: none;
  }
`

const EditorPlaceholder = styled.div`
  color: #000;
  overflow: hidden;
  position: absolute;
  text-overflow: ellipsis;
  top: 15px;
  left: 10px;
  font-size: 15px;
  user-select: none;
  display: inline-block;
  pointer-events: none;
`

export const emptyEditorStateJSONString =
  '{"root":{"children":[{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1}],"direction":null,"format":"","indent":0,"type":"root","version":1}}'

export function LexicalTextEditor({
  readOnly = false,
  editorStateJSONString = emptyEditorStateJSONString,
  onChange,
}: {
  readOnly?: boolean
  editorStateJSONString: string
  onChange: (lexicalEditorStateJSONString: string) => void
}) {
  const [floatingAnchorElem, setFloatingAnchorElem] = useState<HTMLDivElement>()
  const [isLinkEditMode, setIsLinkEditMode] = useState<boolean>(false)
  const editorRef = useRef<LexicalEditor | null>(null)
  const onRef = (_floatingAnchorElem: HTMLDivElement) => {
    if (_floatingAnchorElem !== null) {
      setFloatingAnchorElem(_floatingAnchorElem)
    }
  }

  useEffect(() => {
    const editor = editorRef.current
    if (editor) {
      editor.setEditable(!readOnly)
      editor.registerEditableListener((editable) => {
        if (editable) {
          // The use of `setTimeout` is a workaround to ensure `editor.focus()` works correctly.
          // When `editor.setEditable(true)` is called, Lexical re-renders the `ContentEditable` component
          // and updates the DOM element's `contentEditable` attribute to `true`.
          // Since this process is asynchronous, calling `editor.focus()` too early may fail because
          // the DOM element might still have `contentEditable=false`.
          // Wrapping `editor.focus()` in a `setTimeout` ensures that the `contentEditable` attribute
          // has been updated to `true` before attempting to set focus on the editor.
          setTimeout(() => {
            editor.focus()
          }, 0)
        }
      })
    }
  }, [editorRef, readOnly])

  return (
    <LexicalComposer
      initialConfig={{
        namespace: 'Scrollable Image Text Editor',
        onError: (error: Error) => {
          throw error
        },
        theme,
        editable: false,
        nodes: [...lexicalNodes],
        editorState: editorStateJSONString,
      }}
    >
      <EditorRefPlugin editorRef={editorRef} />
      <RichTextPlugin
        contentEditable={
          <EditorContainer ref={onRef} className="lexical-editor">
            <ContentEditable
              aria-placeholder={placeholder}
              placeholder={<EditorPlaceholder>{placeholder}</EditorPlaceholder>}
            />
          </EditorContainer>
        }
        ErrorBoundary={LexicalErrorBoundary}
      />
      <AutoFocusPlugin />
      <OnChangePlugin
        ignoreSelectionChange={true}
        onChange={(editorState) => {
          onChange(JSON.stringify(editorState.toJSON()))
        }}
      />
      <LinkPlugin hasLinkAttributes={false} />
      <FloatingLinkEditorPlugin
        anchorElem={floatingAnchorElem}
        isLinkEditMode={isLinkEditMode}
        setIsLinkEditMode={setIsLinkEditMode}
      />
      <FloatingTextFormatToolbarPlugin
        anchorElem={floatingAnchorElem}
        setIsLinkEditMode={setIsLinkEditMode}
      />
    </LexicalComposer>
  )
}
