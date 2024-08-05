import React from 'react'
import styled from 'styled-components'

const Icon = styled.div<{
  $bgImg?: string
  $hoverBgImg?: string
  $focusBgImg?: string
}>`
  cursor: pointer;
  width: 50px;
  height: 50px;

  background-image: url(${(props) => props.$bgImg || ''});

  &:hover {
    background-image: url(${(props) => props.$hoverBgImg || ''});
  }
`

type IconProps = {
  className?: string
  onClick?: () => void
  darkMode?: boolean
}

export function ZoomInButton(props: IconProps) {
  return (
    <Icon
      className={props?.className}
      onClick={props?.onClick}
      $bgImg="/static/icons/zoom-in.svg"
      $hoverBgImg="/static/icons/zoom-in.hover.svg"
    />
  )
}

export function ZoomOutButton(props: IconProps) {
  const svg = '/static/icons/zoom-out.svg'
  const svgHover = '/static/icons/zoom-out.hover.svg'
  const svgDark = '/static/icons/zoom-out.dark.svg'
  const svgDarkHover = '/static/icons/zoom-out.dark.hover.svg'
  return (
    <Icon
      className={props?.className}
      onClick={props?.onClick}
      $bgImg={props?.darkMode ? svgDark : svg}
      $hoverBgImg={props?.darkMode ? svgDarkHover : svgHover}
    />
  )
}
