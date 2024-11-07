import React, { useState, useEffect, useRef } from 'react'
import styled from '../styled-components'
import {
  AddButton,
  DeleteButton,
  SwitchPrevButton,
  SwitchNextButton,
  ZoomInButton,
  CaptionButton,
  SmallCaptionIcon,
  ZoomOutButton,
} from './styled'
import { Drawer, DrawerController, DrawerProvider } from '@keystone-ui/modals'
import { FieldLabel, TextInput } from '@keystone-ui/fields'
import { ImgObj, Caption } from '../type'

const Container = styled.div<{ $fullScreen: boolean }>`
  background-color: #fafbfc;
  height: 400px;

  ${({ $fullScreen }) => {
    if ($fullScreen) {
      return `
        width: 100vw;
        height: 100vh;
        position: fixed;
        top: 0;
        left: 0;
      `
    }
  }}
`

const CardsContainer = styled.div`
  width: 100%;
  height: 100%;
  overflow: scroll;

  position: relative;

  > div:last-child {
    position: sticky;
    bottom: 15px;
    left: 30px;
  }
`

const Panel = styled.div`
  display: flex;
  gap: 5px;
`

const Cards = styled.div<{ $editStatus: string }>`
  display: flex;
  width: fit-content;
  min-width: 110vw;
  height: calc(100% - 80px);
  flex-wrap: nowrap;

  position: relative;

  ${({ $editStatus }) => {
    if ($editStatus === EditStatus.ADDING_TEXT) {
      return `cursor: url(https://cdn.jsdelivr.net/npm/@story-telling-reporter/react-scrollable-image/public/icons/small-caption.svg), auto;`
    }
  }}
`

const CaptionIconBlock = styled.div`
  position: absolute;
`

const Card = styled.div`
  width: fit-content;
`

const CardImg = styled.img`
  height: 90%;
`

const CardPanel = styled.div`
  height: 10%;
  display: flex;
  justify-content: center;
  gap: 6px;
