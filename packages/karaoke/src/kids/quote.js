import React/* eslint-disable-line */, { useEffect, useState } from 'react'
import { mediaQuery } from './utils/media-query'
import styled from 'styled-components'

/**
 *  @param {Object} opts
 *  @param {string} [opts.className]
 *  @param {string[]} opts.textArr - quote text
 */
export default function QuoteShadow({ className, textArr, currentCharIdx }) {
  let charOffset = 0
  const charArrJsx = textArr.map((t) => {
    const chars = Array.from(t)
    const rtn = chars
      .map((char, cIndex) => {
        return (
          <Char
            key={`char_${cIndex}`}
            isTransitioned={cIndex + charOffset < currentCharIdx}
          >
            {char}
          </Char>
        )
      })
      .concat(<br key={`char_break_line`} />)
    charOffset += chars.length
    return rtn
  })

  return <Quote className={className}>{charArrJsx}</Quote>
}

const Char = styled.span`
  ${
    /**
     *  @param {Object} props
     *  @param {boolean} props.isTransitioned
     */
    (props) => {
      return `
      color: ${props.isTransitioned ? '#27B5F7' : '#232323'};
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

const Quote = styled.span``
