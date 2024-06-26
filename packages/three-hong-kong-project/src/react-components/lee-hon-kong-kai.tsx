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
    width: calc(178 / 603 * 100%);
    max-width: 178px;
    padding: 5px;
    background-color: #ffffff2f;
  }

  ${mediaQuery.desktopOnly} {
    width: calc(373 / 844 * 100%);
    max-width: 373px;
  }

  ${mediaQuery.hdOnly} {
    width: calc(436 / 1139 * 100%);
    max-width: 436px;
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
        <TitleSvg src={`${urlPrefix}/lee-hon-kong-kai-font/title-mobile.svg`} />
        <Img
          style={{ width: 'calc(345/390*100%)', margin: '25px 0' }}
          src={`${urlPrefix}/lee-hon-kong-kai-font/mobile-font.webp`}
        />
        <Text>
          <p>傳統招牌的字形設計相當呼應製作工法。</p>
          <p>
            製作膠字招牌，要先請書法家在4吋大小的紙上寫好字，再用投影機把字放大、投影到膠紙上，然後把字從膠紙上切割下來，轉貼到背板上。為了讓字切割下來時不要零件四散，會故意讓字的筆畫彼此相連。
          </p>
        </Text>
        <MobileFigures>
          <MobileFigure>
            <Img src={`${urlPrefix}/lee-hon-kong-kai-font/img-1.webp`} />
          </MobileFigure>
          <MobileFigure>
            <Img src={`${urlPrefix}/lee-hon-kong-kai-font/img-2.webp`} />
          </MobileFigure>
          <MobileFigure>
            <Img src={`${urlPrefix}/lee-hon-kong-kai-font/img-3.webp`} />
          </MobileFigure>
        </MobileFigures>
      </MobileOnly>
      <MobileAbove>
        <TitleSvg src={`${urlPrefix}/lee-hon-kong-kai-font/title.svg`} />
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
                <Img src={`${urlPrefix}/lee-hon-kong-kai-font/img-1.webp`} />
              </Figure>
              <Figure>
                <Img src={`${urlPrefix}/lee-hon-kong-kai-font/img-2.webp`} />
              </Figure>
              <Figure>
                <Img src={`${urlPrefix}/lee-hon-kong-kai-font/img-3.webp`} />
              </Figure>
            </Imgs>
            <FigCaption>
              李威、李健明父子經營一間招牌店，他們展示切割招牌的傳統作法。
            </FigCaption>
          </div>
        </Body>
      </MobileAbove>
    </Background>
  )
}

export default FontLayout
