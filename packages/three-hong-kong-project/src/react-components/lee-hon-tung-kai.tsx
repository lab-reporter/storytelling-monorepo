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
    height: calc(405 / 567 * 100vh);
    max-height: 405px;
  }

  ${mediaQuery.desktopOnly} {
    margin-top: 49px;
    height: calc(384 / 567 * 100vh);
  }

  ${mediaQuery.hdOnly} {
    margin-top: 85px;
    height: calc(495 / 810 * 100vh);
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
    margin-top: 415px;
    font-size: 14px;
    line-height: 21px;
    text-align: justify;
  }

  ${mediaQuery.tabletOnly} {
    width: 110px;
    font-size: 16px;
  }

  ${mediaQuery.desktopOnly} {
    width: 281px;
    font-size: 16px;
  }

  ${mediaQuery.hdOnly} {
    width: 342px;
    font-size: 16px;
  }
`

type Props = { className?: string }

const FontLayout: React.FC<Props> = ({ className }) => {
  return (
    <Background className={className}>
      <MobileOnly>
        <SubTitle>為噴漆或刻印而生</SubTitle>
        <TitleSvg src={`${urlPrefix}/lee-hon-tung-kai-font/title-mobile.svg`} />
        <Text>
          <p>
            1950、60年代香港老鋪相當流行「通花鐵閘」，鐵閘本是為了防盜，功能類似鐵捲門，但為了美觀和通風，店鋪請匠人手工將店名或圖案刻印在鐵閘門上。刻印時使用的字需要經過特殊設計，將筆畫斷開，切割時才能維持字形完整。
          </p>
        </Text>
      </MobileOnly>
      <MobileAbove>
        <Layout>
          <TitleSvg src={`${urlPrefix}/lee-hon-tung-kai-font/title.svg`} />
          <Body>
            <SubTitle>為噴漆或刻印而生</SubTitle>
            <div>
              <Text>
                <p>
                  1950、60年代香港老鋪相當流行「通花鐵閘」，鐵閘本是為了防盜，功能類似鐵捲門，但為了美觀和通風，店鋪請匠人手工將店名或圖案刻印在鐵閘門上。刻印時使用的字需要經過特殊設計，將筆畫斷開，切割時才能維持字形完整。
                </p>
              </Text>
            </div>
          </Body>
        </Layout>
      </MobileAbove>
    </Background>
  )
}

export default FontLayout
