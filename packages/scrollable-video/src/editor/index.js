import { AddCaptionButton } from './button.js'
import React, { useEffect, useState, useRef } from 'react'
import styled from '../styled-components.js'
import { CaptionMark } from './mark.js'
import { PlayButton, PauseButton } from './styled.js'

/**
 * @typedef {import('./button.js').CaptionState} CaptionState
 */

const Container = styled.div`
  width: 100%;

  > video {
    width: 100%;
    height: 100%;
    max-height: 50vh;
    object-fit: contain;
  }
`

const Controls = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-wrap: wrap;
  gap: 5px;
`

const Progress = styled.progress`
  width: 100%;
  border: none;
  height: 10px;

  &::-webkit-progress-bar {
    background-color: #cdcdcd;
    border-radius: 10px;
  }

  &::-webkit-progress-value {
    background-color: #666;
    border-radius: 10px;
  }

  &::-moz-progress-bar {
    background-color: #cdcdcd;
    border-radius: 10px;
  }
`

const ProgressAndMarksBlock = styled.div`
  margin-top: 20px;
  margin-bottom: 80px;
  width: 100%;
  flex-shrink: 0;
  cursor: pointer;

  position: relative;
`

const MarkContainer = styled.div`
  position: absolute;
  top: 20px;
  left: ${(props) => props?.$left ?? '0px'};
  transform: translateX(-50%);

  &:focus {
    z-index: 10;
  }
`

const defaultDuration = 10 // seconds

/**
 *  @callback OnCaptionEditorChange
 *  @params {Object} opts
 *  @params {CaptionState[]} [opts.captions]
 *  @returns {void}
 */

/**
 *  @param {Object} opts
 *  @param {Object} opts.video
 *  @param {{mediaType: string, src: string}[]} opts.video.sources
 *  @param {CaptionState[]} [opts.captions=[]]
 *  @param {OnCaptionEditorChange} opts.onChange
 */
function CaptionEditor({ video, captions: _captions = [], onChange }) {
  const videoRef = useRef(null)
  const progressRef = useRef(null)
  const [duration, setDuration] = useState(defaultDuration)
  const [captions, setCaptions] = useState(_captions)

  useEffect(() => {
    const video = videoRef.current

    const onLoadedMetadata = () => {
      console.log('onLoadedMetadata is triggered.')
      setDuration(video.duration)
    }

    if (video) {
      if (video.readyState > 0) {
        setDuration(video.duration)
        return
      }

      video.addEventListener('loadedmetadata', onLoadedMetadata)
    }

    // clear event listeners
    return () => {
      video?.removeEventListener('loadedmetadata', onLoadedMetadata)
    }
  }, [])

  useEffect(() => {
    const video = videoRef.current
    const progress = progressRef.current
    const handleTimeUpdate = () => {
      // For mobile browsers, ensure that the progress element's max attribute is set
      if (!progress.getAttribute('max')) {
        progress.setAttribute('max', video.duration)
      }
      progress.value = video.currentTime
    }
    if (video && progress) {
      video.addEventListener('timeupdate', handleTimeUpdate)
    }
    return () => {
      video?.removeEventListener('timeupdate', handleTimeUpdate)
    }
  }, [])

  useEffect(() => {
    const video = videoRef.current
    const progress = progressRef.current

    const handleProgressBarClick = (e) => {
      const offsetLeft = progress.getBoundingClientRect().x
      const pos = (e.pageX - offsetLeft) / progress.offsetWidth
      video.currentTime = pos * video.duration
    }

    if (video && progress) {
      progress.addEventListener('click', handleProgressBarClick)
    }

    return () => {
      video?.removeEventListener('click', handleProgressBarClick)
    }
  }, [])

  const onPlayButtonClick = () => {
    const video = videoRef.current
    if (video) {
      video.play()
    }
  }

  const onPauseButtonClick = () => {
    const video = videoRef.current
    if (video) {
      video.pause()
    }
  }

  if (!Array.isArray(video?.sources)) {
    return null
  }

  const sourcesJsx = video.sources.map((source, index) => {
    return <source key={index} src={source.src} type={source.mediaType} />
  })

  const marksJsx = captions.map((captionState, index) => {
    let startTime = captionState.startTime

    if (startTime < 0) {
      startTime = 0
    } else if (startTime > duration) {
      startTime = duration
    }

    const left = (startTime / duration) * 100

    return (
      <MarkContainer key={index} $left={`${left}%`}>
        <CaptionMark
          captionState={captionState}
          onChange={(changedCaptionState) => {
            const newCaptions = [...captions]
            if (changedCaptionState === null) {
              newCaptions.splice(index, 1)
              setCaptions(newCaptions)

              onChange({ captions: newCaptions })
              return
            }
            newCaptions[index] = changedCaptionState

            setCaptions(newCaptions)

            onChange({ captions: newCaptions })
          }}
        />
      </MarkContainer>
    )
  })

  return (
    <Container>
      <video id="video" preload="metadata" ref={videoRef}>
        {sourcesJsx}
      </video>
      <Controls id="video-controls">
        <ProgressAndMarksBlock>
          {marksJsx}
          <Progress id="progress" value="0" max={duration} ref={progressRef} />
        </ProgressAndMarksBlock>
        <PlayButton onClick={onPlayButtonClick}></PlayButton>
        <PauseButton onClick={onPauseButtonClick}></PauseButton>
        <div onClick={onPauseButtonClick}>
          <AddCaptionButton
            getVideoCurrentTime={() => {
              return videoRef?.current?.currentTime?.toFixed(2) || 0
            }}
            onChange={(captionState) => {
              const newCaptions = captions.concat(captionState)
              setCaptions(newCaptions)

              onChange({ captions: newCaptions })
            }}
          />
        </div>
      </Controls>
    </Container>
  )
}

export { CaptionEditor }

export default CaptionEditor
