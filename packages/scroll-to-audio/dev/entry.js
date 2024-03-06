// import Karaoke from '../src/react-components'
import React from 'react' // eslint-disable-line
import styled from 'styled-components'
import { createRoot } from 'react-dom/client'
import { ScrollToAudio } from '../src/index'

const reactRootId = 'root'
const container = document.getElementById(reactRootId)
const root = createRoot(container)

const mock = {
  audioUrls: ['./audio.mp3'],
}

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
    <ScrollToAudio hintOnly />
    <MockContentBlock />
    <EmbedCodeBlock>
      <ScrollToAudio
        audioUrls={mock.audioUrls}
        idForMuteButton="scroll-to-audio-mute-button"
      />
    </EmbedCodeBlock>
    <MockContentBlock />
    <div id="scroll-to-audio-id-bottom-entry-point" />
    <MockContentBlock />
  </div>
)
