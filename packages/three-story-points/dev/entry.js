import ThreeStoryPoints from '../src/react-components/index.js'
import React from 'react' // eslint-disable-line
import styled from 'styled-components'
import { createRoot } from 'react-dom/client'

const reactRootId = 'root'
const container = document.getElementById(reactRootId)
const root = createRoot(container)

const mocks = {
  models: [
    {
      url: './room.glb',
      /** @type {'glb'} */
      fileFormat: 'glb',
    },
    {
      url: './room-light.glb',
      /** @type {'glb'} */
      fileFormat: 'glb',
    },
  ],
  desktopModels: [
    {
      url: './room.glb',
      /** @type {'glb'} */
      fileFormat: 'glb',
    },
    {
      url: './room-light.glb',
      /** @type {'glb'} */
      fileFormat: 'glb',
    },
  ],
  pois: [
    {
      ease: 'power1',
      duration: 1,
      position: [-0.6069259974140557, 0.7007812499999962, -0.10712593607072247],
      quaternion: [
        0.00890998234843817, 0.7569437190272953, -0.010322922344823196,
        0.6533377807183205,
      ],
    },
    {
      ease: 'power2',
      duration: 1,
      position: [-1.8231529875859978, 1.401562, -1.530415088238518],
      quaternion: [
        0.0147105650503059, 0.9830630422640749, 0.0914472876866838,
        -0.15813933029183866,
      ],
    },
    {
      ease: 'power1',
      duration: 1,
      position: [-1.9305651444750984, 1.401562, -1.3979218832224005],
      quaternion: [
        -0.002716147192830081, 0.9958095932127631, 0.08580316259725057,
        0.03152291068680002,
      ],
    },
    {
      ease: 'power1',
      duration: 1,
      position: [-2.139578058073299, 1.401562, -1.3630850930546583],
      quaternion: [
        -0.012060004619270861, 0.985475592525672, 0.14960411851922542,
        0.07944193191787671,
      ],
    },
    {
      ease: 'power1',
      duration: 1,
      position: [-2.270419179507092, 1.401562, -1.3954403701863303],
      quaternion: [
        -0.002781667814616227, 0.9950237066481395, 0.0952680829101563,
        0.029053018965160656,
      ],
    },
    {
      ease: 'power1',
      duration: 2,
      position: [-1.8121564600692635, 0.7119255612022378, -1.7487150768848265],
      quaternion: [
        -0.037904250939566564, 0.6544422595218164, 0.03323540129087259,
        0.7544295890364618,
      ],
    },
    {
      ease: 'power1',
      duration: 2,
      position: [-0.24711173240044823, 1.401562, -1.7301340276139447],
      quaternion: [
        -0.18648020200334095, 0.5151039304644484, 0.11593714921688128,
        0.8285237790868363,
      ],
    },
    {
      ease: 'power1',
      duration: 3,
      position: [-0.4050376649201123, 1.401562, 0.5636548100425266],
      quaternion: [
        0.00690005418328376, 0.9928693600295172, 0.0942001909743924,
        -0.07272652327199947,
      ],
    },
    {
      ease: 'power1',
      duration: 1,
      position: [-0.6631894510196352, 1.4015619999999998, 0.6117708568896536],
      quaternion: [
        -0.0032731749343517186, 0.9936120975081945, -0.10876671478815295,
        -0.029901300396605057,
      ],
    },
  ],
  captions: [
    '「這些是我來台灣後買的書，記錄了2019年的香港，有的在香港絕版了，有的變成禁書。我常常拿出來看。」',
    '「我本來在香港就喜歡拍照。現在看到的風景是本身不會出現在我人生中的，我就更加覺得要記錄下一些事。」',
    '「拍照要去想怎麼拍，怎麼構圖，要很投入這件事裡，某程度上是讓我不要用那麼多空間去煩惱自己的事。可以拍照時，我發現自己不再喝那麼多酒。」',
    '「我有時會拍一些跟香港的事有關的題材，例如台北的連儂牆、撐香港的活動現場，但我也會拍其他，有個休息的空間給自己。」',
    '「我很喜歡拍太陽。雖然太陽看起來好像都一樣，但每次拍的時候其實都不一樣，要視乎天有沒有雲，地下的積水怎麼分佈，那日是漲潮退潮，沙灘有沒有人。就算同一個地方去很多次，次次都不同。」',
    '「一來到台灣我就有吃藥，但開始吃的東西更 mild，比如 B 群，但沒什麼用，不會幫你立刻睡到覺。我知道一定要藉助其他東西才會睡得著。」',
    '「開頭我吃褪黑激素，有的人吃 3mg 就可以睡得很深，但我吃 5mg 都沒感覺，我就吃 10mg，睡得著，但醒來好像沒睡過一樣。而且會做噩夢。」',
    '「或許我們的日常生活與大家無異，但就是有那麼一點點的不一樣。希望我們終有一天 可以跟大家一樣。」',
    '「謝謝你來我的房間，這是我想留給你的話...」',
  ],
  audios: [
    {
      urls: [
        'https://editools-dev.readr.tw/files/the-maiden-s-prayer-tempo-1-n9Mhufcmyivb4aCEXjaL.MP3',
      ],
      /** @type {'auto'|'none'|'metadata'} */
      preload: 'auto',
    },
    {
      urls: [
        'https://editools-dev.readr.tw/files/audio-example-2-gNAB2G2WizFxdJLsPEj.mp3',
      ],
      /** @type {'auto'|'none'|'metadata'} */
      preload: 'auto',
    },
  ],
}

const ShiftRightBlock = styled.div`
  margin-top: 50vh;
  padding-left: 50px;
  margin-bottom: 50vh;
`

root.render(
  <ShiftRightBlock>
    <ThreeStoryPoints
      audios={mocks.audios}
      models={mocks.models}
      desktopModels={mocks.desktopModels}
      pois={mocks.pois}
      captions={mocks.captions}
      debugMode
    />
  </ShiftRightBlock>
)
