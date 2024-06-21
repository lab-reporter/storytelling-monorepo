import React from 'react'
import styled from '../styled-components'
import { mediaQuery } from '../utils/media-query'

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
  background: linear-gradient(180deg, #dee4e8 10%, #c3d7e6 57%, #96d0f9 100%);
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
    width: calc(178 / 768 * 100%);
    font-size: 16px;
  }

  ${mediaQuery.desktopOnly} {
    width: calc(373 / 1024 * 100%);
    font-size: 16px;
  }

  ${mediaQuery.hdOnly} {
    width: calc(436 / 1440 * 100%);
    font-size: 16px;
  }
`

const Imgs = styled.div`
  display: flex;
  gap: 2px;
  width: 100%;

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
  aspect-ratio: 1.5 / 1;
  flex-grow: 1;
`

const Img = styled.img`
  object-fit: cover;
  width: 100%;
  height: 100%;
`

const FigCaption = styled.figcaption`
  font-weight: 400;
  line-height: 1.5;
  text-align: right;

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
  margin: 0;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`

const MobileFigures = styled.div`
  margin-bottom: 39px;
  width: calc(346 / 390 * 100%);
  display: flex;
  flex-wrap: wrap;
  align-items: stretch;

  ${MobileFigure}:last-child {
    width: 100%;
    flex-shrink: 0;
    aspect-ratio: 16 / 9;
    overflow: hidden;
  }

  ${MobileFigure}:nth-child(2),
  ${MobileFigure}:first-child {
    width: 50%;
    aspect-ratio: 16 / 9;
  }
`

type Props = { className?: string }

const FontLayout: React.FC<Props> = ({ className }) => {
  return (
    <Background className={className}>
      <MobileOnly>
        <SubTitle>老招牌作坊的智慧</SubTitle>
        <TitleSvg src="./lee-hon-kong-kai-font/title-mobile.svg" />
        <Text>
          <p>傳統招牌的字形設計相當呼應製作工法。</p>
          <p>
            製作膠字招牌，要先請書法家在4吋大小的紙上寫好字，再用投影機把字放大、投影到膠紙上，然後把字從膠紙上切割下來，轉貼到背板上。為了讓字切割下來時不要零件四散，會故意讓字的筆畫彼此相連。
          </p>
        </Text>
        <MobileFigures>
          <MobileFigure>
            <Img src="./lee-hon-kong-kai-font/img-1.jpg" />
          </MobileFigure>
          <MobileFigure>
            <Img src="./lee-hon-kong-kai-font/img-2.jpg" />
          </MobileFigure>
          <MobileFigure>
            <Img src="./lee-hon-kong-kai-font/img-3.jpg" />
          </MobileFigure>
        </MobileFigures>
      </MobileOnly>
      <MobileAbove>
        <Layout>
          <TitleSvg src="./lee-hon-kong-kai-font/title.svg" />
          <Body>
            <SubTitle>老招牌作坊的智慧</SubTitle>
            <div>
              <Text>
                <p>傳統招牌的字形設計相當呼應製作工法。</p>
                <p>
                  製作膠字招牌，要先請書法家在4吋大小的紙上寫好字，再用投影機把字放大、投影到膠紙上，然後把字從膠紙上切割下來，轉貼到背板上。為了讓字切割下來時不要零件四散，會故意讓字的筆畫彼此相連。
                </p>
              </Text>
              <Imgs>
                <Figure>
                  <Img src="./lee-hon-kong-kai-font/img-1.jpg" />
                </Figure>
                <Figure>
                  <Img src="./lee-hon-kong-kai-font/img-2.jpg" />
                </Figure>
                <Figure>
                  <Img src="./lee-hon-kong-kai-font/img-3.jpg" />
                </Figure>
              </Imgs>
              <FigCaption>
                李威、李健明父子經營一間招牌店，他們展示切割招牌的傳統作法。
              </FigCaption>
            </div>
          </Body>
        </Layout>
      </MobileAbove>
    </Background>
  )
}

export default FontLayout
