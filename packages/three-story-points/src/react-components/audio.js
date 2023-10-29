import events from 'events'
import { useEffect, useRef, useState } from 'react'

const managerName = '__readr_react_centralized_muted_manager'

/**
 *  `CentralizedMutedManager` is designed to let multiple
 *  React components on the same web page
 *  to communicate with each other via events.
 *
 *  Each component could publish/subscribe 'mutedChange' and
 *  'messageChange' event type.
 *
 *  Every subscriber would receive 'mutedChange' event, whose
 *  value would be `true` or `false` if any component calls
 *  manager's `updateMuted` function.
 *
 *  Every subscriber would receive 'messageChange' event, whose
 *  value is a string if any component calls manager's
 *  `updateMessage` function.
 */
export class CentralizedMutedManager {
  /** @type events.EventEmitter */
  eventEmitter = null
  muted = true
  message = ''

  /**
   *  @constructor
   *  @param {boolean} [muted=true]
   *  @param {string} [message='']
   */
  constructor(muted = true, message = '') {
    this.eventEmitter = new events.EventEmitter()
    this.muted = muted
    this.message = message
  }

  updateMuted(muted) {
    this.muted = muted
    this.onMutedChange()
  }

  updateNoticeMessage(message) {
    this.message = message
    this.onMessageChange()
  }

  onMutedChange() {
    this.eventEmitter.emit('mutedChange', this.muted)
  }

  onMessageChange() {
    this.eventEmitter.emit('messageChange', this.message)
  }

  addEventListener(eventType, cb) {
    this.eventEmitter.addListener(eventType, cb)
  }

  removeEventListener(eventType, cb) {
    this.eventEmitter.removeListener(eventType, cb)
  }

  getMuted() {
    return this.muted
  }

  getMessage() {
    return this.message
  }
}

/**
 *  Get the `CentralizedMutedManager` instance.
 *  @returns {CentralizedMutedManager|null}
 */
export function getCentralizedMutedManager() {
  if (typeof window !== 'undefined') {
    return window[managerName]
  }
  return null
}

/**
 * This hook is used to record the `muted` status in the whole web page.
 * It's useful when there are multiple components with audio/video element
 * in the same web page.
 * If the user has clicked web page centralized play/pause button,
 * we should mute/unmute all the rest audios/vidoeos as well on the same web page.
 *
 * @param {boolean} initialValue
 * @returns boolean
 */
function useMuted(initialValue = true) {
  const [muted, _setMuted] = useState(initialValue)
  useEffect(() => {
    let manager = window?.[managerName]

    if (!manager) {
      manager = new CentralizedMutedManager(muted)
      window[managerName] = manager
    }

    // TODO: uncomment the following condition
    // after `CentralizedMutedManager` class moved into
    // independent subpkg.
    // if (manager instanceof CentralizedMutedManager) {
    if (
      typeof manager.addEventListener === 'function' &&
      typeof manager.removeEventListener === 'function'
    ) {
      const setMuted = (muted) => {
        _setMuted(muted)
      }
      manager.addEventListener('mutedChange', setMuted)

      setMuted(manager.getMuted())

      return () => {
        manager.removeEventListener('mutedChange', setMuted)
      }
    }
  }, [muted])

  return muted
}

/**
 *  @param {Object} opts
 *  @param {boolean} opts.play
 *  @param {string[]} opts.audioUrls
 *  @param {string} [opts.preload='auto'] - 'auto', 'none' or 'metadata'. `preload` attribute of `audio` tag.
 */
export default function Audio({ play, audioUrls, preload = 'auto' }) {
  const audioRef = useRef(null)
  const muted = useMuted(true)

  useEffect(() => {
    const audio = audioRef.current
    // Do not need to play audio if `muted` is true.
    if (!audio || muted || !play) {
      return
    }

    // Get web page level centralized (audio/video) muted manager
    const mutedManager = getCentralizedMutedManager()
    const startPlayPromise = audio.play()
    startPlayPromise
      // Play successfully
      .then(() => {
        if (mutedManager) {
          // Clear notice of webpage centralized audio play button
          mutedManager.updateNoticeMessage('')
        }
      })
      // Fail to play
      .catch((error) => {
        // Browser prevent from playing audio before user interactions
        if (error.name === 'NotAllowedError' && mutedManager) {
          // Show notice of webpage centralized audio play button
          mutedManager.updateNoticeMessage('請點選聲音播放鍵')
        } else {
          mutedManager.updateNoticeMessage('無法播放音檔，請重新整理頁面')
        }
      })

    // Clean up
    return () => {
      if (audio) {
        audio.pause()
      }
    }
  }, [muted, play])

  return (
    <audio ref={audioRef} preload={preload}>
      {audioUrls.map((url, index) => (
        <source key={`audio_source_${index}`} src={url}></source>
      ))}
    </audio>
  )
}
