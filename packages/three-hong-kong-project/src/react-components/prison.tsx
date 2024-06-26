import React from 'react'
import styled from '../styled-components'
import { mediaQuery } from '../utils/media-query'
import { urlPrefix } from '../constants'

const MobileOnly = styled.div`
  ${mediaQuery.tabletAbove} {
    display: none;
  }

  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
`

const MobileAbove = styled.div`
  ${mediaQuery.mobileOnly} {
    display: none;
  }
`

const Background = styled.div`
  background: transparent;
  width: 100%;
  height: 100%;
  overflow: scroll;

  ${mediaQuery.mobileOnly} {
    overflow-x: hidden;
  }
`

const Layout = styled.div`
  margin-left: auto;
  margin-right: auto;
  overflow: scroll;
  min-height: 100vh;
  display: flex;
  gap: 15px;

  ${mediaQuery.mobileOnly} {
    width: 100%;
  }

  ${mediaQuery.tabletOnly} {
    width: calc(717 / 768 * 100%);
  }

  ${mediaQuery.desktopOnly} {
    width: calc(938 / 1024 * 100%);
  }

  ${mediaQuery.hdOnly} {
    width: calc(1380 / 1440 * 100%);
  }
`

const TitleSvg = styled.img`
  width: auto;

  ${mediaQuery.mobileOnly} {
    width: fit-content;
  }

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

const Body = styled.div`
  flex-grow: 1;

  display: flex;
  flex-direction: column;

  justify-content: space-between;

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

const SubTitle = styled.div`
  padding: 7px 10px 7px 10px;
  background-color: #000;
  color: #fff;
  font-weight: 400;
  width: fit-content;

  ${mediaQuery.mobileOnly} {
    font-size: 20px;
    margin-top: 36px;
  }

  ${mediaQuery.tabletOnly} {
    margin-top: 37px;
    font-size: 16px;
  }

  ${mediaQuery.desktopOnly} {
    margin-top: 49px;
    font-size: 20px;
  }

  ${mediaQuery.hdOnly} {
    margin-top: 85px;
    font-size: 24px;
  }
`

const Text = styled.div`
  color: #000;
  font-weight: 400;
  line-height: 1.5;

  ${mediaQuery.mobileOnly} {
    width: calc(346 / 390 * 100%);
    margin-top: 213px;
    font-size: 14px;
    line-height: 21px;
    text-align: justify;
  }

  ${mediaQuery.tabletOnly} {
    max-width: 197px;
    width: calc(197 / 523 * 100%);
    font-size: 16px;
  }

  ${mediaQuery.desktopOnly} {
    max-width: 265px;
    width: calc(265 / 844 * 100%);
    font-size: 16px;
  }

  ${mediaQuery.hdOnly} {
    max-width: 412px;
    width: calc(412 / 1139 * 100%);
    font-size: 16px;
  }
`

const Figure = styled.figure`
  margin: 0;
  position: relative;

  ${mediaQuery.mobileOnly} {
    margin-top: 10px;
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

const Img = styled.img`
  object-fit: cover;
  width: 100%;

  ${mediaQuery.mobileOnly} {
    height: 100%;
  }

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

  ${mediaQuery.mobileOnly} {
    font-size: 10px;
    bottom: 5px;
    left: 5px;
    padding: 3px 5px;
    background-color: #000;
    color: #fff;
    width: fit-content;
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

type Props = { className?: string }

const FontLayout: React.FC<Props> = ({ className }) => {
  return (
    <Background className={className}>
      <MobileOnly>
        <SubTitle>囚犯製作的手工路牌字</SubTitle>
        <TitleSvg src={`${urlPrefix}/prison/title-mobile.svg`} />
        <Text>
          <p>
            1970～1997年間香港路牌由監獄裡的在囚人士製作。路牌上的字，有的是使用金屬字膜噴漆在鋼板上而成，有的則是由囚犯拿美工刀切割反光貼紙製作，筆畫保留許多手工特色，如切割時不易保持直線，很容易在橫筆尾端顯得較寬。隨著道路更新，近年路牌被陸續更換為電腦字體，目前全港由囚犯製作的路牌只剩下500～600塊。
          </p>
        </Text>
        <Figure>
          <Img src={`${urlPrefix}/prison/img-1.webp`} />
          <FigCaption>
            1983年《香港年報》拍攝囚犯製作招牌的擺放現場。（圖／香港政府新聞處）
          </FigCaption>
        </Figure>
      </MobileOnly>
      <MobileAbove>
        <Layout>
          <TitleSvg src={`${urlPrefix}/prison/title.svg`} />
          <Body>
            <SubTitle>囚犯製作的手工路牌字</SubTitle>
            <div>
              <Text>
                <p>
                  1970～1997年間香港路牌由監獄裡的在囚人士製作。路牌上的字，有的是使用金屬字膜噴漆在鋼板上而成，有的則是由囚犯拿美工刀切割反光貼紙製作，筆畫保留許多手工特色，如切割時不易保持直線，很容易在橫筆尾端顯得較寬。隨著道路更新，近年路牌被陸續更換為電腦字體，目前全港由囚犯製作的路牌只剩下500～600塊。
                </p>
              </Text>
              <Figure>
                <Img src={`${urlPrefix}/prison/img-1.webp`} />
                <FigCaption>
                  1983年《香港年報》拍攝囚犯製作招牌的擺放現場。（圖／香港政府新聞處）
                </FigCaption>
              </Figure>
            </div>
          </Body>
        </Layout>
      </MobileAbove>
    </Background>
  )
}

export default FontLayout
