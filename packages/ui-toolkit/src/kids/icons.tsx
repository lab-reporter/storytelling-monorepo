import React from 'react'

const iconURLPath =
  'https://www.unpkg.com/@story-telling-reporter/react-ui-toolkit/public/icons/kids'

type IconProps = {
  className?: string
}

export function SoundIcon({ className }: IconProps) {
  return (
    <>
      <link rel="preload" href={`${iconURLPath}/sound.svg`} as="image" />
      <img
        className={className}
        src={`${iconURLPath}/sound.svg`}
        width="100%"
      />
    </>
  )
}

export function MuteIcon({ className }: IconProps) {
  return (
    <>
      <link rel="preload" href={`${iconURLPath}/mute.svg`} as="image" />
      <img className={className} src={`${iconURLPath}/mute.svg`} width="100%" />
    </>
  )
}
