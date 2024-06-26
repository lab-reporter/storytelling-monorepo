import React from 'react'
import styled from '../styled-components'
import { mediaQuery } from '../utils/media-query'
import { urlPrefix } from '../constants'
import {
  MobileOnly,
  MobileAbove,
  Background,
  TitleSvg as _TitleSvg,
  Body as _Body,
  SubTitle as _Subtitle,
  Text as _Text,
  Img,
} from './styled'

const TitleSvg = styled(_TitleSvg)`
  ${mediaQuery.tabletOnly} {
    margin-top: 37px;
    height: 532px;
  }

  ${mediaQuery.desktopOnly} {
    margin-top: 49px;
    height: 90vh;
  }

  ${mediaQuery.hdOnly} {
    margin-top: 85px;
    height: calc(644 / 810 * 100vh);
  }
`

const Body = styled(_Body)`
  ${mediaQuery.tabletAbove} {
    margin-bottom: 30px;
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
    width: calc(197 / 523 * 100%);
    max-width: 197px;
    padding: 5px 5px;
    background-color: #ffffff2f;
  }

  ${mediaQuery.desktopOnly} {
    width: calc(288 / 822 * 100%);
    max-width: 288px;
  }

  ${mediaQuery.hdOnly} {
    width: calc(453 / 1170 * 100%);
    max-width: 453px;
  }
`

const Imgs = styled.div`
  display: flex;
  gap: 2px;

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

const Figure = styled.figure`
  background-color: #ffffff14;
  margin: 0;

  ${mediaQuery.tabletAbove} {
    &:first-child {
      aspect-ratio: 5 / 2;
      flex: 0.57;
    }
    &:nth-child(2) {
      aspect-ratio: 5 / 3;
      flex: 0.24;
    }
    &:last-child {
      aspect-ratio: 1.5 / 1;
      flex: 0.19;
    }
  }

  ${mediaQuery.tabletOnly} {
    &:not(:first-child) {
      img {
        height: 127px;
      }
    }
  }

  ${mediaQuery.desktopOnly} {
    &:not(:first-child) {
      img {
        height: 127px;
      }
    }
  }

  ${mediaQuery.hdOnly} {
    &:not(:first-child) {
      img {
        height: 181px;
      }
    }
  }
`

const FigCaption = styled.figcaption`
  font-weight: 400;
  line-height: 1.5;
  padding: 5px 10px 17px 10px;
  text-align: left;

  ${mediaQuery.mobileOnly} {
    font-size: 10px;
  }

  ${mediaQuery.tabletAbove} {
    font-size: 12px;
    margin-top: 5px;
  }
`

const MobileFigure = styled.figure`
  background-color: #ffffff14;
  width: 100%;
  margin: 0;
`

const MobileFigures = styled.div`
  width: calc(346 / 390 * 100%);

  ${MobileFigure}:first-child {
    width: 100%;
    aspect-ratio: 3.5 / 1;
  }

  ${MobileFigure}:nth-child(2) {
    aspect-ratio: 5 / 3;
    display: inline-block;
    width: 50%;
    vertical-align: top;
  }
  ${MobileFigure}:last-child {
    aspect-ratio: 5 / 3;
    display: inline-block;
    width: 50%;
  }
`

type Props = { className?: string }

const FontLayout: React.FC<Props> = ({ className }) => {
  return (
    <Background className={className}>
      <MobileOnly>
        <SubTitle>老招牌上的熱門字體</SubTitle>
        <TitleSvg src={`${urlPrefix}/blow-up-font/title-mobile.svg`} />
        <Img
          style={{ width: 'calc(345/390*100%)', margin: '25px 0' }}
          src={`${urlPrefix}/blow-up-font/mobile-font.webp`}
        />
        <Text>
          <p>
            在還沒有電腦字體的年代，請街頭書法家為招牌題字是民間的主流做法。設計師陳濬人的招牌字體研究專書《香港北魏真書》記錄著清代書法家趙之謙研究筆畫粗壯剛直的魏碑後，用筆墨演繹出北魏字，這種風格被清末書法家區建公等人承襲，帶到香港，又因應招牌的需求，將字形調整得更穩定，成為「香港北魏」。
          </p>
          <p>
            1960年代香港經濟起飛後，店家快速增加，為了讓客人遠遠就能注意到招牌，在密集住宅中仍特別顯眼的「香港北魏」就成為熱門選項。
          </p>
        </Text>
        <MobileFigures>
          <MobileFigure>
            <Img src={`${urlPrefix}/blow-up-font/img-1.webp`} />
          </MobileFigure>
          <MobileFigure>
            <Img src={`${urlPrefix}/blow-up-font/img-2.webp`} />
            <FigCaption>
              《香港北魏真書》分析厚重的「豎鈎」是香港北魏最容易辨識特徵，一般楷書的鈎筆短短的、呈小三角形；香港北魏的鈎筆卻長得像鐮刀般，替整個字起到穩定作用。
            </FigCaption>
          </MobileFigure>
          <MobileFigure>
            <Img src={`${urlPrefix}/blow-up-font/img-3.webp`} />
            <FigCaption>
              「口」字呈正方形，本應穩定，香港北魏卻將「口」外部形狀寫成有如六角形，賦予動感。
            </FigCaption>
          </MobileFigure>
        </MobileFigures>
      </MobileOnly>
      <MobileAbove>
        <TitleSvg src={`${urlPrefix}/blow-up-font/title.svg`} />
        <Body>
          <SubTitle>老招牌上的熱門字體</SubTitle>
          <div>
            <Text>
              <p>
                在還沒有電腦字體的年代，請街頭書法家為招牌題字是民間的主流做法。設計師陳濬人的招牌字體研究專書《香港北魏真書》記錄著清代書法家趙之謙研究筆畫粗壯剛直的魏碑後，用筆墨演繹出北魏字，這種風格被清末書法家區建公等人承襲，帶到香港，又因應招牌的需求，將字形調整得更穩定，成為「香港北魏」。
              </p>
              <p>
                1960年代香港經濟起飛後，店家快速增加，為了讓客人遠遠就能注意到招牌，在密集住宅中仍特別顯眼的「香港北魏」就成為熱門選項。
              </p>
            </Text>
            <Imgs>
              <Figure>
                <Img src={`${urlPrefix}/blow-up-font/img-1.webp`} />
              </Figure>
              <Figure>
                <Img src={`${urlPrefix}/blow-up-font/img-2.webp`} />
                <FigCaption>
                  《香港北魏真書》分析厚重的「豎鈎」是香港北魏最容易辨識特徵，一般楷書的鈎筆短短的、呈小三角形；香港北魏的鈎筆卻長得像鐮刀般，替整個字起到穩定作用。
                </FigCaption>
              </Figure>
              <Figure>
                <Img src={`${urlPrefix}/blow-up-font/img-3.webp`} />
                <FigCaption>
                  「口」字呈正方形，本應穩定，香港北魏卻將「口」外部形狀寫成有如六角形，賦予動感。
                </FigCaption>
              </Figure>
            </Imgs>
          </div>
        </Body>
      </MobileAbove>
    </Background>
  )
}

export default FontLayout
