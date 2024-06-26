import React from 'react' // eslint-disable-line
import styled from '../styled-components'
import { mediaQuery } from '../utils/media-query'

export const MobileOnly = styled.div`
  ${mediaQuery.tabletAbove} {
    display: none;
  }

  max-height: 100vh;
  overflow: scroll;

  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding-bottom: 100px;
  padding-top: 100px;
`

export const MobileAbove = styled.div`
  ${mediaQuery.mobileOnly} {
    display: none;
  }

  margin-left: auto;
  margin-right: auto;
  display: flex;
  gap: 15px;
  min-height: 100vh;

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

export const Background = styled.div`
  background: transparent;
  width: 100%;
`

export const TitleSvg = styled.img`
  width: auto;

  ${mediaQuery.mobileOnly} {
    width: fit-content;
  }
`

export const Body = styled.div`
  flex-grow: 1;

  display: flex;
  flex-direction: column;

  justify-content: space-between;
`

export const SubTitle = styled.div`
  padding: 7px 10px 7px 10px;
  background-color: #000;
  color: #fff;
  font-weight: 400;
  width: fit-content;

  ${mediaQuery.mobileOnly} {
    font-size: 20px;
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

export const Text = styled.div`
  color: #000;
  font-weight: 400;

  ${mediaQuery.mobileOnly} {
    font-size: 14px;
    line-height: 21px;
    text-align: justify;
  }

  ${mediaQuery.tabletAbove} {
    font-size: 16px;
    line-height: 1.5;
  }
`

export const Img = styled.img`
  object-fit: cover;
  width: 100%;
  height: 100%;
`

export const CloseBt = styled.div`
  width: 30px;
  height: 30px;
  cursor: pointer;
  position: relative;

  &::before,
  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 100%;
    height: 2px;
    background-color: #808080;
  }

  &::before {
    transform: translate(-50%, -50%) rotate(45deg);
  }

  &::after {
    transform: translate(-50%, -50%) rotate(-45deg);
  }
`

export const HintCover = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
  background-color: #f1f1f1e5;

  p {
    font-size: 16px;
    line-height: 28px;
    font-weight: 400;
    width: 300px;
    text-align: center;
    margin: 0;
    margin-bottom: 20px;
  }
`

export const Bt = styled.div<{ $disabled?: boolean }>`
  width: fit-content;
  padding: 8px 16px;
  border-radius: 40px;
  font-size: 16px;
  line-height: 24px;
  color: #fff;
  cursor: ${(props) => (props.$disabled ? 'default' : 'pointer')};
`

export const StartBt = styled(Bt)`
  margin-left: auto;
  margin-right: auto;
  background-color: ${(props) => (props.$disabled ? '#BBB' : '#404040')};
`
