import { RichTextEditor } from '../src/index'
import React, { useState } from 'react' // eslint-disable-line
import { DrawerProvider } from '@keystone-ui/modals'
import { EditorState } from 'draft-js'
import { createRoot } from 'react-dom/client'

const reactRootId = 'root'
const container = document.getElementById(reactRootId)
if (container) {
  const root = createRoot(container)
  root.render(
    <div>
      <DrawerProvider>
        <Editor />
      </DrawerProvider>
    </div>
  )
}

function Editor() {
  const [editorState, setEditorState] = useState(EditorState.createEmpty())
  return (
    <RichTextEditor
      disabledButtons={['code', 'code-block']}
      editorState={editorState}
      onChange={(editorState) => {
        setEditorState(editorState)
      }}
    />
  )
}
