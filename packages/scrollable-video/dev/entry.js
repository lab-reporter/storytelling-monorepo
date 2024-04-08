import React, { useState } from 'react' // eslint-disable-line
import styled from 'styled-components'
import { ScrollableVideoForKeystoneEditorCMS } from '../src/index'
import { createRoot } from 'react-dom/client'

const reactRootId = 'root'
const container = document.getElementById(reactRootId)
const root = createRoot(container)

const mocks = {
  darkMode: true,
  video: {
    duration: 8.03,
    src: './static/2020092015-tnrail-02-land-10M-1920.mp4',
    type: 'video/mp4',
    mobileSrc: './static/2020091916-tnrail-01-port-720.mp4',
    mobileType: 'video/mp4',
  },
  captions: [
    {
      startTime: 2,
      rawContentState: {
        blocks: [
          {
            key: 'dfb8k',
            data: {},
            text: '「愛分享」的穿山甲',
            type: 'header-three',
            depth: 0,
            entityRanges: [],
            inlineStyleRanges: [],
          },
          {
            key: 'agsqn',
            data: {},
            text: '台灣地區的穿山甲為中華穿山甲的亞種──台灣穿山甲，喜歡住在洞穴裡，依靠長長的舌頭舔食螞蟻和白蟻維生，對蟻類的氣味非常敏感，發現食物後，會用強而有力的前爪挖洞，直搗蟻窩，因此穿山甲也是大自然界中鬆土的好幫手。',
            type: 'unstyled',
            depth: 0,
            entityRanges: [
              {
                key: 0,
                length: 2,
                offset: 15,
              },
              {
                key: 1,
                length: 5,
                offset: 19,
              },
            ],
            inlineStyleRanges: [],
          },
          {
            key: 'eriqb',
            data: {},
            text: '',
            type: 'unstyled',
            depth: 0,
            entityRanges: [],
            inlineStyleRanges: [],
          },
          {
            key: '2qckl',
            data: {},
            text: ' ',
            type: 'atomic',
            depth: 0,
            entityRanges: [
              {
                key: 2,
                length: 1,
                offset: 0,
              },
            ],
            inlineStyleRanges: [],
          },
          {
            key: 'bg8mg',
            data: {},
            text: '',
            type: 'unstyled',
            depth: 0,
            entityRanges: [],
            inlineStyleRanges: [],
          },
          {
            key: 'ege6o',
            data: {},
            text: '研究穿山甲的覓食行為，能夠了解並提供穿山甲適當的食物，對穿山甲保育有非常大的幫助。根據研究，穿山甲的食物多為白蟻和螞蟻類群，其中白蟻以「台灣土白蟻」為主。至於螞蟻則有70多種，種類非常多樣，比例最高的是家蟻亞科的螞蟻，這也是野外較常見的螞蟻種類。不過，穿山甲在野外應該沒有特別吃哪個種類的螞蟻，應是哪種螞蟻多、容易找到，牠就吃什麼。',
            type: 'unstyled',
            depth: 0,
            entityRanges: [],
            inlineStyleRanges: [],
          },
          {
            key: '66tne',
            data: {},
            text: '數字數字數字數字數字，數字數字數字數字數字數字',
            type: 'ordered-list-item',
            depth: 0,
            entityRanges: [],
            inlineStyleRanges: [],
          },
          {
            key: 'a0at3',
            data: {},
            text: '數字',
            type: 'ordered-list-item',
            depth: 0,
            entityRanges: [],
            inlineStyleRanges: [],
          },
          {
            key: 'ctlqm',
            data: {},
            text: '數字',
            type: 'ordered-list-item',
            depth: 0,
            entityRanges: [],
            inlineStyleRanges: [],
          },
          {
            key: 'c0k7n',
            data: {},
            text: '數字',
            type: 'ordered-list-item',
            depth: 0,
            entityRanges: [],
            inlineStyleRanges: [],
          },
          {
            key: '505bq',
            data: {},
            text: '文字文字文字，文字文字文字，文字文字文字。',
            type: 'unstyled',
            depth: 0,
            entityRanges: [],
            inlineStyleRanges: [],
          },
          {
            key: 'e84bm',
            data: {},
            text: '列點',
            type: 'unordered-list-item',
            depth: 0,
            entityRanges: [],
            inlineStyleRanges: [],
          },
          {
            key: 'e5poc',
            data: {},
            text: '列點',
            type: 'unordered-list-item',
            depth: 0,
            entityRanges: [],
            inlineStyleRanges: [],
          },
          {
            key: '6p9hg',
            data: {},
            text: '列點',
            type: 'unordered-list-item',
            depth: 0,
            entityRanges: [],
            inlineStyleRanges: [],
          },
          {
            key: 'f995u',
            data: {},
            text: '列點',
            type: 'unordered-list-item',
            depth: 0,
            entityRanges: [],
            inlineStyleRanges: [],
          },
        ],
        entityMap: {
          0: {
            data: {
              rawContentState: {
                blocks: [
                  {
                    key: 'bro1o',
                    data: {},
                    text: '亞種是一個分類術語，通常的含義是，同屬一種的一群個體，具有某些特殊性狀，使之與其他成員相區別，並形成一個繁殖群，但仍能與種內其他成員雜交。 特有種是指僅生長或分布於某一地區之物種，稱為該地區之特有種。',
                    type: 'unstyled',
                    depth: 0,
                    entityRanges: [],
                    inlineStyleRanges: [
                      {
                        style: 'BOLD',
                        length: 51,
                        offset: 17,
                      },
                    ],
                  },
                ],
                entityMap: {},
              },
            },
            type: 'ANNOTATION',
            mutability: 'MUTABLE',
          },
          1: {
            data: {
              rel: 'noreferrer noopener',
              url: 'https://www.twreporter.org/a/pangolin-studies-local-knowledge',
              href: 'https://www.twreporter.org/a/pangolin-studies-local-knowledge',
              target: '_blank',
            },
            type: 'LINK',
            mutability: 'MUTABLE',
          },
          2: {
            data: {
              id: '1',
              desc: '測試圖說',
              name: '張瑋恩主圖',
              resized: {
                tiny: 'https://dev-kids-storage.twreporter.org/resized/45241776-d661-43e0-a946-a5566b94be39-400.webp',
                large:
                  'https://dev-kids-storage.twreporter.org/resized/45241776-d661-43e0-a946-a5566b94be39-2000.webp',
                small:
                  'https://dev-kids-storage.twreporter.org/resized/45241776-d661-43e0-a946-a5566b94be39-800.webp',
                medium:
                  'https://dev-kids-storage.twreporter.org/resized/45241776-d661-43e0-a946-a5566b94be39-1200.webp',
                original:
                  'https://dev-kids-storage.twreporter.org/images/45241776-d661-43e0-a946-a5566b94be39.jpg',
                __typename: 'ResizedImages',
              },
              alignment: 'default',
              imageFile: {
                url: '/images/45241776-d661-43e0-a946-a5566b94be39.jpg',
                width: 1920,
                height: 1080,
                __typename: 'ImageFieldOutput',
              },
              __typename: 'Photo',
              idForImageSelectorOnly: '1_1',
            },
            type: 'IMAGE',
            mutability: 'IMMUTABLE',
          },
        },
      },
      width: 'wide',
      alignment: 'center',
    },
    {
      startTime: 4.5,
      rawContentState: {
        blocks: [
          {
            key: '409na',
            data: {},
            text: '不過，穿山甲覓食有很明顯的季節性，不同季節，穿山甲會吃不同比例的白蟻與螞蟻。這是因為白蟻在地底下的族群量較多，但穿山甲要把牠們挖出來比較費力，所以在冬天至春天期間，天氣冷的時候，地面上較少有螞蟻出來活動，穿山甲轉吃地底下白蟻的頻率會增加。此外，在春天時，台灣土白蟻巢內也會產生很多準備離巢拓展的蟻王和蟻后，富含脂肪和營養，是穿山甲不能錯過的美食。而到了夏天，穿山甲則大約9成的食物都是地面上到處爬的螞蟻。',
            type: 'unstyled',
            depth: 0,
            entityRanges: [],
            inlineStyleRanges: [],
          },
          {
            key: '85h44',
            data: {},
            text: '穿山甲挖洞吃螞蟻的時候，螞蟻會四處逃竄，因此也會吸引其他野生動物到洞穴附近尋寶。不過，穿山甲不會攻擊牠們，也不會霸占食物不放，而是與其他小動物一同分享食物。穿山甲平常覓食和睡覺的洞穴，也是鼬獾、食蟹獴和白鼻心的公共旅館，提供牠們庇護的場所，連穿山甲都會利用其他穿山甲挖好的洞。',
            type: 'unstyled',
            depth: 0,
            entityRanges: [],
            inlineStyleRanges: [],
          },
        ],
        entityMap: {},
      },
      width: 'narrow',
      alignment: 'left',
    },
    {
      startTime: 7,
      rawContentState: {
        blocks: [
          {
            key: 'dts6s',
            data: {},
            text: '「穿山甲」名號怎麼來的？',
            type: 'header-three',
            depth: 0,
            entityRanges: [],
            inlineStyleRanges: [],
          },
          {
            key: '8an63',
            data: {},
            text: '穿山甲的「穿山」名號，正是由來於牠絕佳的打洞技術。根據屏東科技大學在台東縣延平鄉鸞山的研究，平均每100公頃，就有1萬個穿山甲洞穴。',
            type: 'unstyled',
            depth: 0,
            entityRanges: [],
            inlineStyleRanges: [],
          },
          {
            key: 'dao9l',
            data: {},
            text: '一般路邊看到的穿山甲洞穴，大多屬於「覓食洞」，深度僅約1到3公尺；平常睡覺的「居住洞」，穿山甲則會非常認真挖，深度可達到6公尺。穿山甲通常將居住洞設置在比較陡峭、隱密和排水良好的斜坡邊，才能確保一日好眠。',
            type: 'unstyled',
            depth: 0,
            entityRanges: [],
            inlineStyleRanges: [],
          },
          {
            key: '51afn',
            data: {},
            text: '穿山甲不只會挖洞，也會爬樹，原因同樣是為了吃。穿山甲會利用尾巴當作爬樹的輔助義肢，爬樹吃螞蟻；同時尾巴也是母穿山甲背小穿山甲外出的工具，所以一旦牠的尾巴被野狗、獸鋏、車子碾傷，很可能就失去爬樹的能力了，繁殖育幼也會受到影響，在野外競爭力急速下降。',
            type: 'unstyled',
            depth: 0,
            entityRanges: [],
            inlineStyleRanges: [],
          },
        ],
        entityMap: {},
      },
      width: 'narrow',
      alignment: 'right',
    },
  ],
}

const Block = styled.div`
  width: 100%;
  margin-left: auto;
  margin-right: auto;
`

function Demo() {
  return (
    <>
      <div style={{ marginBottom: '50vh' }}></div>
      <ScrollableVideoForKeystoneEditorCMS
        name="test"
        darkMode={mocks.darkMode}
        captions={mocks.captions}
        video={mocks.video}
        readOnly={false}
      />
      <div style={{ marginTop: '50vh' }}></div>
    </>
  )
}

root.render(
  <Block>
    <Demo />
  </Block>
)
