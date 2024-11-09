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
import { EditStatus } from './type'

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
          width: '100px',
          height: '80px',
        }

        const newCaptions = captions.concat([caption])
        setCaptions(newCaptions)

        // reset edit status
        setEditStatus(EditStatus.DEFAULT)
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape' || event.keyCode === 27) {
        setEditStatus(EditStatus.DEFAULT)
        return
      }
    }

    // Bind the event listener
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleKeyDown)
    cardsNode?.addEventListener('mousedown', handleAddCaption)

    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
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

  const handleCaptionChange = (changedCaption: Caption | null, idx: number) => {
    setCaptions((prevCaptions) => {
      if (changedCaption === null) {
        return [...prevCaptions.slice(0, idx), ...prevCaptions.slice(idx + 1)]
      }

      return [
        ...prevCaptions.slice(0, idx),
        changedCaption,
        ...prevCaptions.slice(idx + 1),
      ]
    })
  }

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
  } else {
    captionsJsx = captions.map((caption, idx) => {
      return (
        <CaptionTextArea
          key={idx}
          caption={caption}
          onChange={(changedCaption) =>
            handleCaptionChange(changedCaption, idx)
          }
        />
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

const TextArea = styled.textarea``

function CaptionTextArea({
  className,
  caption,
  onChange,
}: {
  className?: string
  caption: Caption
  onChange: (caption: Caption | null) => void
}) {
  const [editStatus, setEditStatus] = useState(EditStatus.DEFAULT)
  const textAreaRef = useRef<HTMLTextAreaElement>(null)

  let cursorStyle = 'default'
  switch (editStatus) {
    case EditStatus.EDIT_TEXT:
      cursorStyle = 'auto'
      break
    case EditStatus.DELETABLE:
    case EditStatus.DEFAULT:
    default: {
      cursorStyle = 'default'
      break
    }
  }

  // handle `editStatus` changes
  useEffect(() => {
    const textAreaNode = textAreaRef.current

    function handleClickOutside(event: MouseEvent) {
      if (!textAreaNode?.contains(event.target as Node)) {
        // reset edit status
        setEditStatus(EditStatus.DEFAULT)
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (
        event.key === 'Delete' ||
        (event.key === 'Backspace' && editStatus === EditStatus.DELETABLE)
      ) {
        onChange(null)
        setEditStatus(EditStatus.DEFAULT)
        return
      }
    }

    // Bind the event listener
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [editStatus])

  // handle drag and drop
  useEffect(() => {
    const textAreaNode = textAreaRef.current

    if (!textAreaNode) {
      return
    }

    let isDragging = false
    let startX = 0
    let startY = 0
    let deltaX = 0
    let deltaY = 0

    function drag(event: MouseEvent) {
      console.log('drag is calling:', textAreaNode)
      if (
        (editStatus === EditStatus.DELETABLE ||
          editStatus === EditStatus.DEFAULT) &&
        textAreaNode
      ) {
        isDragging = true
        startX = event.clientX
        startY = event.clientY
        event.preventDefault()
      }
    }

    function dragging(event: MouseEvent) {
      if (isDragging && textAreaNode) {
        deltaX = event.clientX - startX
        deltaY = event.clientY - startY
        textAreaNode.style.transform = `translate(${deltaX}px, ${deltaY}px)`
      }
    }

    function drop() {
      if (isDragging && textAreaNode) {
        isDragging = false

        const left = textAreaNode.offsetLeft + deltaX
        const top = textAreaNode.offsetTop + deltaY

        const parentElement = textAreaNode.parentElement
        if (parentElement) {
          const parentWidth = parentElement.offsetWidth
          const parentHeight = parentElement.offsetHeight

          textAreaNode.style.transform = 'none'

          onChange(
            Object.assign({}, caption, {
              position: {
                left: `${parseFloat((left / parentWidth).toFixed(4)) * 100}%`,
                top: `${parseFloat((top / parentHeight).toFixed(4)) * 100}%`,
              },
            })
          )
        }
      }
    }

    textAreaNode.addEventListener('mousedown', drag)
    document.addEventListener('mousemove', dragging)
    document.addEventListener('mouseup', drop)

    return () => {
      textAreaNode.removeEventListener('mousedown', drag)
      document.removeEventListener('mousemove', dragging)
      document.removeEventListener('mouseup', drop)
    }
  }, [editStatus, caption])

  // handle textarea element resize
  useEffect(() => {
    const textAreaNode = textAreaRef.current

    if (!textAreaNode) {
      return
    }

    const resizeObserver = new ResizeObserver((entries) => {
      const entry = entries?.[0]
      if (entry) {
        const rect = entry.target.getBoundingClientRect()
        const width = `${rect.width}px`
        const height = `${rect.height}px`

        //const parentElement = entry.target.parentElement
        //const referenceWidth = parentElement?.offsetWidth || window.innerWidth
        //const referenceHeight = parentElement?.offsetHeight || window.innerHeight
        //const width = `${_width / referenceWidth * 100}%`
        //const height = `${_height / referenceHeight  * 100}%`

        if (caption.width !== width || caption.height !== height) {
          onChange({
            ...caption,
            width,
            height,
          })
        }
      }
    })

    resizeObserver.observe(textAreaNode)

    return () => {
      resizeObserver.unobserve(textAreaNode)
      resizeObserver.disconnect()
    }
  }, [caption])

  return (
    <TextArea
      ref={textAreaRef}
      className={className}
      readOnly={editStatus !== EditStatus.EDIT_TEXT}
      style={{
        position: 'absolute',
        ...caption.position,
        width: caption.width,
        height: caption.height,
        cursor: cursorStyle,
      }}
      onClick={(e) => {
        if (editStatus === EditStatus.DEFAULT) {
          e.preventDefault()
          e.stopPropagation()
          setEditStatus(EditStatus.DELETABLE)
          return
        }

        if (editStatus === EditStatus.DELETABLE) {
          return setEditStatus(EditStatus.EDIT_TEXT)
        }
      }}
      onChange={(e) => {
        const data = e.target.value
        onChange({
          ...caption,
          data,
        })
      }}
      value={caption.data}
    />
  )
}

function AddImageButton({
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
