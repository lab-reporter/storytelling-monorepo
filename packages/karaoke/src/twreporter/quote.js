import React/* eslint-disable-line */, { useEffect, useState } from 'react'
import styled from 'styled-components'

/**
 *  @param {Object} opts
 *  @param {string} [opts.className]
 *  @param {string[]} opts.textArr - quote text
 */
export default function Quote({
  className,
  textArr,
  currentCharIdx,
  animationPlayState = 'running',
}) {
  let charOffset = 0
  const charArrJsx = textArr.map((t) => {
    const chars = Array.from(t)
    const rtn = chars.map((char, cIndex) => {
      return (
        <Char
          key={`char_${cIndex}`}
          $toAnimate={cIndex + charOffset < currentCharIdx}
          $animationPlayState={animationPlayState}
        >
          {char}
        </Char>
      )
    })
    charOffset += chars.length
    return rtn
  })

  return <div className={className}>{charArrJsx}</div>
}

const Char = styled.span`
  @keyframes colored {
    0% {
      color: #808080;
    }

    50% {
      color: #c09662;
    }

    100% {
      color: #404040;
    }
  }

  color: #808080;
  transition: color 0.2s linear;

  /* clients should provide below fonts */
  font-family: Noto Sans TC, Sans-Serif, serif;
  font-size: 18px;
  font-weight: 400;
  line-height: 2;
  letter-spacing: 0em;
  text-align: justify;

  ${(props) => {
    return props.$toAnimate
      ? `
        animation-name: colored;
        animation-fill-mode: both;
        animation-duration: 1s;
        animation-play-state: ${props.$animationPlayState};
      `
      : `animation-play-state: ${props.$animationPlayState}`
  }}
`
