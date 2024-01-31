import React, { useEffect, useState, useRef } from 'react'
import styled from 'styled-components'
import { AddCaptionButton } from './button'
import { CaptionMark } from './mark'
import { CaptionState } from './type'
import { PlayButton, PauseButton } from './styled'
import * as Slider from '@radix-ui/react-slider'

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

const ProgressBlock = styled.div`
  .slider__root {
    position: relative;
    display: flex;
    align-items: center;
    height: 10px;
    width: 100%;
  }

  .slider__track {
    position: relative;
    flex-grow: 1;
    background-color: #cdcdcd;
    height: 10px;
  }

  .slider__range {
    position: absolute;
    background-color: #666;
    height: 10px;
  }

  .slider__thumb {
    display: block;
    width: 10px;
    height: 10px;
    background-color: #666;
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
  videoSrc,
  captions: _captions = [],
  onChange,
}: {
  videoSrc: string
  captions: CaptionState[]
  onChange: (arg0: {
    captions?: CaptionState[]
    videoDuration?: number
  }) => void
}) {
  const videoRef = useRef<HTMLVideoElement>(null)
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
          videoDuration: video.duration,
        })
      }
    }

    if (video) {
      if (video.readyState > 0) {
        setDuration(video.duration)
        onChange({
          videoDuration: video.duration,
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
    const handleTimeUpdate = () => {
      // For mobile browsers, ensure that the progress element's max attribute is set
      if (video?.currentTime) {
        setCurrentTime(video.currentTime)
      }
    }
    if (video) {
      video.addEventListener('timeupdate', handleTimeUpdate)
    }
    return () => {
      video?.removeEventListener('timeupdate', handleTimeUpdate)
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
        <source src={videoSrc} />
      </video>
      <Controls id="video-controls">
        <ProgressAndMarksBlock>
          {marksJsx}
          <ProgressBlock>
            <Slider.Root
              className="slider__root"
              value={[currentTime]}
              max={duration}
              step={duration / 100}
              onValueChange={(value) => {
                if (videoRef.current) {
                  videoRef.current.currentTime = value[0]
                }
                setCurrentTime(value[0])
              }}
            >
              <Slider.Track className="slider__track">
                <Slider.Range className="slider__range" />
              </Slider.Track>
              <Slider.Thumb className="slider__thumb" />
            </Slider.Root>
          </ProgressBlock>
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
