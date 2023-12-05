import React/* eslint-disable-line */, { useEffect, useState } from 'react'
import { mediaQuery } from './media-query'
import styled from 'styled-components'

/**
 *  @callback onCurrentTimeUpdate
 *  @param {number} currentTime - how long the shadow animation runs in seconds
 *  @return void
 */

/**
 *  @param {Object} opts
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
    <Quote className={className}>
      {charArrJsx}
    </Quote>
  )
}

const Char = styled.span`
  ${
    /**
     *  @param {Object} props
     *  @param {boolean} props.isTransitioned
     */
    (props) => {
      return `
      color: ${ props.isTransitioned ? '#27B5F7' : '#232323' };
      transition: color 0.5s linear;
      font-size: 24px;
      font-weight: 400;
      line-height: 1.5;

      ${mediaQuery.smallOnly} {
        font-size: 20px;
      }
    `
    }
  }
`

const Quote = styled.blockquote`
  position: relative;

  /* clear default margin */
  margin: 0;
`
