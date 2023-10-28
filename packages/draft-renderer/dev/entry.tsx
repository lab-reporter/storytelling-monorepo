import React from 'react' // eslint-disable-line
import { DraftRenderer, ArticleIntroductionDraftRenderer } from '../src/draft-renderer'
import { ImageBlock } from '../src/block-renderers/image-block'
import { SlideshowBlock } from '../src/block-renderers/slideshow-block'
import { NewsReading } from '../src/block-renderers/news-reading'
import { createRoot } from 'react-dom/client'

const reactRootId = 'root'
const container = document.getElementById(reactRootId)
const root = createRoot(container)

const draftMockData = {
  "blocks": [
    {
      "key": "34na4",
      "data": {},
      "text": "unordered list one",
      "type": "unordered-list-item",
      "depth": 0,
      "entityRanges": [],
      "inlineStyleRanges": []
    },
    {
      "key": "5702i",
      "data": {},
      "text": "unordered list two",
      "type": "unordered-list-item",
      "depth": 0,
      "entityRanges": [],
      "inlineStyleRanges": []
    },
    {
      "key": "45vq4",
      "data": {},
      "text": " ",
      "type": "atomic",
      "depth": 0,
      "entityRanges": [
        {
          "key": 0,
          "length": 1,
          "offset": 0
        }
      ],
      "inlineStyleRanges": []
    },
    {
      "key": "702ju",
      "data": {},
      "text": "",
      "type": "unstyled",
      "depth": 0,
      "entityRanges": [],
      "inlineStyleRanges": []
    },
    {
      "key": "b6p77",
      "data": {},
      "text": " ",
      "type": "atomic",
      "depth": 0,
      "entityRanges": [
        {
          "key": 1,
          "length": 1,
          "offset": 0
        }
      ],
      "inlineStyleRanges": []
    },
    {
      "key": "f92vf",
      "data": {},
      "text": "",
      "type": "unstyled",
      "depth": 0,
      "entityRanges": [],
      "inlineStyleRanges": []
    },
    {
      "key": "fpoa1",
      "data": {},
      "text": " ",
      "type": "atomic",
      "depth": 0,
      "entityRanges": [
        {
          "key": 2,
          "length": 1,
          "offset": 0
        }
      ],
      "inlineStyleRanges": []
    },
    {
      "key": "2tc4p",
      "data": {},
      "text": "我的人生啟蒙老師，是乳牛",
      "type": "header-three",
      "depth": 0,
      "entityRanges": [],
      "inlineStyleRanges": [
        {
          "style": "BOLD",
          "length": 12,
          "offset": 0
        }
      ]
    },
    {
      "key": "9s73v",
      "data": {},
      "text": "我在高中的時候，哥哥曾帶我到台大牧場參觀，那裡的乳牛們成為了我的啟蒙導師，我從此對純真好奇活潑的動物們感到興趣。高中畢業時也和朋友們探索了台灣各個動物園，然而升學時並沒有如願考上動科系，轉而走進了同為生物資源暨農學院的農業化學系。",
      "type": "unstyled",
      "depth": 0,
      "entityRanges": [
        {
          "key": 3,
          "length": 2,
          "offset": 2
        }
      ],
      "inlineStyleRanges": []
    },
    {
      "key": "45ndv",
      "data": {},
      "text": "我在高中讀的是第二類組，所以在大學的普通生物學實驗課才第一次遇到了解剖的課程。儘管理解解剖學很重要，當下我仍感到恐懼，也很困惑自己是否應該轉系至動科系？是否該放棄對動物們的美好想像？這時我才發現我好像還沒準備好面對我明明很喜歡的這些動物們，再加上我需要較多時間適應新環境，和同儕、室友的相處上也不是很順利，在種種的壓力下，我決定給自己喘口氣的時間，並想藉由這個機會重新補足自己缺乏的部分。",
      "type": "unstyled",
      "depth": 0,
      "entityRanges": [],
      "inlineStyleRanges": []
    },
    {
      "key": "bnm65",
      "data": {},
      "text": "在準備探索學習計畫時，回想起高中三年級時曾和朋友們參與教育部主辦的「尋找感動地圖實踐計畫」，其中的探索台灣各大動物園經驗，因此決定利用探索學習期間更深入了解「展演動物產業」，進入六福村野生動物園動物管理部以及原野馬術中心實習，最後則到了台大動科系丁詩同指導教授的分子生物研究室向學長姊學習。\n",
      "type": "unstyled",
      "depth": 0,
      "entityRanges": [
        {
          "key": 4,
          "length": 12,
          "offset": 33
        }
      ],
      "inlineStyleRanges": []
    },
    {
      "key": "9u9io",
      "data": {},
      "text": "遊客看不見的動物飼育員心血",
      "type": "header-three",
      "depth": 0,
      "entityRanges": [],
      "inlineStyleRanges": []
    },
    {
      "key": "4t38g",
      "data": {},
      "text": "實習期間的工作內容以餵食、打掃為主。每種動物的習慣不同，照顧飼養方式當然也會不同，六福村的物種多樣，也就有許多細節需要記得，例如每個物種的數量以及牠們的名字、特徵、個性、人際關係還有飼料重量分配等，這些都攸關動物們的健康和安全，沒有一項可以馬虎。",
      "type": "unstyled",
      "depth": 0,
      "entityRanges": [],
      "inlineStyleRanges": []
    },
    {
      "key": "4vg4o",
      "data": {},
      "text": "",
      "type": "unstyled",
      "depth": 0,
      "entityRanges": [],
      "inlineStyleRanges": []
    },
    {
      "key": "2ren8",
      "data": {},
      "text": " ",
      "type": "atomic",
      "depth": 0,
      "entityRanges": [
        {
          "key": 5,
          "length": 1,
          "offset": 0
        }
      ],
      "inlineStyleRanges": []
    },
    {
      "key": "5v1e8",
      "data": {},
      "text": "動物園的動物有醫療需求，這時便需要協助保定或訓練，我也參與到北非髯羊、冠鶴、鴕鳥的保定以及犀牛、斑馬、迷你馬的目標訓練，讓動物自願聽從指令，便於醫療操作。",
      "type": "unstyled",
      "depth": 0,
      "entityRanges": [],
      "inlineStyleRanges": []
    },
    {
      "key": "cs4ht",
      "data": {},
      "text": "在訓練過程中可以看見每隻動物各自獨有的個性，如犀牛酷妹特別不喜歡從尾巴抽血，經常因為每個星期二的血檢生氣，這時獸醫和飼育員的默契、指令的下達、訓練用目標棒的控制都很重要，否則人獸雙方都會有受傷的可能，那是亟需技巧與經驗的專業動作。",
      "type": "unstyled",
      "depth": 0,
      "entityRanges": [],
      "inlineStyleRanges": []
    },
    {
      "key": "7jjdd",
      "data": {},
      "text": " ",
      "type": "atomic",
      "depth": 0,
      "entityRanges": [
        {
          "key": 6,
          "length": 1,
          "offset": 0
        }
      ],
      "inlineStyleRanges": []
    },
    {
      "key": "1tln4",
      "data": {},
      "text": "",
      "type": "unstyled",
      "depth": 0,
      "entityRanges": [],
      "inlineStyleRanges": []
    },
    {
      "key": "3p8r5",
      "data": {},
      "text": "",
      "type": "unstyled",
      "depth": 0,
      "entityRanges": [],
      "inlineStyleRanges": []
    },
    {
      "key": "1m0sa",
      "data": {},
      "text": " ",
      "type": "atomic",
      "depth": 0,
      "entityRanges": [
        {
          "key": 7,
          "length": 1,
          "offset": 0
        }
      ],
      "inlineStyleRanges": []
    },
    {
      "key": "pc4p",
      "data": {},
      "text": "",
      "type": "unstyled",
      "depth": 0,
      "entityRanges": [],
      "inlineStyleRanges": []
    },
    {
      "key": "fknro",
      "data": {},
      "text": " ",
      "type": "atomic",
      "depth": 0,
      "entityRanges": [
        {
          "key": 8,
          "length": 1,
          "offset": 0
        }
      ],
      "inlineStyleRanges": []
    },
    {
      "key": "ejbvj",
      "data": {},
      "text": "",
      "type": "unstyled",
      "depth": 0,
      "entityRanges": [],
      "inlineStyleRanges": []
    },
    {
      "key": "akgj0",
      "data": {},
      "text": " ",
      "type": "atomic",
      "depth": 0,
      "entityRanges": [
        {
          "key": 9,
          "length": 1,
          "offset": 0
        }
      ],
      "inlineStyleRanges": []
    },
    {
      "key": "drqpp",
      "data": {},
      "text": "",
      "type": "unstyled",
      "depth": 0,
      "entityRanges": [],
      "inlineStyleRanges": []
    },
    {
      "key": "8h55",
      "data": {},
      "text": " ",
      "type": "atomic",
      "depth": 0,
      "entityRanges": [
        {
          "key": 10,
          "length": 1,
          "offset": 0
        }
      ],
      "inlineStyleRanges": []
    },
    {
      "key": "2kfhv",
      "data": {},
      "text": "",
      "type": "unstyled",
      "depth": 0,
      "entityRanges": [],
      "inlineStyleRanges": []
    }
  ],
  "entityMap": {
    "0": {
      "data": {
        "type": "header-border",
        "rawContentState": {
          "blocks": [
            {
              "key": "b7kqt",
              "data": {},
              "text": "#3a4f66",
              "type": "unstyled",
              "depth": 0,
              "entityRanges": [],
              "inlineStyleRanges": []
            },
            {
              "key": "4jmo1",
              "data": {},
              "text": "",
              "type": "unstyled",
              "depth": 0,
              "entityRanges": [],
              "inlineStyleRanges": []
            },
            {
              "key": "a2vs3",
              "data": {},
              "text": "測試",
              "type": "unstyled",
              "depth": 0,
              "entityRanges": [],
              "inlineStyleRanges": []
            },
            {
              "key": "ef853",
              "data": {},
              "text": " ",
              "type": "atomic",
              "depth": 0,
              "entityRanges": [
                {
                  "key": 0,
                  "length": 1,
                  "offset": 0
                }
              ],
              "inlineStyleRanges": []
            },
            {
              "key": "39san",
              "data": {},
              "text": "",
              "type": "unstyled",
              "depth": 0,
              "entityRanges": [],
              "inlineStyleRanges": []
            }
          ],
          "entityMap": {
            "0": {
              "data": {
                "id": "6",
                "desc": "",
                "name": "成員 - 陳韻如",
                "resized": {
                  "tiny": "https://dev-kids-cms.twreporter.org/images/444bcf2e-e85c-4d05-af56-fb70775ad4d0.webp",
                  "large": "https://dev-kids-cms.twreporter.org/images/444bcf2e-e85c-4d05-af56-fb70775ad4d0.webp",
                  "small": "https://dev-kids-cms.twreporter.org/images/444bcf2e-e85c-4d05-af56-fb70775ad4d0.webp",
                  "medium": "https://dev-kids-cms.twreporter.org/images/444bcf2e-e85c-4d05-af56-fb70775ad4d0.webp",
                  "original": "https://dev-kids-cms.twreporter.org/images/444bcf2e-e85c-4d05-af56-fb70775ad4d0.webp",
                  "__typename": "ResizedImages"
                },
                "alignment": "left",
                "imageFile": {
                  "url": "/images/444bcf2e-e85c-4d05-af56-fb70775ad4d0.webp",
                  "width": 721,
                  "height": 720,
                  "__typename": "ImageFieldOutput"
                },
                "__typename": "Photo"
              },
              "type": "IMAGE",
              "mutability": "IMMUTABLE"
            }
          }
        }
      },
      "type": "INFOBOX",
      "mutability": "IMMUTABLE"
    },
    "1": {
      "data": {
        "id": "4",
        "desc": "",
        "name": "aa",
        "resized": {
          "tiny": "https://dev-kids-cms.twreporter.org/images/10eebf49-faa5-4c1d-9a73-14309e14f9a4.jpg",
          "large": "https://dev-kids-cms.twreporter.org/images/10eebf49-faa5-4c1d-9a73-14309e14f9a4.jpg",
          "small": "https://dev-kids-cms.twreporter.org/images/10eebf49-faa5-4c1d-9a73-14309e14f9a4.jpg",
          "medium": "https://dev-kids-cms.twreporter.org/images/10eebf49-faa5-4c1d-9a73-14309e14f9a4.jpg",
          "original": "https://dev-kids-cms.twreporter.org/images/10eebf49-faa5-4c1d-9a73-14309e14f9a4.jpg",
          "__typename": "ResizedImages"
        },
        "alignment": "paragraph-width",
        "imageFile": {
          "url": "/images/10eebf49-faa5-4c1d-9a73-14309e14f9a4.jpg",
          "width": 1024,
          "height": 576,
          "__typename": "ImageFieldOutput"
        },
        "__typename": "Photo"
      },
      "type": "IMAGE",
      "mutability": "IMMUTABLE"
    },
    "2": {
      "data": {
        "caption": "",
        "embeddedCode": "<div class=\"infogram-embed\" data-id=\"_/YlywWEzPUcKmAEsVoivI\" data-type=\"interactive\" data-title=\"張恩瑋的動物園探索學習課／少年報導者\"></div><script>!function(e,i,n,s){var t=\"InfogramEmbeds\",d=e.getElementsByTagName(\"script\")[0];if(window[t]&&window[t].initialized)window[t].process&&window[t].process();else if(!e.getElementById(n)){var o=e.createElement(\"script\");o.async=1,o.id=n,o.src=\"https://e.infogram.com/js/dist/embed-loader-min.js\",d.parentNode.insertBefore(o,d)}}(document,0,\"infogram-async\");</script>"
      },
      "type": "EMBEDDEDCODE",
      "mutability": "IMMUTABLE"
    },
    "3": {
      "data": {
        "rawContentState": {
          "blocks": [
            {
              "key": "8l16a",
              "data": {},
              "text": "dfsfsfsdf",
              "type": "unstyled",
              "depth": 0,
              "entityRanges": [],
              "inlineStyleRanges": []
            }
          ],
          "entityMap": {}
        }
      },
      "type": "ANNOTATION",
      "mutability": "MUTABLE"
    },
    "4": {
      "data": {
        "rel": "noreferrer noopener",
        "url": "https://youthtravel.tw/doc.php?puid=10&type=2",
        "href": "https://youthtravel.tw/doc.php?puid=10&type=2",
        "target": "_blank"
      },
      "type": "LINK",
      "mutability": "MUTABLE"
    },
    "5": {
      "data": {
        "id": "10",
        "desc": "本文作者張恩瑋喜愛動物，2022年參與探索學習課程，她便選擇探索「動物園」產業，推助她從農業化學系轉系到動物科學技術學系，申請上創新領域學士學位學程。",
        "name": "cow",
        "resized": {
          "tiny": "https://dev-kids-cms.twreporter.org/images/d98c9c2b-13e6-4923-8aa7-275e7362a292.jpg",
          "large": "https://dev-kids-cms.twreporter.org/images/d98c9c2b-13e6-4923-8aa7-275e7362a292.jpg",
          "small": "https://dev-kids-cms.twreporter.org/images/d98c9c2b-13e6-4923-8aa7-275e7362a292.jpg",
          "medium": "https://dev-kids-cms.twreporter.org/images/d98c9c2b-13e6-4923-8aa7-275e7362a292.jpg",
          "original": "https://dev-kids-cms.twreporter.org/images/d98c9c2b-13e6-4923-8aa7-275e7362a292.jpg",
          "__typename": "ResizedImages"
        },
        "imageFile": {
          "url": "/images/d98c9c2b-13e6-4923-8aa7-275e7362a292.jpg",
          "width": 1920,
          "height": 1080,
          "__typename": "ImageFieldOutput"
        },
        "__typename": "Photo"
      },
      "type": "image",
      "mutability": "IMMUTABLE"
    },
    "6": {
      "data": {
        "id": "4",
        "desc": "",
        "name": "aa",
        "resized": {
          "tiny": "https://dev-kids-cms.twreporter.org/images/10eebf49-faa5-4c1d-9a73-14309e14f9a4.jpg",
          "large": "https://dev-kids-cms.twreporter.org/images/10eebf49-faa5-4c1d-9a73-14309e14f9a4.jpg",
          "small": "https://dev-kids-cms.twreporter.org/images/10eebf49-faa5-4c1d-9a73-14309e14f9a4.jpg",
          "medium": "https://dev-kids-cms.twreporter.org/images/10eebf49-faa5-4c1d-9a73-14309e14f9a4.jpg",
          "original": "https://dev-kids-cms.twreporter.org/images/10eebf49-faa5-4c1d-9a73-14309e14f9a4.jpg",
          "__typename": "ResizedImages"
        },
        "imageFile": {
          "url": "/images/10eebf49-faa5-4c1d-9a73-14309e14f9a4.jpg",
          "width": 1024,
          "height": 576,
          "__typename": "ImageFieldOutput"
        },
        "__typename": "Photo"
      },
      "type": "IMAGE",
      "mutability": "IMMUTABLE"
    },
    "7": {
      "data": {
        "text": "test theme",
        "type": "quote_left"
      },
      "type": "BLOCKQUOTE",
      "mutability": "IMMUTABLE"
    },
    "8": {
      "data": {
        "type": "news-charge-station",
        "rawContentState": {
          "blocks": [
            {
              "key": "b70jf",
              "data": {},
              "text": "test",
              "type": "unstyled",
              "depth": 0,
              "entityRanges": [],
              "inlineStyleRanges": []
            }
          ],
          "entityMap": {}
        }
      },
      "type": "INFOBOX",
      "mutability": "IMMUTABLE"
    },
    "9": {
      "data": {
        "type": "header-border",
        "rawContentState": {
          "blocks": [
            {
              "key": "1bia9",
              "data": {},
              "text": "test",
              "type": "unstyled",
              "depth": 0,
              "entityRanges": [],
              "inlineStyleRanges": []
            }
          ],
          "entityMap": {}
        }
      },
      "type": "INFOBOX",
      "mutability": "IMMUTABLE"
    },
    "10": {
      "data": {
        "type": "box-border",
        "rawContentState": {
          "blocks": [
            {
              "key": "1djih",
              "data": {},
              "text": "test",
              "type": "unstyled",
              "depth": 0,
              "entityRanges": [],
              "inlineStyleRanges": []
            }
          ],
          "entityMap": {}
        }
      },
      "type": "INFOBOX",
      "mutability": "IMMUTABLE"
    }
  }
}

root.render(
  <DraftRenderer 
    themeColor="red"
    rawContentState={draftMockData}
  />
)
