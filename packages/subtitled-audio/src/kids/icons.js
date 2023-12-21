import React/* eslint-disable-line */ from 'react'

const iconURLPath =
  'https://www.unpkg.com/@story-telling-reporter/react-subtitled-audio/public/icons/kids'

export function SoundIcon({ className, onClick, style }) {
  return (
    <>
      <link rel="preload" href={`${iconURLPath}/sound.svg`} as="image" />
      <img
        className={className}
        src={`${iconURLPath}/sound.svg`}
        style={style}
        width="100%"
        onClick={onClick}
      />
    </>
  )
}

export function MuteIcon({ className, onClick, styles }) {
  return (
    <>
      <link rel="preload" href={`${iconURLPath}/mute.svg`} as="image" />
      <img
        className={className}
        src={`${iconURLPath}/mute.svg`}
        styles={styles}
        width="100%"
        onClick={onClick}
      />
    </>
  )
}

export function PlayIcon({ className, onClick, styles }) {
  return (
    <>
      <link rel="preload" href={`${iconURLPath}/play.svg`} as="image" />
      <img
        className={className}
        src={`${iconURLPath}/play.svg`}
        styles={styles}
        width="100%"
        onClick={onClick}
      />
    </>
  )
}

export function PauseIcon({ className, onClick, styles }) {
  return (
    <>
      <link rel="preload" href={`${iconURLPath}/stop.svg`} as="image" />
      <img
        className={className}
        src={`${iconURLPath}/stop.svg`}
        styles={styles}
        width="100%"
        onClick={onClick}
      />
    </>
  )
}

export function LogoIcon({ className }) {
  return (
    <>
      <link
        rel="preload"
        href={`${iconURLPath}/subtitled-audio-logo.svg`}
        as="image"
      />
      <img
        className={className}
        src={`${iconURLPath}/subtitled-audio-logo.svg`}
        width="100%"
      />
    </>
  )
}
