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
} from './styled'

const TitleSvg = styled(_TitleSvg)`
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

const Body = styled(_Body)`
  ${mediaQuery.tabletOnly} {
    margin-bottom: 50px;
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
    width: 197px;
  }

  ${mediaQuery.desktopOnly} {
    width: 281px;
  }

  ${mediaQuery.hdOnly} {
    width: 342px;
  }
`

type Props = { className?: string }

const FontLayout: React.FC<Props> = ({ className }) => {
  return (
    <Background className={className}>
      <MobileOnly>
        <SubTitle>為噴漆或刻印而生</SubTitle>
        <TitleSvg src={`${urlPrefix}/lee-hon-tung-kai-font/title-mobile.svg`} />
        <img
          style={{ width: 'calc(345/390*100%)', margin: '25px 0' }}
          src={`${urlPrefix}/lee-hon-tung-kai-font/mobile-font.webp`}
        />
        <Text>
          <p>
            1950、60年代香港老鋪相當流行「通花鐵閘」，鐵閘本是為了防盜，功能類似鐵捲門，但為了美觀和通風，店鋪請匠人手工將店名或圖案刻印在鐵閘門上。刻印時使用的字需要經過特殊設計，將筆畫斷開，切割時才能維持字形完整。
          </p>
        </Text>
      </MobileOnly>
      <MobileAbove>
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
      </MobileAbove>
    </Background>
  )
}

export default FontLayout
