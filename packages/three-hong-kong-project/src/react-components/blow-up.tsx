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
  height: 100%;

  ${mediaQuery.mobileOnly} {
    display: none;
  }
`

const Background = styled.div`
  background: transparent;
  width: 100%;

  ${mediaQuery.mobileOnly} {
    overflow-x: hidden;
    min-height: 100vh;
  }

  ${mediaQuery.tabletAbove} {
    height: 100vh;
    overflow: scroll;
  }
`

const Layout = styled.div`
  margin-left: auto;
  margin-right: auto;
  display: flex;
  gap: 15px;
  height: 100%;

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

const Body = styled.div`
  flex-grow: 1;

  display: flex;
  flex-direction: column;

  justify-content: space-between;

  ${mediaQuery.tabletAbove} {
    margin-bottom: 30px;
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
    width: calc(197 / 523 * 100%);
    font-size: 16px;
    max-width: 197px;
  }

  ${mediaQuery.desktopOnly} {
    width: calc(288 / 822 * 100%);
    font-size: 16px;
    max-width: 288px;
  }

  ${mediaQuery.hdOnly} {
    width: calc(453 / 1170 * 100%);
    font-size: 16px;
    max-width: 453px;
  }
`

const Imgs = styled.div`
  display: flex;
  gap: 2px;

  ${mediaQuery.tabletOnly} {
    margin-top: 15px;
    width: calc(100% + 140px);
    transform: translateX(-140px);
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

const Img = styled.img`
  object-fit: cover;
  width: 100%;
  height: 100%;
`

const FigCaption = styled.figcaption`
  font-weight: 400;
  line-height: 1.5;
  padding: 5px 10px 17px 10px;

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
  margin-bottom: 39px;
  width: calc(346 / 390 * 100%);
  display: flex;
  flex-wrap: wrap;
  align-items: stretch;

  ${MobileFigure}:first-child {
    width: 100%;
    flex-shrink: 0;
    aspect-ratio: 3.5 / 1;
  }

  ${MobileFigure}:nth-child(2) {
    width: 57%;
    img {
      height: 127px;
    }
    aspect-ratio: 5 / 3;
  }
  ${MobileFigure}:last-child {
    width: 43%;
    img {
      height: 127px;
    }
    aspect-ratio: 5 / 3;
  }
`

type Props = { className?: string }

const FontLayout: React.FC<Props> = ({ className }) => {
  return (
    <Background className={className}>
      <MobileOnly>
        <SubTitle>老招牌上的熱門字體</SubTitle>
        <TitleSvg src={`${urlPrefix}/blow-up-font/title-mobile.svg`} />
        <Text>
          <p>
            在還沒有電腦字體的年代，請街頭書法家為招牌題字是民間的主流做法。設計師陳濬人的招牌字體研究專書《香港北魏真書》記錄著清代書法家趙之謙研究筆畫粗壯剛直的魏碑後，用筆墨演繹出北魏字，這種風格被清末書法家區建公等人承襲，帶到香港，又因應招牌的需求，將字形調整得更穩定，成為「香港北魏」。
          </p>
          <p>
            1960年代香港經濟起飛時期，店家快速增加，為了讓客人遠遠就能注意到招牌，在密集住宅中仍特別顯眼的「香港北魏」就成為熱門選項。
          </p>
        </Text>
        <MobileFigures>
          <MobileFigure>
            <Img src={`${urlPrefix}/blow-up-font/img-1.jpg`} />
          </MobileFigure>
          <MobileFigure>
            <Img src={`${urlPrefix}/blow-up-font/img-2.jpg`} />
            <FigCaption>
              《香港北魏真書》分析厚重的「豎鈎」是香港北魏最容易辨識特徵，一般楷書的鈎筆短短的、呈小三角形；香港北魏的鈎筆卻長的像鐮刀般，替整個字起到穩定作用。
            </FigCaption>
          </MobileFigure>
          <MobileFigure>
            <Img src={`${urlPrefix}/blow-up-font/img-3.jpg`} />
            <FigCaption>
              「口」字呈正方形，本應穩定，香港北魏卻將「口」外部形狀寫成有如六角形，賦予動感。
            </FigCaption>
          </MobileFigure>
        </MobileFigures>
      </MobileOnly>
      <MobileAbove>
        <Layout>
          <TitleSvg src={`${urlPrefix}/blow-up-font/title.svg`} />
          <Body>
            <SubTitle>老招牌上的熱門字體</SubTitle>
            <div>
              <Text>
                <p>
                  在還沒有電腦字體的年代，請街頭書法家為招牌題字是民間的主流做法。設計師陳濬人的招牌字體研究專書《香港北魏真書》記錄著清代書法家趙之謙研究筆畫粗壯剛直的魏碑後，用筆墨演繹出北魏字，這種風格被清末書法家區建公等人承襲，帶到香港，又因應招牌的需求，將字形調整得更穩定，成為「香港北魏」。
                </p>
                <p>
                  1960年代香港經濟起飛時期，店家快速增加，為了讓客人遠遠就能注意到招牌，在密集住宅中仍特別顯眼的「香港北魏」就成為熱門選項。
                </p>
              </Text>
              <Imgs>
                <Figure>
                  <Img src={`${urlPrefix}/blow-up-font/img-1.jpg`} />
                </Figure>
                <Figure>
                  <Img src={`${urlPrefix}/blow-up-font/img-2.jpg`} />
                  <FigCaption>
                    《香港北魏真書》分析厚重的「豎鈎」是香港北魏最容易辨識特徵，一般楷書的鈎筆短短的、呈小三角形；香港北魏的鈎筆卻長的像鐮刀般，替整個字起到穩定作用。
                  </FigCaption>
                </Figure>
                <Figure>
                  <Img src={`${urlPrefix}/blow-up-font/img-3.jpg`} />
                  <FigCaption>
                    「口」字呈正方形，本應穩定，香港北魏卻將「口」外部形狀寫成有如六角形，賦予動感。
                  </FigCaption>
                </Figure>
              </Imgs>
            </div>
          </Body>
        </Layout>
      </MobileAbove>
    </Background>
  )
}

export default FontLayout
