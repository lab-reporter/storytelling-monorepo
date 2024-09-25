import * as Slider from '@radix-ui/react-slider'
import React, { useEffect, useState, useRef } from 'react'
import styled from '../styled-components'
import { AddCaptionButton, CaptionInput, ConfigInput } from './input'
import { AlertDialog } from '@keystone-ui/modals'
import { CaptionMark } from './mark'
import { CaptionState, ConfigProp, ThemeEnum } from './type'
import {
  PlayButton,
  PauseButton,
  ZoomInButton,
  ZoomOutButton as _ZoomOutButton,
} from './styled'
import { ScrollableVideo } from '../v2/index'

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

enum BehaviorAction {
  Edit = 'edit',
  Remove = 'remove',
  Nothing = 'nothing',
}

const defaultDuration = 10 // seconds

export type ScrollableVideoEditorProps = {
  captions: CaptionState[]
  videoSrc: string
  videoDuration: number
} & ConfigProp

function ScrollableVideoEditor({
  onChange,
  ...svProp
}: ScrollableVideoEditorProps & {
  onChange: (arg: ScrollableVideoEditorProps) => void
}) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const scrollerRef = useRef<HTMLDivElement>(null)
  const [duration, setDuration] = useState(defaultDuration)
  const [currentTime, setCurrentTime] = useState(0)
  const [captions, setCaptions] = useState(svProp.captions || [])
  const [fullScreen, setFullScreen] = useState(false)
  const [userBehaviorState, setUserBehaviorState] = useState({
    action: BehaviorAction.Nothing,
    captionIdx: -1,
  })

  useEffect(() => {
    const video = videoRef.current

    const onLoadedMetadata = () => {
      console.log('onLoadedMetadata is triggered.')
      if (video?.duration) {
        setDuration(video.duration)
        onChange(
          Object.assign({}, svProp, {
            videoDuration: video.duration,
          })
        )
      }
    }

    if (video) {
      if (video.readyState > 0) {
        setDuration(video.duration)
        onChange(
          Object.assign({}, svProp, {
            videoDuration: video.duration,
          })
        )
        return
      }

      video.addEventListener('loadedmetadata', onLoadedMetadata)
    }

    // clear event listeners
    return () => {
      video?.removeEventListener('loadedmetadata', onLoadedMetadata)
    }
  }, [svProp])

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

  const marksJsx = captions.map((caption, index) => {
    let startTime = caption.startTime

    if (startTime < 0) {
      startTime = 0
    } else if (startTime > duration) {
      startTime = duration
    }

    const left = (startTime / duration) * 100

    return (
      <MarkContainer key={index} $left={left.toString() + '%'}>
        <CaptionMark
          captionIdx={index}
          onEdit={(captionIdx: number) => {
            setUserBehaviorState({
              action: BehaviorAction.Edit,
              captionIdx,
            })
          }}
          onRemove={(captionIdx: number) => {
            setUserBehaviorState({
              action: BehaviorAction.Remove,
              captionIdx,
            })
          }}
        />
      </MarkContainer>
    )
  })

  const editJsx =
    userBehaviorState.action === BehaviorAction.Edit ? (
      <CaptionInput
        isOpen={true}
        onConfirm={(caption) => {
          const newCaptions = [...captions]
          newCaptions[userBehaviorState.captionIdx] = caption
          setCaptions(newCaptions)
          onChange(Object.assign({}, svProp, { captions: newCaptions }))

          setUserBehaviorState({
            action: BehaviorAction.Nothing,
            captionIdx: -1,
          })
        }}
        onCancel={() => {
          setUserBehaviorState({
            action: BehaviorAction.Nothing,
            captionIdx: -1,
          })
        }}
        inputValue={captions[userBehaviorState.captionIdx]}
      />
    ) : null

  const deleteAlertJsx = (
    // @ts-ignore `children` should be optional
    <AlertDialog
      title="確認刪除"
      isOpen={userBehaviorState.action === BehaviorAction.Remove}
      actions={{
        cancel: {
          label: 'Cancel',
          action: () => {
            setUserBehaviorState({
              action: BehaviorAction.Nothing,
              captionIdx: -1,
            })
          },
        },
        confirm: {
          label: 'Confirm',
          action: () => {
            const newCaptions = [...captions]
            newCaptions.splice(userBehaviorState.captionIdx, 1)
            setCaptions(newCaptions)
            onChange(Object.assign({}, svProp, { captions: newCaptions }))

            setUserBehaviorState({
              action: BehaviorAction.Nothing,
              captionIdx: -1,
            })
          },
        },
      }}
    ></AlertDialog>
  )

  return (
    <>
      <Container>
        <video id="video" preload="metadata" ref={videoRef}>
          <source src={svProp.videoSrc} />
        </video>
        <Controls id="video-controls">
          <ProgressAndMarksBlock>
            {marksJsx}
            <ProgressBlock>
              <Slider.Root
                className="slider__root"
                value={[currentTime]}
                max={duration}
                step={duration / 1000}
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
              onChange={(caption) => {
                const newCaptions = captions.concat(caption)
                setCaptions(newCaptions)

                onChange(Object.assign({}, svProp, { captions: newCaptions }))
              }}
            />
          </div>
          <ZoomInButton
            onClick={() => {
              setFullScreen(!fullScreen)
            }}
          />
          <Duration>
            {currentTime.toFixed(2)}/{duration.toFixed(2)}
          </Duration>
        </Controls>
      </Container>
      <ConfigInput
        inputValue={{
          theme: svProp.theme,
          secondsPer100vh: svProp.secondsPer100vh,
        }}
        onChange={(newConfigProp) => {
          onChange(Object.assign({}, svProp, newConfigProp))
        }}
      />
      <FullScreen ref={scrollerRef} $hide={!fullScreen}>
        <ScrollableVideo
          readOnly={false}
          onEdit={(captionIdx: number) => {
            setUserBehaviorState({
              action: BehaviorAction.Edit,
              captionIdx,
            })
          }}
          onRemove={(captionIdx: number) => {
            setUserBehaviorState({
              action: BehaviorAction.Remove,
              captionIdx,
            })
          }}
          scrollerRef={scrollerRef}
          captions={captions}
          video={{
            duration,
            src: svProp.videoSrc,
            mobileSrc: svProp.videoSrc,
          }}
          darkMode={svProp.theme === ThemeEnum.DARK_MODE}
          secondsPer100vh={svProp.secondsPer100vh}
        />
        <ZoomOutButton
          $hide={!fullScreen}
          darkMode={svProp.theme === ThemeEnum.DARK_MODE}
          onClick={() => {
            setFullScreen(false)
          }}
        />
      </FullScreen>
      {editJsx}
      {deleteAlertJsx}
    </>
  )
}

const FullScreen = styled.div<{ $hide: boolean }>`
  position: fixed;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: scroll;
  ${(props) => (props.$hide ? 'top: 200vh;' : 'top: 0;')}
`

const ZoomOutButton = styled(_ZoomOutButton)<{ $hide: boolean }>`
  position: fixed;
  right: 20px;
  ${(props) => (props.$hide ? 'top: 200vh;' : 'top: 20px;')}
`

export { ScrollableVideoEditor }

export default ScrollableVideoEditor
