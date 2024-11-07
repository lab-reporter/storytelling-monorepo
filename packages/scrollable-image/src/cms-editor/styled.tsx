import React from 'react'
import styled from '../styled-components'
import { CSSProperties } from 'styled-components'

const urlPrefix =
  'https://cdn.jsdelivr.net/npm/@story-telling-reporter/react-scrollable-image/public/icons'

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

export function ZoomInButton(props: IconProps) {
  return (
    <Icon
      className={props?.className}
      onClick={props?.onClick}
      style={props.style}
      $bgImg={urlPrefix + '/zoom-in.svg'}
      $hoverBgImg={urlPrefix + '/zoom-in.hover.svg'}
    />
  )
}

export function ZoomOutButton(props: IconProps) {
  return (
    <Icon
      className={props?.className}
      onClick={props?.onClick}
      style={props.style}
      $bgImg={urlPrefix + '/zoom-out.svg'}
      $hoverBgImg={urlPrefix + '/zoom-out.hover.svg'}
    />
  )
}

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
      $bgImg={urlPrefix + '/add.svg'}
      $hoverBgImg={urlPrefix + '/add.hover.svg'}
    />
  )
}

export function CaptionButton(props: IconProps) {
  const bgImg = props.focus
    ? urlPrefix + '/caption.hover.svg'
    : urlPrefix + '/caption.svg'

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
      $hoverBgImg={urlPrefix + '/caption.hover.svg'}
    />
  )
}

export const SmallCaptionIcon = styled(Icon)`
  width: '20px';
  height: '20px';

  background-image: url(${urlPrefix + '/small-caption.svg'});
  &:hover {
    background-image: url(${urlPrefix + '/small-caption.svg'});
  }
`

export function DeleteButton(props: IconProps) {
  return (
    <Icon
      className={props?.className}
      onClick={props?.onClick}
      $bgImg={urlPrefix + '/delete.svg'}
      $hoverBgImg={urlPrefix + '/delete.hover.svg'}
    />
  )
}

export function SwitchPrevButton(props: IconProps) {
  if (props.disabled) {
    return (
      <Icon
        className={props?.className}
        $bgImg={urlPrefix + '/switch-prev.disabled.svg'}
        $hoverBgImg={urlPrefix + '/switch-prev.disabled.svg'}
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
      $bgImg={urlPrefix + '/switch-prev.svg'}
      $hoverBgImg={urlPrefix + '/switch-prev.hover.svg'}
    />
  )
}

export function SwitchNextButton(props: IconProps) {
  if (props.disabled) {
    return (
      <Icon
        className={props?.className}
        $bgImg={urlPrefix + '/switch-next.disabled.svg'}
        $hoverBgImg={urlPrefix + '/switch-next.disabled.svg'}
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
      $bgImg={urlPrefix + '/switch-next.svg'}
      $hoverBgImg={urlPrefix + '/switch-next.hover.svg'}
    />
  )
}
