import React from 'react'
import styled from '../styled-components'
import { mediaQuery } from '../utils/media-query'
import { imgsForEachComponent } from '../constants'
import {
  MobileOnly,
  MobileAbove,
  Background,
  TitleSvg as _TitleSvg,
  Body as _Body,
  SubTitle as _Subtitle,
  Text as _Text,
  Img as _Img,
} from './styled'

const TitleSvg = styled(_TitleSvg)`
  ${mediaQuery.tabletOnly} {
    margin-top: 37px;
    width: calc(77 / 768 * 100vw);
    height: fit-content;
  }

  ${mediaQuery.desktopOnly} {
    margin-top: 49px;
    width: calc(97 / 1024 * 100vw);
    height: fit-content;
  }

  ${mediaQuery.hdOnly} {
    margin-top: 85px;
    width: calc(136 / 1440 * 100vw);
    height: fit-content;
  }
`

const Body = styled(_Body)`
  ${mediaQuery.tabletOnly} {
    margin-bottom: 27px;
  }

  ${mediaQuery.desktopOnly} {
    margin-bottom: 31px;
  }

  ${mediaQuery.hdOnly} {
    margin-bottom: 81px;
  }
`

const SubTitle = styled(_Subtitle)`
  ${mediaQuery.tabletOnly} {
    margin-top: 37px;
  }

  ${mediaQuery.desktopOnly} {
    margin-top: 49px;
  }

  ${mediaQuery.hdOnly} {
    margin-top: 85px;
  }
`

const Text = styled(_Text)`
  ${mediaQuery.mobileOnly} {
    width: calc(346 / 390 * 100%);
  }

  ${mediaQuery.tabletOnly} {
    max-width: 197px;
    width: calc(197 / 523 * 100%);
  }

  ${mediaQuery.desktopOnly} {
    max-width: 265px;
    width: calc(265 / 844 * 100%);
  }

  ${mediaQuery.hdOnly} {
    max-width: 412px;
    width: calc(412 / 1139 * 100%);
  }
`

const Figure = styled.figure`
  margin: 0;
  position: relative;

  ${mediaQuery.mobileOnly} {
    width: calc(345 / 390 * 100%);
  }

  ${mediaQuery.tabletOnly} {
    margin-top: 15px;
  }

  ${mediaQuery.desktopOnly} {
    margin-top: 15px;
  }

  ${mediaQuery.hdOnly} {
    margin-top: 25px;
  }
`

const Img = styled(_Img)`
  ${mediaQuery.tabletOnly} {
    height: calc(191 / 603 * 100vh);
  }

  ${mediaQuery.desktopOnly} {
    height: calc(225 / 576 * 100vh);
  }

  ${mediaQuery.hdOnly} {
    height: calc(303 / 810 * 100vh);
  }
`

const FigCaption = styled.figcaption`
  font-weight: 400;
  line-height: 1.5;
  position: absolute;
  text-align: left;

  ${mediaQuery.mobileOnly} {
    font-size: 10px;
    bottom: 10px;
    left: 5px;
    padding: 3px 5px;
    background-color: #000;
    color: #fff;
    width: fit-content;
    max-width: 90%;
  }

  ${mediaQuery.tabletAbove} {
    font-size: 12px;
    bottom: 0;
  }

  ${mediaQuery.tabletOnly} {
    width: calc(77 / 768 * 100vw);
    left: calc(77 / 768 * -100vw - 10px);
  }

  ${mediaQuery.desktopOnly} {
    width: calc(97 / 1024 * 100vw);
    left: calc(97 / 1024 * -100vw - 10px);
  }

  ${mediaQuery.hdOnly} {
    width: calc(136 / 1440 * 100vw);
    left: calc(136 / 1440 * -100vw - 10px);
  }
`

const imgs = imgsForEachComponent[4]

type Props = { className?: string }

const FontLayout: React.FC<Props> = ({ className }) => {
  return (
    <Background className={className}>
      <MobileOnly>
        <SubTitle>囚犯製作的手工路牌字</SubTitle>
        <TitleSvg src={imgs[0]} />
        <Figure style={{ margin: '25px 0' }}>
          <Img src={imgs[1]} />
        </Figure>
        <Text>
          1970～1997年間香港路牌由監獄裡的在囚人士製作。路牌上的字，有的是使用金屬字膜噴漆在鋼板上而成，有的則是由囚犯拿美工刀切割反光貼紙製作，筆畫保留許多手工特色，如切割時不易保持直線，很容易在橫筆尾端顯得較寬。隨著道路更新，近年路牌被陸續更換為電腦字體，目前全港由囚犯製作的路牌只剩下500～600塊。
        </Text>
        <Figure>
          <Img src={imgs[2]} />
          <FigCaption>
            1983年《香港年報》拍攝囚犯製作招牌的擺放現場。（圖／香港政府新聞處）
          </FigCaption>
        </Figure>
      </MobileOnly>
      <MobileAbove>
        <TitleSvg src={imgs[3]} />
        <Body>
          <SubTitle>囚犯製作的手工路牌字</SubTitle>
          <div>
            <Text>
              1970～1997年間香港路牌由監獄裡的在囚人士製作。路牌上的字，有的是使用金屬字膜噴漆在鋼板上而成，有的則是由囚犯拿美工刀切割反光貼紙製作，筆畫保留許多手工特色，如切割時不易保持直線，很容易在橫筆尾端顯得較寬。隨著道路更新，近年路牌被陸續更換為電腦字體，目前全港由囚犯製作的路牌只剩下500～600塊。
            </Text>
            <Figure>
              <Img src={imgs[2]} />
              <FigCaption>
                1983年《香港年報》拍攝囚犯製作招牌的擺放現場。（圖／香港政府新聞處）
              </FigCaption>
            </Figure>
          </div>
        </Body>
      </MobileAbove>
    </Background>
  )
}

export default FontLayout
