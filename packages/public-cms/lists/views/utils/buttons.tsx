import styled, { CSSProperties } from 'styled-components'

export const cdnPrefix =
  'https://cdn.jsdelivr.net/npm/@story-telling-reporter/react-scrollable-image/public/icons'

export const Icon = styled.button<{
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
  background-color: transparent;
  z-index: 10;
  border: none;
  border-radius: 12px;
  padding: 0;

  &:hover {
    background-image: url(${(props) => props.$hoverBgImg || ''});
  }
`

export type IconProps = {
  className?: string
  onClick?: () => void
  darkMode?: boolean
  disabled?: boolean
  focus?: boolean
  style?: CSSProperties
}

export const ZoomInButton = styled(Icon).attrs((props: IconProps) => ({
  $bgImg: cdnPrefix + '/zoom-in.svg',
  $hoverBgImg: cdnPrefix + '/zoom-in.hover.svg',
  style: {
    width: '50px',
    height: '50px',
    borderRadius: '12px',
    backgroundColor: '#191919',
    ...(props.style || {}),
  } as CSSProperties,
}))``

export const ZoomOutButton = styled(Icon).attrs((props: IconProps) => ({
  $bgImg: cdnPrefix + '/zoom-out.svg',
  $hoverBgImg: cdnPrefix + '/zoom-out.hover.svg',
  style: {
    width: '50px',
    height: '50px',
    borderRadius: '12px',
    backgroundColor: '#191919',
    ...(props.style || {}),
  } as CSSProperties,
}))``

export const AddButton = styled(Icon).attrs((props: IconProps) => ({
  $bgImg: cdnPrefix + '/add.svg',
  $hoverBgImg: cdnPrefix + '/add.hover.svg',
  style: {
    width: '50px',
    height: '50px',
    ...(props.style || {}),
  } as CSSProperties,
}))``

export const EditPhotoButton = styled(Icon).attrs((props: IconProps) => ({
  $bgImg: cdnPrefix + '/switch-next.svg',
  style: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: '4px',
    filter: 'invert(100%)',
    ...(props.style || {}),
  } as CSSProperties,
}))``

export const DeletePhotoButton = styled(Icon).attrs((props: IconProps) => ({
  $bgImg: cdnPrefix + '/delete-img.svg',
  style: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: '4px',
    filter: 'invert(100%)',
    ...(props.style || {}),
  } as CSSProperties,
}))``
