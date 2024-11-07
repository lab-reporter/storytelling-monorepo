import React from 'react'
import styled from 'styled-components'

const urlPrefix =
  'https://www.unpkg.com/@story-telling-reporter/react-three-story-controls/public/icons'

const Icon = styled.div<{
  $bgImg?: string
  $hoverBgImg?: string
  $focusBgImg?: string
}>`
  cursor: pointer;
  width: 25px;
  height: 25px;

  background-image: url(${(props) => props.$bgImg || ''});

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
}

export function ZoomInButton(props: IconProps) {
  return (
    <Icon
      className={props?.className}
      onClick={props?.onClick}
      $bgImg={urlPrefix + '/zoom-in.normal.svg'}
      $hoverBgImg={urlPrefix + '/zoom-in.hover.svg'}
    />
  )
}

export function ZoomOutButton(props: IconProps) {
  return (
    <Icon
      className={props?.className}
      onClick={props?.onClick}
      $bgImg={urlPrefix + '/zoom-out.normal.svg'}
      $hoverBgImg={urlPrefix + '/zoom-out.hover.svg'}
    />
  )
}

export function OpenPreviewButton(props: IconProps) {
  return (
    <Icon
      className={props?.className}
      onClick={props?.onClick}
      $bgImg={urlPrefix + '/open-preview.normal.svg'}
      $hoverBgImg={urlPrefix + '/open-preview.hover.svg'}
    />
  )
}

export function ClosePreviewButton(props: IconProps) {
  return (
    <Icon
      className={props?.className}
      onClick={props?.onClick}
      $bgImg={urlPrefix + '/close-preview.normal.svg'}
      $hoverBgImg={urlPrefix + '/close-preview.hover.svg'}
    />
  )
}

export function AddButton(props: IconProps) {
  return (
    <Icon
      className={props?.className}
      onClick={props?.onClick}
      $bgImg={urlPrefix + '/add.normal.svg'}
      $hoverBgImg={urlPrefix + '/add.hover.svg'}
    />
  )
}

export function HideButton(props: IconProps) {
  return (
    <Icon
      className={props?.className}
      onClick={props?.onClick}
      $bgImg={urlPrefix + '/hide.normal.svg'}
      $hoverBgImg={urlPrefix + '/hide.hover.svg'}
    />
  )
}

export function ExpandButton(props: IconProps) {
  return (
    <Icon
      className={props?.className}
      onClick={props?.onClick}
      $bgImg={urlPrefix + '/expand.normal.svg'}
      $hoverBgImg={urlPrefix + '/expand.hover.svg'}
    />
  )
}

export function DeleteButton(props: IconProps) {
  return (
    <Icon
      className={props?.className}
      onClick={props?.onClick}
      $bgImg={urlPrefix + '/delete.normal.svg'}
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
        style={{ cursor: 'default' }}
      />
    )
  }
  return (
    <Icon
      className={props?.className}
      onClick={props?.onClick}
      $bgImg={urlPrefix + '/switch-prev.normal.svg'}
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
        style={{ cursor: 'default' }}
      />
    )
  }
  return (
    <Icon
      className={props?.className}
      onClick={props?.onClick}
      $bgImg={urlPrefix + '/switch-next.normal.svg'}
      $hoverBgImg={urlPrefix + '/switch-next.hover.svg'}
    />
  )
}

export function FocusButton(props: IconProps) {
  return (
    <Icon
      className={props?.className}
      onClick={props?.onClick}
      $bgImg={urlPrefix + '/focus.normal.svg'}
      $hoverBgImg={urlPrefix + '/focus.hover.svg'}
    />
  )
}

export function EditButton(props: IconProps) {
  if (props.focus) {
    return (
      <Icon
        className={props?.className}
        onClick={props?.onClick}
        $bgImg={urlPrefix + '/edit.hover.svg'}
      />
    )
  }
  return (
    <Icon
      className={props?.className}
      onClick={props?.onClick}
      $bgImg={urlPrefix + '/edit.normal.svg'}
      $hoverBgImg={urlPrefix + '/edit.hover.svg'}
    />
  )
}