`

enum EditStatus {
  DEFAULT = 'default',
  ADDING_TEXT = 'adding_text',
}

export function ScrollableImageEditor() {
  const [imgObjs, setImgObjs] = useState<ImgObj[]>([
    { url: '/static/img-6.jpg' },
  ])
  const [editStatus, setEditStatus] = useState(EditStatus.DEFAULT)
  const [captions, setCaptions] = useState<Caption[]>([])
  const [fullScreen, setFullScreen] = useState(false)
  const cardsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const cardsNode = cardsRef.current

    function handleClickOutside(event: MouseEvent) {
      if (
        cardsNode?.contains(event.target as Node) &&
        editStatus === EditStatus.ADDING_TEXT
      ) {
        // reset edit status
        setEditStatus(EditStatus.DEFAULT)
      }
    }

    function handleAddCaption(event: MouseEvent) {
      if (cardsNode && editStatus === EditStatus.ADDING_TEXT) {
        const cardsWidth = cardsNode.offsetWidth
        const cardsHeight = cardsNode.offsetHeight
        const x = event.offsetX
        const y = event.offsetY
        const caption: Caption = {
          data: '',
          position: {
            left: `${parseFloat((x / cardsWidth).toFixed(4)) * 100}%`,
            top: `${parseFloat((y / cardsHeight).toFixed(4)) * 100}%`,
          },
          width: `${parseFloat((200 / cardsWidth).toFixed(4)) * 100}%`,
          height: `${parseFloat((200 / cardsHeight).toFixed(4)) * 100}%`,
        }

        const newCaptions = captions.concat([caption])
        setCaptions(newCaptions)

        // reset edit status
        setEditStatus(EditStatus.DEFAULT)
      }
    }

    // Bind the event listener
    document.addEventListener('mousedown', handleClickOutside)
    cardsNode?.addEventListener('mousedown', handleAddCaption)

    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener('mousedown', handleClickOutside)
      cardsNode?.removeEventListener('mousedown', handleAddCaption)
    }
  }, [cardsRef, editStatus, captions])

  const cardsJsx = imgObjs.map((imgObj, idx) => {
    return (
      <Card key={idx}>
        <CardImg src={imgObj.url} />
        <CardPanel>
          <span>{`${idx + 1}`.padStart(3, '00')}</span>
          <SwitchNextButton
            disabled={idx === imgObjs.length - 1}
            onClick={() => {
              // switch the target image with the next one
              const nextImg = imgObjs.slice(idx + 1, idx + 2)[0]
              if (nextImg) {
                const currentImg = imgObjs.slice(idx, idx + 1)[0]
                const newImgObjs = [
                  ...imgObjs.slice(0, idx),
                  nextImg,
                  currentImg,
                  ...imgObjs.slice(idx + 2, imgObjs.length),
                ]
                setImgObjs(newImgObjs)
              }
            }}
          />
          <SwitchPrevButton
            disabled={idx === 0}
            onClick={() => {
              // switch the target image with the previous one
              const previousImg = imgObjs.slice(idx - 1, idx)[0]
              if (previousImg) {
                const currentImg = imgObjs.slice(idx, idx + 1)[0]
                const newImgObjs = [
                  ...imgObjs.slice(0, idx - 1),
                  currentImg,
                  previousImg,
                  ...imgObjs.slice(idx + 1, imgObjs.length),
                ]
                setImgObjs(newImgObjs)
              }
            }}
          />
          <DeleteButton
            onClick={() => {
              // delete the image
              const newImgObjs = [
                ...imgObjs.slice(0, idx),
                ...imgObjs.slice(idx + 1, imgObjs.length),
              ]

              setImgObjs(newImgObjs)
            }}
          />
        </CardPanel>
      </Card>
    )
  })

  let captionsJsx = null

  if (!fullScreen) {
    captionsJsx = captions.map((caption, idx) => {
      return (
        <CaptionIconBlock
          key={idx}
          style={{
            left: caption.position.left,
            top: caption.position.top,
          }}
        >
          <SmallCaptionIcon style={{ cursor: 'auto' }} />
        </CaptionIconBlock>
      )
    })
  }

  const zoomButtonJsx = fullScreen ? (
    <ZoomOutButton
      style={{
        width: '50px',
        height: '50px',
      }}
      onClick={() => {
        setFullScreen(false)
      }}
    />
  ) : (
    <ZoomInButton
      style={{
        width: '50px',
        height: '50px',
      }}
      onClick={() => {
        setFullScreen(true)
      }}
    />
  )

  return (
    <Container $fullScreen={fullScreen}>
      <CardsContainer>
        <Cards $editStatus={editStatus} ref={cardsRef}>
          {captionsJsx}
          {cardsJsx}
        </Cards>
        <Panel>
          {zoomButtonJsx}
          <AddImageButton
            onChange={(imgUrl) => {
              const newImgObjs = imgObjs.concat([
                {
                  url: imgUrl,
                },
              ])
              setImgObjs(newImgObjs)
            }}
          />
          <CaptionButton
            focus={editStatus === EditStatus.ADDING_TEXT}
            onClick={() => setEditStatus(EditStatus.ADDING_TEXT)}
          />
        </Panel>
      </CardsContainer>
    </Container>
  )
}

export function AddImageButton({
  className,
  onChange,
}: {
  className?: string
  onChange: (url: string) => void
}) {
  const [toShowInput, setToShowInput] = useState(false)
  const [inputValue, setInputValue] = useState('')
  return (
    <React.Fragment>
      {toShowInput && (
        <DrawerProvider>
          <DrawerController isOpen={toShowInput}>
            <Drawer
              width="wide"
              title={`照片`}
              actions={{
                cancel: {
                  label: 'Cancel',
                  action: () => {
                    setToShowInput(false)
                  },
                },
                confirm: {
                  label: 'Confirm',
                  action: () => {
                    onChange(inputValue)
                    setToShowInput(false)
                  },
                },
              }}
            >
              <MarginTop />
              <FieldLabel>檔案URL</FieldLabel>
              <TextInput
                onChange={(e) => {
                  const url = e.target.value
                  setInputValue(url)
                }}
                type="text"
              />
            </Drawer>
          </DrawerController>
        </DrawerProvider>
      )}
      <AddButton
        className={className}
        onClick={() => {
          setToShowInput(true)
        }}
      />
    </React.Fragment>
  )
}

const MarginTop = styled.div`
  margin-top: 30px;
`
