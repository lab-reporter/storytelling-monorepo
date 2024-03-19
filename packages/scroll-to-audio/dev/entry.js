// import Karaoke from '../src/react-components'
import React from 'react' // eslint-disable-line
import styled from 'styled-components'
import { createRoot } from 'react-dom/client'
import { Hint, ScrollToAudio } from '../src/index'

const reactRootId = 'root'
const container = document.getElementById(reactRootId)
const root = createRoot(container)

const MockContentBlock = styled.div`
  height: 200vh;
  background-color: pink;
  margin-bottom: 50px;
  margin-top: 50px;
`

const EmbedCodeBlock = styled.div`
  margin-left: auto;
  margin-right: auto;
  max-width: 700px;
`

root.render(
  <div>
    <Hint id="muted-hint-id" />
    <MockContentBlock />
    <EmbedCodeBlock>
      <ScrollToAudio
        theme="twreporter"
        id="scroll-to-audio-1"
        audioUrls={['./audio-1.mp3']}
        idForHintContainer="muted-hint-id"
      />
    </EmbedCodeBlock>
    <MockContentBlock />
    <div id="scroll-to-audio-1-bottom-entry-point" />
    <ScrollToAudio
      theme="twreporter"
      id="scroll-to-audio-2"
      audioUrls={['./audio-2.mp3']}
    />
    <MockContentBlock />
    <div id="scroll-to-audio-2-bottom-entry-point" />
  </div>
)
