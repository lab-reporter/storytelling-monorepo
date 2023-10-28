import DraftEditor from '../src/draft-editor'
import React, { useState } from 'react' // eslint-disable-line
import { DrawerProvider } from '@keystone-ui/modals'
import { EditorState } from 'draft-js'
import { createRoot } from 'react-dom/client'

const reactRootId = 'root'
const container = document.getElementById(reactRootId)
const root = createRoot(container)

function Editor() {
  const [editorState, setEditorState] = useState(EditorState.createEmpty(DraftEditor.decorator))
  return (
    <DraftEditor.RichTextEditor 
      disabledButtons={['code', 'code-block']}
      editorState={editorState}
      onChange={(editorState)=> {setEditorState(editorState)}}
    />
  )
}

root.render(
  <div>
    <DrawerProvider>
      <Editor />
    </DrawerProvider>
  </div>
)
