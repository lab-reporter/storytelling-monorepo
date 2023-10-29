import DualSlides from '../src/react-components/index.js'
import React from 'react' // eslint-disable-line
import styled from 'styled-components'
import { createRoot } from 'react-dom/client'

const reactRootId = 'root'
const container = document.getElementById(reactRootId)
const root = createRoot(container)

const Block = styled.div`
  margin-top: 50vh;
  margin-bottom: 50vh;
`

const mocks = {
  slides: [
    {
      content: [
        '臺灣擁有全球最高的機車密度，平均每兩個人就有一個人有機車。其中，只有 4.26% 是電動機車。',
      ],
      imgSrc: './img-01.png',
    },
    {
      content: [
        '因應臺灣淨零政策，政府宣示要在 2040 年讓新售的機車全部電動化——亦即 2040 年將不再新售燃油機車。',
      ],
      imgSrc: './img-02.png',
    },
    {
      content: ['儘管如此，2040 年，臺灣的公路上幾乎還有一半的機車是燃油車。'],
      imgSrc: './img-03.png',
    },
    {
      content: ['要讓公路上所有的機車都電動化，資料樂觀的估計是 2050 年。'],
      imgSrc: './img-04.png',
    },
    {
      content: ['但我們能順利地通往電動化的未來嗎？'],
      imgSrc: './img-05.png',
    },
    {
      content: [
        '學者以現況推算，在政府期望 100% 電動化的 2040 年，新售比僅有兩成；2050 年，普及率也只有三成。',
      ],
      imgSrc: './img-06.png',
    },
  ],
}

root.render(
  <Block>
    <DualSlides slides={mocks.slides} />
  </Block>
)
