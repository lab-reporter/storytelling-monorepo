import { mediaQuery } from '../utils/media-query'
import styled from 'styled-components'
import { getColorHex } from '../utils/index'

const mockup = {
  mobile: {
    figure: {
      width: '100%',
    },
    caption: {
      width: 250, // px
    },
  },
  tablet: {
    figure: {
      width: '100%',
    },
    caption: {
      width: 512, // px
    },
  },
  desktop: {
    figure: {
      width: {
        normal: 100, // %
        small: 403, // px
      },
    },
    caption: {
      width: 180, // px
    },
  },
  hd: {
    figure: {
      width: {
        normal: 100, // %
        small: 532, // px
      },
    },
    caption: {
      width: 265, // px
    },
  },
}

const Caption = styled.figcaption`
  color: #494949;
  &::after {
    border-color: ${({ theme }) => getColorHex(theme?.themeColor)};
  }

  line-height: 1.36;
  letter-spacing: 0.5px;
  font-weight: normal;
  font-size: ${({ theme }) =>
    theme?.fontSizeLevel === 'large' ? '18px' : '14px'};
  margin-bottom: 30px;

  /* border-bottom of caption */
  &::after {
    content: '';
    height: 1px;
    position: absolute;
    bottom: 0;
    left: 0;
    border-width: 0 0 1px 0;
    border-style: solid;
  }

  ${mediaQuery.smallOnly} {
    position: relative;
    margin-left: auto;
    padding: 15px 15px 15px 0;
    &:after {
      width: calc(100% - 15px);
    }
  }

  ${mediaQuery.smallOnly} {
    max-width: ${mockup.mobile.caption.width}px;
  }

  ${mediaQuery.mediumAbove} {
    /* clear float */
    clear: both;

    position: relative;
    float: right;

    &:after {
      width: 100%;
    }
  }

  ${mediaQuery.mediumOnly} {
    width: ${mockup.desktop.caption.width}px;
    padding: 15px 0 15px 0;
  }

  ${mediaQuery.largeOnly} {
    width: ${mockup.hd.caption.width}px;
    padding: 25px 0 20px 0;
  }
`

export default {
  Caption,
}
