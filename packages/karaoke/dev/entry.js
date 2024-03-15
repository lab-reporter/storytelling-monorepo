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

const TextContentBlock = styled.p`
  margin-left: auto;
  margin-right: auto;

  width: 580px;

  @media (min-width: 1024px) and (max-width: 1440px) {
    width: 480px;
  }

  color: rgb(64, 64, 64);
  font-size: 18px;
  font-weight: 400;
  line-height: 2.11;
  letter-spacing: 0.6px;
  white-space: pre-wrap;
`

root.render(
  <div>
    <TwreporterKaraoke hintOnly={true} />
    <MockContentBlock />
    <TextContentBlock>
      野聲另一名研究員，同樣研究台灣黑熊超過10年的蔡幸蒨，近年在台灣黑熊救傷案例最多的花蓮卓溪鄉架設了自動相機，3年內拍下23隻不同黑熊在此活動，他們訪談了51名族人，67%有目擊黑熊經驗，不過人熊遭遇時有74%的熊會跑掉，出現威嚇動作者不到5%，都是因母熊帶小熊，而且與人距離在5公尺內。
    </TextContentBlock>
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
