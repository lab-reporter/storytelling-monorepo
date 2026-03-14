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

export const EditPhotoButton = styled(Icon)`
  width: 25px;
  height: 25px;
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 4px; /* Slightly rounded corners */
  background-image: url(${cdnPrefix + '/switch-next.svg'});
  filter: invert(100%); /* Make the icon white */
`

export const DeletePhotoButton = styled(Icon)`
  width: 25px;
  height: 25px;
  background-color: rgba(0, 0, 0, 0.5); /* Semi-transparent background */
  border-radius: 4px; /* Slightly rounded corners */
  background-image: url(${cdnPrefix + '/delete-img.svg'});
  filter: invert(100%); /* Make the icon white */
`
