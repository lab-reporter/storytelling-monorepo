import { AddCaptionButton } from './button'
import React, { useEffect, useState, useRef } from 'react'
import styled from 'styled-components'
import { CaptionState } from './type'
import { CaptionMark } from './mark'
import { PlayButton, PauseButton } from './styled'

const Container = styled.div`
  width: 100%;

  > video {
    width: 100%;
    height: 100%;
    max-height: 50vh;
    object-fit: contain;
  }
`

const Duration = styled.div`
  color: #666;
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

const MarkContainer = styled.div<{ $left: string }>`
  position: absolute;
  top: 20px;
  left: ${(props) => props?.$left ?? '0px'};
  transform: translateX(-50%);

  &:focus {
    z-index: 10;
  }
`

const defaultDuration = 10 // seconds

function CaptionEditor({
  videoObj,
  captions: _captions = [],
  onChange,
}: {
  videoObj: {
    src: string
    type?: string
  }
  captions: CaptionState[]
  onChange: (arg0: { captions?: CaptionState[]; duration?: number }) => void
}) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const progressRef = useRef<HTMLProgressElement>(null)
  const [duration, setDuration] = useState(defaultDuration)
  const [currentTime, setCurrentTime] = useState(0)
  const [captions, setCaptions] = useState(_captions)

  useEffect(() => {
    const video = videoRef.current

    const onLoadedMetadata = () => {
      console.log('onLoadedMetadata is triggered.')
      if (video?.duration) {
        setDuration(video.duration)
        onChange({
          duration: video.duration,
        })
      }
    }

    if (video) {
      if (video.readyState > 0) {
        setDuration(video.duration)
        onChange({
          duration: video.duration,
        })
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
      if (!progress?.getAttribute('max') && video?.duration) {
        progress?.setAttribute('max', video.duration.toString())
      }
      if (progress && video?.currentTime) {
        progress.value = video.currentTime
        setCurrentTime(video.currentTime)
      }
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

    const handleProgressBarClick = (e: MouseEvent) => {
      if (progress && video) {
        const offsetLeft = progress.getBoundingClientRect()?.x
        const pos = (e.pageX - offsetLeft) / progress.offsetWidth
        video.currentTime = pos * video.duration
      }
    }

    if (video && progress) {
      progress.addEventListener('click', handleProgressBarClick)
    }

    return () => {
      progress?.removeEventListener('click', handleProgressBarClick)
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

  const marksJsx = captions.map((captionState, index) => {
    let startTime = captionState.startTime

    if (startTime < 0) {
      startTime = 0
    } else if (startTime > duration) {
      startTime = duration
    }

    const left = (startTime / duration) * 100

    return (
      <MarkContainer key={index} $left={left.toString() + '%'}>
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
        <source src={videoObj.src} type={videoObj.type} />
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
              return Number(currentTime.toFixed(2)) || 0
            }}
            onChange={(captionState) => {
              const newCaptions = captions.concat(captionState)
              setCaptions(newCaptions)

              onChange({ captions: newCaptions })
            }}
          />
        </div>
        <Duration>
          {currentTime.toFixed(2)}/{duration.toFixed(2)}
        </Duration>
      </Controls>
    </Container>
  )
}

export { CaptionEditor }

export default CaptionEditor
