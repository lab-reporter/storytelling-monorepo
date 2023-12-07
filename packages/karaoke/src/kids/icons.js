import React/* eslint-disable-line */ from 'react'

export function SoundIcon({ className, onClick, style }) {
  return (
    <img
      className={className}
      src="https://www.unpkg.com/@story-telling-reporter/react-karaoke/public/icons/kids/sound.svg"
      style={style}
      width="100%"
      onClick={onClick}
    />
  )
}

export function MuteIcon({ className, onClick, styles }) {
  return (
    <img
      className={className}
      src="https://www.unpkg.com/@story-telling-reporter/react-karaoke/public/icons/kids/mute.svg"
      styles={styles}
      width="100%"
      onClick={onClick}
    />
  )
}

export function LogoIcon({ className }) {
  return (
    <img
      className={className}
      src="https://www.unpkg.com/@story-telling-reporter/react-karaoke/public/icons/kids/karaoke-logo.svg"
      width="100%"
    />
  )
}
