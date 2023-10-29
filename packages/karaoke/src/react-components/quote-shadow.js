import React/* eslint-disable-line */, { useEffect, useState } from 'react'
import breakpoint from './breakpoint'
import mockups from './mockups'
import styled from 'styled-components'

/**
 *  @callback onCurrentTimeUpdate
 *  @param {number} currentTime - how long the shadow animation runs in seconds
 *  @return void
 */

/**
 *  @param {Object} opts
 *  @param {import('./typedef').KaraokeStyles} [opts.styles]
 *  @param {boolean} [opts.play] - whether to play the shadow animation or not
 *  @param {number} [opts.duration] - animation duration for entire quote text. Unit is second.
 *  @param {string} [opts.className]
 *  @param {string[]} opts.textArr - quote text
 *  @param {onCurrentTimeUpdate} [opts.onCurrentTimeUpdate] -
 */
export default function QuoteShadow({
  className,
  textArr,
  duration,
  play = false,
  styles,
  onCurrentTimeUpdate = () => {
    console.log('`onCurrentTimeUpdate` is not provided')
  },
}) {
  const [currentCharIndex, setCurrentCharIndex] = useState(0)
  const textLen = textArr.join('').length

  let durationPerChar = 300 // ms, default value
  if (duration) {
    durationPerChar = (duration / textLen) * 1000 // ms
  }

  useEffect(() => {
    if (currentCharIndex < textLen && play) {
      setTimeout(() => {
        setCurrentCharIndex((currentCharIndex) => currentCharIndex + 1)
        onCurrentTimeUpdate((currentCharIndex * durationPerChar) / 1000) // in seconds
      }, durationPerChar)
    }
  }, [currentCharIndex, textLen, play])

  let charOffset = 0
  const charArrJsx = textArr.map((t) => {
    const chars = Array.from(t)
    const rtn = chars
      .map((char, cIndex) => {
        return (
          <Char
            key={`char_${cIndex}`}
            isTransitioned={cIndex + charOffset < currentCharIndex}
            styles={styles}
          >
            {char}
          </Char>
        )
      })
      .concat(<br key={`char_break_line`} />)
    charOffset += chars.length
    return rtn
  })

  return (
    <Quote styles={styles} className={className}>
      <mockups.quote.LeftUpperQuoteMark isTransitioned={play} />
      {charArrJsx}
    </Quote>
  )
}

const Char = styled.span`
  ${
    /**
     *  @param {Object} props
     *  @param {boolean} props.isTransitioned
     *  @param {import('./typedef').KaraokeStyles} props.styles
     */
    (props) => {
      return `
      color: ${
        props.isTransitioned
          ? props.styles.mobile.transitioned.font.color
          : props.styles.mobile.font.color
      };
      transition: color 0.5s linear; /* TODO make transition duration cofigurable*/
      font-size: ${props.styles.mobile.font.size};
      font-weight: ${props.styles.mobile.font.weight};
      line-height: ${props.styles.mobile.lineHeight};

      @media ${breakpoint.devices.tablet} {
        color: ${
          props.isTransitioned
            ? props.styles.tablet.transitioned.font.color
            : props.styles.tablet.font.color
        };
        font-size: ${props.styles.tablet.font.size};
        font-weight: ${props.styles.tablet.font.weight};
        line-height: ${props.styles.tablet.lineHeight};
      }
    `
    }
  }
`

const Quote = styled.blockquote`
  ${
    /**
     *  @param {Object} props
     *  @param {import('./typedef').KaraokeStyles} props.styles
     */
    (props) => {
      return `
      position: relative;

      /* clear default margin */
      margin: 0;
      text-align: ${props.styles.mobile.textAlign};

      @media ${breakpoint.devices.tablet} {
        text-align: ${props.styles.tablet.textAlign};
      }

      > svg {
        fill: black;
        opacity: 0.1;
        position: absolute;
        width: 150px;
        top: -150px;
        left: -60px;
      }
    `
    }
  }
`
