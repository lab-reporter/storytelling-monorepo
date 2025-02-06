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
    height: '100vh',
    maxHeight: '',
    minHeight: '',
    theme: 'light_mode',
    customCss: '',
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
        height={editorState.height}
        maxHeight={editorState.maxHeight}
        minHeight={editorState.minHeight}
        theme={editorState.theme}
        customCss={editorState.customCss}
        onChange={setEditorState}
      />
    </div>
  )
}

root.render(<Root />)
