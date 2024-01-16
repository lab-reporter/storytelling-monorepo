// import Karaoke from '../src/react-components'
import React from 'react' // eslint-disable-line
import styled from 'styled-components'
import { createRoot } from 'react-dom/client'
import { KidsKaraoke, TwreporterKaraoke } from '../src/index'

const reactRootId = 'root'
const container = document.getElementById(reactRootId)
const root = createRoot(container)

const mocks = [
  {
    audioUrls: ['./audio-twreporter-1.mp3'],
    webVtt: `WEBVTT

00:00:00.000 --> 00:00:00.500
演員，

00:00:00.500 --> 00:00:04.000
我覺得他就是一個生活的體驗者,

00:00:04.600 --> 00:00:07.500
然後生命的實踐家;

00:00:08.000 --> 00:00:10.500
期許自己啦，可以這麼做。
`,
    quoteBy:
      '史賓塞伯爵（Charles Spencer, 9th Earl Spencer），黛安娜王妃（Diana, Princess of Wales）之弟',
    imgSrc: '',
  },
]

const MockContentBlock = styled.div`
  height: 100vh;
  background-color: pink;
  margin-bottom: 50px;
  margin-top: 50px;
`

root.render(
  <div>
    <TwreporterKaraoke hintOnly={true} />
    <MockContentBlock />
    {mocks.map((mock, index) => {
      return (
        <div key={index}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <TwreporterKaraoke
              key={index}
              muteHint={index === 0}
              audioUrls={mock.audioUrls}
              webVtt={mock.webVtt}
              imgSrc={mock.imgSrc}
              quoteBy={mock.quoteBy}
            />
          </div>
          <MockContentBlock />
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <KidsKaraoke
              key={index}
              muteHint={index === 0}
              audioUrls={mock.audioUrls}
              webVtt={mock.webVtt}
              imgSrc={mock.imgSrc}
              quoteBy={mock.quoteBy}
            />
          </div>
          <MockContentBlock />
        </div>
      )
    })}
  </div>
)
