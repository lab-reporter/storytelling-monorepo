import React from 'react'
import styled from '../styled-components'
import { CSSProperties } from 'styled-components'
import { cdnPrefixForIcons as cdnPrefix } from './constants'

const Icon = styled.div<{
  $bgImg?: string
  $hoverBgImg?: string
  $focusBgImg?: string
}>`
  cursor: pointer;
  width: 25px;
  height: 25px;

  background-image: url(${(props) => props.$bgImg || ''});
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;

  &:hover {
    background-image: url(${(props) => props.$hoverBgImg || ''});
  }
`

type IconProps = {
  className?: string
  onClick?: () => void
  darkMode?: boolean
  disabled?: boolean
  focus?: boolean
  style?: CSSProperties
}

export const ZoomInButton = styled(Icon)`
  width: 50px;
  height: 50px;

  background-image: url(${cdnPrefix + '/zoom-in.svg'});
  &:hover {
    background-image: url(${cdnPrefix + '/zoom-in.hover.svg'});
  }
`

export const ZoomOutButton = styled(Icon)`
  width: 50px;
  height: 50px;

  background-image: url(${cdnPrefix + '/zoom-out.svg'});
  &:hover {
    background-image: url(${cdnPrefix + '/zoom-out.hover.svg'});
  }
`

export function AddButton(props: IconProps) {
  return (
    <Icon
      className={props?.className}
      onClick={props?.onClick}
      style={{
        width: '50px',
        height: '50px',
        ...props?.style,
      }}
      $bgImg={cdnPrefix + '/add.svg'}
      $hoverBgImg={cdnPrefix + '/add.hover.svg'}
    />
  )
}

export function CaptionButton(props: IconProps) {
  const bgImg = props.focus
    ? cdnPrefix + '/caption.hover.svg'
    : cdnPrefix + '/caption.svg'

  return (
    <Icon
      className={props?.className}
      onClick={props?.onClick}
      style={{
        width: '50px',
        height: '50px',
        ...props.style,
      }}
      $bgImg={bgImg}
      $hoverBgImg={cdnPrefix + '/caption.hover.svg'}
    />
  )
}

export const SmallCaptionIcon = styled(Icon)`
  width: '20px';
  height: '20px';

  background-image: url(${cdnPrefix + '/small-caption.svg'});
  &:hover {
    background-image: url(${cdnPrefix + '/small-caption.svg'});
  }
`

export const DeleteImgButton = styled(Icon)`
  background-image: url(${cdnPrefix + '/delete-img.svg'});
  &:hover {
    background-image: url(${cdnPrefix + '/delete-img.hover.svg'});
  }
`

export function DeleteCaptionButton(props: IconProps) {
  const svg = cdnPrefix + '/delete-caption.svg'
  const svgHover = cdnPrefix + '/delete-caption.hover.svg'
  const svgDark = cdnPrefix + '/delete-caption.dark.svg'
  const svgDarkHover = cdnPrefix + '/delete-caption.dark.hover.svg'
  return (
    <Icon
      className={props?.className}
      onClick={props?.onClick}
      $bgImg={props?.darkMode ? svgDark : svg}
      $hoverBgImg={props?.darkMode ? svgDarkHover : svgHover}
    />
  )
}

export function EditCaptionButton(props: IconProps) {
  const svg = cdnPrefix + '/edit-caption.svg'
  const svgHover = cdnPrefix + '/edit-caption.hover.svg'
  const svgDark = cdnPrefix + '/edit-caption.dark.svg'
  const svgDarkHover = cdnPrefix + '/edit-caption.dark.hover.svg'
  return (
    <Icon
      className={props?.className}
      onClick={props?.onClick}
      $bgImg={props?.darkMode ? svgDark : svg}
      $hoverBgImg={props?.darkMode ? svgDarkHover : svgHover}
    />
  )
}

export function SwitchPrevButton(props: IconProps) {
  if (props.disabled) {
    return (
      <Icon
        className={props?.className}
        $bgImg={cdnPrefix + '/switch-prev.disabled.svg'}
        $hoverBgImg={cdnPrefix + '/switch-prev.disabled.svg'}
        style={{
          cursor: 'default',
          ...props.style,
        }}
      />
    )
  }
  return (
    <Icon
      className={props?.className}
      onClick={props?.onClick}
      $bgImg={cdnPrefix + '/switch-prev.svg'}
      $hoverBgImg={cdnPrefix + '/switch-prev.hover.svg'}
    />
  )
}

export function SwitchNextButton(props: IconProps) {
  if (props.disabled) {
    return (
      <Icon
        className={props?.className}
        $bgImg={cdnPrefix + '/switch-next.disabled.svg'}
        $hoverBgImg={cdnPrefix + '/switch-next.disabled.svg'}
        style={{
          cursor: 'default',
          ...props.style,
        }}
      />
    )
  }
  return (
    <Icon
      className={props?.className}
      onClick={props?.onClick}
      $bgImg={cdnPrefix + '/switch-next.svg'}
      $hoverBgImg={cdnPrefix + '/switch-next.hover.svg'}
    />
  )
}

export const OpenPreviewButton = styled(Icon)`
  width: 50px;
  height: 50px;

  background-image: url(${cdnPrefix + '/open-preview.svg'});
  &:hover {
    background-image: url(${cdnPrefix + '/open-preview.hover.svg'});
  }
`

export const ClosePreviewButton = styled(Icon)`
  width: 50px;
  height: 50px;

  background-image: url(${cdnPrefix + '/close-preview.svg'});
  &:hover {
    background-image: url(${cdnPrefix + '/close-preview.hover.svg'});
  }
`
