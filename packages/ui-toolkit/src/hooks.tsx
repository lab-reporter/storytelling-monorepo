import React, { useEffect, useState } from 'react'

/**
 *  `ScrollableVideo` uses Javascript to update video `currentTime`.
 *  But in iOS Safari, we cannot play the video before user interactins.
 *  Video will render blank block.
 *
 *  Therefore, `useIOSCornerCaseFix` is the hook to workaround iOS Safari video/audio
 *  autoplay problems.
 */
export const useIOSCornerCaseFix = (
  elementRef: React.RefObject<HTMLMediaElement>
) => {
  useEffect(() => {
    const fixCornerCaseOnIOS = () => {
      const mediaElement = elementRef?.current
      if (mediaElement) {
        // In order to play video/audio by `play()` method, we need to follow browser video autoplay policy.
        // For autoplay policy information, see https://developer.mozilla.org/en-US/docs/Web/Media/Autoplay_guide.
        //
        // The video/audio is allowed to autoplay or `play()` by JavaScript only if at least one of the following
        // is true.
        // 1. The video/audio is muted or its volume is set to 0
        // 2. The user has interacted with the webpage (by clicking, tapping, etc.)
        //
        // Here we choose to set video/auto muted.
        mediaElement.muted = true
        // `play()` here is to clear play button when iOS is under the low battery mode.
        const startPlayPromise = mediaElement.play()
        if (startPlayPromise !== undefined) {
          startPlayPromise
            // play successfully
            .then(() => {
              console.log(
                '[react-ui-toolkit] media element plays successfully.'
              )
              mediaElement.setAttribute('data-played', 'true')
              // `pause()` video after `play()` successfully
              mediaElement.pause()
            })
            // fail to play
            .catch((error) => {
              // browser prevent from playing audio before user interactions
              console.log('[react-ui-toolkit] unable to play media element')
              console.log('[react-ui-toolkit] error: ', error)
            })
        }
      }
      window.removeEventListener('touchstart', fixCornerCaseOnIOS)
    }
    window.addEventListener('touchstart', fixCornerCaseOnIOS)

    return () => {
      window.removeEventListener('touchstart', fixCornerCaseOnIOS)
    }
  }, [elementRef])
}

declare const window: {
  __twreporter_story_telling_ui_toolkit: { muted: boolean }
} & Window

/**
 * This hook is used to record the mute status in the whole web page.
 * It's useful when there are multiple `SubtitledAudio`s or
 * other components such as `Karaoke`s in the same web page.
 * If the user has clicked mute button in any component,
 * we should mute all the rest audios/videos as well.
 */
export function useMuted(
  initialValue = true,
  elementRef?: React.RefObject<HTMLElement>
): [boolean, (arg: boolean) => void] {
  const [muted, _setMuted] = useState(initialValue)

  // Sync with global muted state
  useEffect(() => {
    const _muted = window?.['__twreporter_story_telling_ui_toolkit']?.muted
    if (typeof _muted === 'boolean') {
      _setMuted(_muted)
    }
  }, [])

  // audio/video of browser tab has been hidden, and then mute it.
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        setMuted(true)
      }
    }
    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [])

  // Sync muted state with other story telling elements.
  useEffect(() => {
    const mutedStr = muted.toString()
    const otherMediaElements = document.querySelectorAll(
      `[data-twreporter-story-telling]:not([data-muted="${mutedStr}"])`
    )
    otherMediaElements.forEach((ele) => {
      console.log(
        `[react-ui-toolkit] set story telling element attribute 'data-muted=${muted.toString()}'`
      )
      ele.setAttribute('data-muted', muted.toString())
    })
  }, [muted])

  // Receive notification of `data-muted` attribute changes
  // and update self muted state
  useEffect(() => {
    const element = elementRef?.current

    if (!element) {
      return
    }

    const observer = new MutationObserver((mutaions) => {
      mutaions.forEach((mutation) => {
        if (
          mutation.type === 'attributes' &&
          mutation?.attributeName === 'data-muted'
        ) {
          const dataMuted = element?.getAttribute('data-muted')
          setMuted(dataMuted === 'true')
        }
      })
    })

    observer.observe(element, { attributes: true })

    return () => {
      observer.disconnect()
    }
  }, [elementRef])

  const setMuted = (_muted: boolean) => {
    window['__twreporter_story_telling_ui_toolkit'] = {
      muted: _muted,
    }
    _setMuted(_muted)
  }

  return [muted, setMuted]
}

export default {
  useIOSCornerCaseFix,
  useMuted,
}
