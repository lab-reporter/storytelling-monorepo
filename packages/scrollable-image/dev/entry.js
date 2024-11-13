import React, { useState } from 'react' // eslint-disable-line
import { createRoot } from 'react-dom/client'
import { ScrollableImageEditor } from '../src/cms-editor/index'

const reactRootId = 'root'
const container = document.getElementById(reactRootId)
const root = createRoot(container)

const Root = () => {
  const [editorState, setEditorState] = useState({
    imgObjs: [
      { url: '/static/img-1.png' },
      { url: '/static/img-2.png' },
      { url: '/static/img-3.png' },
      { url: '/static/img-4.png' },
      { url: '/static/img-5.png' },
    ],
    captions: [],
  })

  return (
    <div
      style={{
        backgroundColor: '#f1f1f1',
        width: '800px',
        margin: '30vh auto 0 auto',
      }}
    >
      <ScrollableImageEditor
        imgObjs={editorState.imgObjs}
        captions={editorState.captions}
        onChange={(newEditorState) => {
          setEditorState(newEditorState)
        }}
      />
    </div>
  )
}

root.render(<Root />)
