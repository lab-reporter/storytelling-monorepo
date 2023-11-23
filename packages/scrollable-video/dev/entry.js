import React, { useState } from 'react' // eslint-disable-line
import styled from 'styled-components'
import { CaptionEditor } from '../src/editor/index'
import { createRoot } from 'react-dom/client'
import ScrollableVideo from '../src/scrollable-video/index'

const reactRootId = 'root'
const container = document.getElementById(reactRootId)
const root = createRoot(container)

const Block = styled.div`
  width: 100%;
  max-width: 1000px;
  margin-left: auto;
  margin-right: auto;
`

function Root() {
  const [captions, setCaptions] = useState([])

  return (
    <>
      <CaptionEditor
        video={{
          sources: [
            {
              src: './static/2020091916-tnrail-01-1440.mp4',
              mediaType: 'video/mp4',
            },
          ],
        }}
        onChange={(editorState) => {
          setCaptions(editorState.captions)
        }}
      />
      <div style={{ marginBottom: '50vh' }}></div>
      {captions.length > 0 ? (
        <ScrollableVideo
          captions={captions}
          video={{
            sources: [
              {
                type: 'video/mp4',
                src: './static/2020091916-tnrail-01-1440.mp4',
              },
            ],
          }}
        />
      ) : null}
    </>
  )
}

root.render(
  <Block>
    <Root />
  </Block>
)
