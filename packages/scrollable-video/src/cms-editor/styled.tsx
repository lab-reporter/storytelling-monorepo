import React from 'react'
import styled from '../styled-components'

const urlPrefix =
  'https://cdn.jsdelivr.net/npm/@story-telling-reporter/react-scrollable-video/public/icons'

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

export function PlayButton(props: IconProps) {
  return (
    <Icon
      className={props?.className}
      onClick={props?.onClick}
      $bgImg={urlPrefix + '/play.svg'}
      $hoverBgImg={urlPrefix + '/play.hover.svg'}
      $focusBgImg={urlPrefix + '/play.hover.svg'}
    />
  )
}

export function PauseButton(props: IconProps) {
  return (
    <Icon
      className={props?.className}
      onClick={props?.onClick}
      $bgImg={urlPrefix + '/pause.svg'}
      $hoverBgImg={urlPrefix + '/pause.hover.svg'}
      $focusBgImg={urlPrefix + '/pause.hover.svg'}
    />
  )
}

export function AddButton(props: IconProps) {
  return (
    <Icon
      className={props?.className}
      onClick={props?.onClick}
      $bgImg={urlPrefix + '/add-caption.svg'}
      $hoverBgImg={urlPrefix + '/add-caption.hover.svg'}
    />
  )
}

export function ZoomInButton(props: IconProps) {
  return (
    <Icon
      className={props?.className}
      onClick={props?.onClick}
      $bgImg={urlPrefix + '/zoom-in.svg'}
      $hoverBgImg={urlPrefix + '/zoom-in.hover.svg'}
    />
  )
}

export function ZoomOutButton(props: IconProps) {
  const svg = urlPrefix + '/zoom-out.svg'
  const svgHover = urlPrefix + '/zoom-out.hover.svg'
  const svgDark = urlPrefix + '/zoom-out.dark.svg'
  const svgDarkHover = urlPrefix + '/zoom-out.dark.hover.svg'
  return (
    <Icon
      className={props?.className}
      onClick={props?.onClick}
      $bgImg={props?.darkMode ? svgDark : svg}
      $hoverBgImg={props?.darkMode ? svgDarkHover : svgHover}
    />
  )
}

export const MarkIcon = styled.div`
  cursor: pointer;
  width: 25px;
  height: 50px;

  background-image: url(${urlPrefix}/mark.svg);
`

export const EditMarkIcon = styled(MarkIcon)`
  background-image: url(${urlPrefix}/edit-mark.svg);
`

export const DeleteMarkIcon = styled(MarkIcon)`
  height: 25px;
  background-image: url(${urlPrefix}/delete-mark.svg);
`
