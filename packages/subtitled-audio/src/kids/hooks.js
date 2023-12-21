import React/* eslint-disable-line */, { useEffect, useState } from 'react'

/**
 * This hook is used to record the mute status in the whole web page.
 * It's useful when there are multiple `SubtitledAudio`s or
 * other components such as `Karaoke`s in the same web page.
 * If the user has clicked mute button in any component,
 * we should mute all the rest audios/videos as well.
 *
 * @param {boolean} initialValue
 * @return {[boolean, Function]}
 */
export function useMuted(initialValue = true) {
  const [muted, _setMuted] = useState(initialValue)
  useEffect(() => {
    const _muted = window?.['__story_telling_muted_controller']?.muted
    if (typeof _muted === 'boolean') {
      _setMuted(_muted)
    }
  })
  const setMuted = (_muted) => {
    window['__story_telling_muted_controller'] = {
      muted: _muted,
    }
    _setMuted(_muted)
  }

  return [muted, setMuted]
}
