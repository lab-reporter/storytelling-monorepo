import React from 'react'
import styled from 'styled-components'
import { getColorHex } from '../utils/index'
import { mediaQuery } from '../utils/media-query'

const Hr = styled.hr`
  border-top: 3px solid ${({ theme }) => getColorHex(theme?.themeColor)};
  width: 385px;
  height: 3px;
  margin: 40px auto 60px auto;

  ${mediaQuery.smallOnly} {
    width: 55%;
  }
`

export const Divider = () => {
  return <Hr />
}

export default Divider
