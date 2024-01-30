import React, { useState } from 'react' // eslint-disable-line
import styled from 'styled-components'
import { CaptionEditor } from '../src/editor/index'
import { ScrollableVideo } from '../src/v2/index'
import { createRoot } from 'react-dom/client'

const reactRootId = 'root'
const container = document.getElementById(reactRootId)
const root = createRoot(container)

const Block = styled.div`
  width: 100%;
  margin-left: auto;
  margin-right: auto;
`

function Demo() {
  const [captions, setCaptions] = useState([])
  const [duration, setDuration] = useState(0)

  return (
    <>
      <CaptionEditor
        videoObj={{
          src: './static/2020091916-tnrail-01-1440.mp4',
          type: 'video/mp4',
        }}
        onChange={({ duration, captions }) => {
          if (captions) {
            setCaptions(captions)
          }
          if (duration) {
            setDuration(duration)
          }
        }}
      />
      {captions.length > 0 ? (
        <>
          <div style={{ marginBottom: '50vh' }}></div>
          <ScrollableVideo
            captions={captions}
            video={{
              duration,
              src: './static/2020091916-tnrail-01-1440.mp4',
              type: 'video/mp4',
              preload: true,
            }}
          />
        </>
      ) : null}
    </>
  )
}

root.render(
  <Block>
    <Demo />
  </Block>
)
