// import Karaoke from '../src/react-components'
import React from 'react' // eslint-disable-line
import styled from 'styled-components'
import { createRoot } from 'react-dom/client'
import { KidsSubtitledAudio } from '../src/index'

const reactRootId = 'root'
const container = document.getElementById(reactRootId)
const root = createRoot(container)

const mock = {
  audioUrls: ['./audio.mp3'],
  webVtt: `WEBVTT

00:00:00.000 --> 00:00:02.500
我想和14歲的妳說

00:00:03.500 --> 00:00:12.500
妳經歷了很多事，有些是好事，有些的確不太好，也帶來某種難以言喻的創傷。

00:00:13.500 --> 00:00:19.500
有時候，妳選擇「子為父隱」，有些時候妳選擇「面對傷痛」，

00:00:20.500 --> 00:00:25.500
無論如何，妳都因此漸漸擁有了堅毅的韌性，

00:00:26.500 --> 00:00:32.500
在困難的環境中保持正向的態度，不輕易被擊倒。

00:00:33.500 --> 00:00:40.500
同時妳也慢慢學習保持某種彈性，練習看見事情的因果和價值，

00:00:41.500 --> 00:00:50.500
如同在眾多不堪之中，仍然能夠看到父母傾其所能、撐起家計的勇敢與慈愛。

00:00:51.500 --> 00:00:57.500
我沒打算抱抱妳，14歲的妳那時並不習慣這種方式，

00:00:58.500 --> 00:01:01.500
但我會握著妳的手說：

00:01:02.500 --> 00:01:06.000
辛苦了，會變好的。
`,
}

const MockContentBlock = styled.div`
  height: 100vh;
  background-color: pink;
  margin-bottom: 50px;
  margin-top: 50px;
`

const EmbedCodeBlock = styled.div`
  margin-left: auto;
  margin-right: auto;
  max-width: 700px;
`

const hintText = '本文有金句聲音元件，\n聽聽作者想和14歲的自己說什麼？'

root.render(
  <div>
    <MockContentBlock />
    <EmbedCodeBlock>
      <KidsSubtitledAudio
        audioUrls={mock.audioUrls}
        webVtt={mock.webVtt}
        hintText={hintText}
      />
    </EmbedCodeBlock>
    <MockContentBlock />
  </div>
)
