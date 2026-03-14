import React from 'react'
import styled, { CSSProperties } from 'styled-components'

export const cdnPrefix =
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
  z-index: 10;
  border: none;
  border-radius: 12px;

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

// export const ZoomInButton = styled(Icon)`
//   position: absolute;
//   width: 50px;
//   height: 50px;
//   border-radius: 12px;
//   border: none;
//   background: black;
//   color: white;
//   font-size: 24px;
//
//   background-image: url(${cdnPrefix + '/zoom-in.svg'});
//   &:hover {
//     background-image: url(${cdnPrefix + '/zoom-in.hover.svg'});
//   }
// `

export const ZoomInButton = styled(Icon).attrs((props: IconProps) => ({
  $className: props?.className,
  $onClick: props?.onClick,
  $bgImg: cdnPrefix + '/zoom-in.svg',
  $hoverBgImg: cdnPrefix + '/zoom-in.hover.svg',
  style: {
    ...props.style,
  },
}))``

export const ZoomOutButton = styled(Icon)`
  position: absolute;
  width: 50px;
  height: 50px;
  border-radius: 12px;
  border: none;
  background: black;
  color: white;
  font-size: 24px;

  background-image: url(${cdnPrefix + '/zoom-out.svg'});
  &:hover {
    background-image: url(${cdnPrefix + '/zoom-out.hover.svg'});
  }
`
export const AddButton = styled(Icon).attrs((props: IconProps) => ({
  $bgImg: cdnPrefix + '/add.svg',
  $hoverBgImg: cdnPrefix + '/add.hover.svg',
  style: {
    width: '50px',
    height: '50px',
    ...props.style,
  },
}))``

// export function AddButton(props: IconProps) {
//   return (
//     <Icon
//       className={props?.className}
//       onClick={props?.onClick}
//       style={{
//         width: '50px',
//         height: '50px',
//         ...props?.style,
//       }}
//       $bgImg={cdnPrefix + '/add.svg'}
//       $hoverBgImg={cdnPrefix + '/add.hover.svg'}
//     />
//   )
// }

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

export const EditLayoutButton = styled(Icon).attrs((props: IconProps) => ({
  $className: props?.className,
  $onClick: props?.onClick,
  $bgImg: cdnPrefix + '/rotate.svg',
  $hoverBgImg: cdnPrefix + '/rotate.hover.svg',
}))``

export const EditPhotoIcon = styled(Icon)`
  width: 25px;
  height: 25px;
  background-color: rgba(0, 0, 0, 0.5); /* Semi-transparent background */
  border-radius: 4px; /* Slightly rounded corners */
  background-image: url(${cdnPrefix + '/switch-next.svg'});
  filter: invert(100%); /* Make the icon white */
`

export const DeletePhotoIcon = styled(Icon)`
  width: 25px;
  height: 25px;
  background-color: rgba(0, 0, 0, 0.5); /* Semi-transparent background */
  border-radius: 4px; /* Slightly rounded corners */
  background-image: url(${cdnPrefix + '/delete-img.svg'});
  filter: invert(100%); /* Make the icon white */
`

export const ClosePreviewButton = styled(Icon)`
  width: 50px;
  height: 50px;

  background-image: url(${cdnPrefix + '/close-preview.svg'});
  &:hover {
    background-image: url(${cdnPrefix + '/close-preview.hover.svg'});
  }
`
