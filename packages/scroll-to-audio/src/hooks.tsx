import React/* eslint-disable-line */, { useEffect, useState } from 'react'

declare const window: {
  __twreporter_story_telling_muted_controller: { muted: boolean }
} & Window

/**
 * This hook is used to record the mute status in the whole web page.
 * It's useful when there are multiple `SubtitledAudio`s or
 * other components such as `Karaoke`s in the same web page.
 * If the user has clicked mute button in any component,
 * we should mute all the rest audios/videos as well.
 */
export function useMuted(
  initialValue = true
): [boolean, (arg: boolean) => void] {
  const [muted, _setMuted] = useState(initialValue)
  useEffect(() => {
    const _muted =
      window?.['__twreporter_story_telling_muted_controller']?.muted
    if (typeof _muted === 'boolean') {
      _setMuted(_muted)
    }
  })
  const setMuted = (_muted: boolean) => {
    window['__twreporter_story_telling_muted_controller'] = {
      muted: _muted,
    }
    _setMuted(_muted)
  }

  return [muted, setMuted]
}
