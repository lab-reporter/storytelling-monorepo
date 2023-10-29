import Karaoke from '../src/react-components'
import React from 'react' // eslint-disable-line
import styled from 'styled-components'
import { createRoot } from 'react-dom/client'

const reactRootId = 'root'
const container = document.getElementById(reactRootId)
const root = createRoot(container)

const mocks = [
  {
    audioUrls: ['./audio-twreporter-1.mp3'],
    textArr: [
      '演員，我覺得他就是一個生活的體驗者，',
      '然後生命的實踐家；',
      '期許自己啦，可以這麼做。',
    ],
    imgSrc: '',
  },
  {
    audioUrls: ['./audio-twreporter-2.mp3'],
    textArr: [
      '不可能讓海關知道我是去捐卵的，',
      '這個是不行的，這也是仲介覺得不可以提的，',
      '因為這個是不符合那個簽證嘛。',
      '所以我就是當做去旅遊，的確也真的蠻像在旅遊的。',
    ],
    imgSrc: '',
  },
  {
    audioUrls: ['./audio-twreporter-3.mp3'],
    textArr: [
      '我們不像香港，',
      '這幾10年，我們完全沒有接受過社會運動的教育，',
      '不知道怎麼走上街，怎麼整理我們的訴求，也完全沒有人會組織。',
      '站在現場的很多都是平凡人，不敢跟著喊激進的口號，',
      '會怕，不敢喊習近平，但只要有人喊了習近平，就會有很多人跟著喊下台。',
      '人群中，也有很多完全不知道發生了什麼、不相信警察會如此暴力的路人。',
      '在我說話的現在，每一個有可能發生抗議的位置，',
      '都部署了超級多的警察，還會隨機查路人的手機，',
      '所以我更不相信這些抗爭能帶來實際的結果，但是走出第一步是每個人都要做的事情。',
    ],
    imgSrc: '',
  },
]

const MockContentBlock = styled.div`
  height: 100vh;
  background-color: pink;
`

root.render(
  <div>
    <MockContentBlock />
    {mocks.map((mock, index) => {
      return (
        <Karaoke
          key={index}
          muteHint={index === 0}
          audioUrls={mock.audioUrls}
          textArr={mock.textArr}
          imgSrc={mock.imgSrc}
        />
      )
    })}
  </div>
)
