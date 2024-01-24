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
  enabled?: boolean
}

export function PlayButton(props: IconProps) {
  return (
    <Icon
      className={props?.className}
      onClick={props?.onClick}
      $bgImg="https://www.unpkg.com/@story-telling-reporter/react-scrollable-video/public/icons/play.svg"
      $hoverBgImg="https://www.unpkg.com/@story-telling-reporter/react-scrollable-video/public/icons/play.hover.svg"
      $focusBgImg="https://www.unpkg.com/@story-telling-reporter/react-scrollable-video/public/icons/play.hover.svg"
    />
  )
}

export function PauseButton(props: IconProps) {
  return (
    <Icon
      className={props?.className}
      onClick={props?.onClick}
      $bgImg="https://www.unpkg.com/@story-telling-reporter/react-scrollable-video/public/icons/pause.svg"
      $hoverBgImg="https://www.unpkg.com/@story-telling-reporter/react-scrollable-video/public/icons/pause.hover.svg"
      $focusBgImg="https://www.unpkg.com/@story-telling-reporter/react-scrollable-video/public/icons/pause.hover.svg"
    />
  )
}

export function DeleteCaptionIcon(props: IconProps) {
  const disableImg =
    'https://www.unpkg.com/@story-telling-reporter/react-scrollable-video/public/icons/delete.disable.svg'
  const enableImg =
    'https://www.unpkg.com/@story-telling-reporter/react-scrollable-video/public/icons/delete.enable.svg'
  return (
    <Icon
      className={props?.className}
      onClick={props?.onClick}
      $bgImg={props?.enabled ? enableImg : disableImg}
      $hoverBgImg={props?.enabled ? enableImg : disableImg}
    />
  )
}

export function AddCaptionIcon(props: IconProps) {
  return (
    <Icon
      className={props?.className}
      onClick={props?.onClick}
      $bgImg="https://www.unpkg.com/@story-telling-reporter/react-scrollable-video/public/icons/add-caption.svg"
      $hoverBgImg="https://www.unpkg.com/@story-telling-reporter/react-scrollable-video/public/icons/add-caption.hover.svg"
    />
  )
}

export const MarkIcon = styled.div`
  cursor: pointer;
  width: 25px;
  height: 50px;

  background-image: url(https://www.unpkg.com/@story-telling-reporter/react-scrollable-video/public/icons/mark.svg);
`

export const EditMarkIcon = styled(MarkIcon)`
  background-image: url(https://www.unpkg.com/@story-telling-reporter/react-scrollable-video/public/icons/edit-mark.svg);
`

export const DeleteMarkIcon = styled(MarkIcon)`
  height: 25px;
  background-image: url(https://www.unpkg.com/@story-telling-reporter/react-scrollable-video/public/icons/delete-mark.svg);
`
