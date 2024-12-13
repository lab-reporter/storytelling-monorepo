import React, { useState, useEffect, useRef } from 'react'
import throttle from 'lodash/throttle'
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
  OpenPreviewButton,
  ClosePreviewButton,
} from './styled'
import { CaptionStateEnum, EditorStateEnum, ThemeEnum } from './type'
import { Drawer, DrawerController, DrawerProvider } from '@keystone-ui/modals'
import {
  FieldLabel,
  FieldDescription,
  Select,
  TextInput,
} from '@keystone-ui/fields'
import { ImgObj, Caption } from '../type'
//import {
//  LexicalTextEditor,
//  emptyEditorStateJSONString,
//} from './lexical-text-editor/index'
import { ScrollableImage } from '../scrollable-image'
import { useImmerReducer } from 'use-immer'

const _ = {
  throttle,
}

const PreviewContainer = styled.div`
  width: 100vw;
  height: 100vh;
  overflow: scroll;
  position: fixed;
  top: 0;
  left: 0;
  background-color: #fafbfc;
`

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
        z-index: 1;
      `
    }
  }}
`

const CardsContainer = styled.div`
  width: 100%;
  height: 100%;
  overflow: scroll;

  position: relative;

  user-select: none;
`

const Panel = styled.div`
  display: flex;
  gap: 5px;
  position: sticky;
  left: 30px;
`

const Cards = styled.div<{ $editorState: string }>`
  display: flex;
  width: fit-content;
  min-width: calc(100% + 1px);
  height: calc(
    100% - 110px
  ); /* 110px is sticky Panel's height (50px) + its margins (60px) */
  flex-wrap: nowrap;

  position: relative;

  margin-bottom: 50px;

  ${({ $editorState }) => {
    if ($editorState === EditorStateEnum.ADDING_TEXT) {
      return `cursor: url(https://cdn.jsdelivr.net/npm/@story-telling-reporter/react-scrollable-image/public/icons/small-caption.svg), auto;`
    }
  }}
`

const CaptionIconBlock = styled.div`
  position: absolute;
`

const Card = styled.div`
  width: fit-content;
  height: 100%;
`

const CardImg = styled.img`
  width: auto;
  height: 100%;
`

const CardPanel = styled.div`
  height: 10%;
  display: flex;
  justify-content: center;
  gap: 6px;
`

type HistoryDraft = {
  past: ScrollableImageEditorProps[]
  present: ScrollableImageEditorProps
  future: ScrollableImageEditorProps[]
}

type HistoryAction = {
  type: 'edit' | 'undo' | 'redo'
  payload?: ScrollableImageEditorProps
}

function historyReducer(draft: HistoryDraft, action: HistoryAction) {
  switch (action.type) {
    case 'edit': {
      if (!action.payload) {
        return
      }

      draft.past.push(draft.present)
      draft.present = action.payload
      draft.future = []
      return
    }
    case 'undo': {
      if (draft.past.length === 0) {
        return
      }

      const previous = draft.past.pop()
      draft.future.unshift(draft.present)
      if (previous) {
        draft.present = previous
      }
      return
    }
    case 'redo': {
      if (draft.future.length === 0) {
        return
      }
      const next = draft.future.shift()
      draft.past.push(draft.present)
      if (next) {
        draft.present = next
      }
      return
    }
  }
}

export type ScrollableImageEditorProps = {
  imgObjs: ImgObj[]
  captions: Caption[]
} & ConfigProp

export function ScrollableImageEditor({
  onChange,
  ...siProps
}: ScrollableImageEditorProps & {
  onChange: (arg: ScrollableImageEditorProps) => void
}) {
  const [editorState, setEditorState] = useState(EditorStateEnum.DEFAULT)
  const [fullScreen, setFullScreen] = useState(false)
  const [preview, setPreview] = useState(false)
  const [history, dispatch] = useImmerReducer(historyReducer, {
    past: [],
    present: siProps,
    future: [],
  })
  const cardsRef = useRef<HTMLDivElement>(null)
  const scrollerRef = useRef<HTMLDivElement>(null)
  const imgObjs = siProps.imgObjs

  // Handle `history` changed.
  // When users redo, undo or add a new record of history,
  // we should tell the parent element to update the editor state via `onChange` function.
  useEffect(() => {
    onChange(history.present)
  }, [history.present, onChange])

  // Bind event listeners to add captions
  useEffect(() => {
    const cardsNode = cardsRef.current

    // When user clicks other places rather than the editor
    function handleClickOutside(event: MouseEvent) {
      if (
        cardsNode?.contains(event.target as Node) &&
        editorState === EditorStateEnum.ADDING_TEXT
      ) {
        // reset edit status
        setEditorState(EditorStateEnum.DEFAULT)
      }
    }

    function handleAddCaption(event: MouseEvent) {
      if (cardsNode && editorState === EditorStateEnum.ADDING_TEXT) {
        const rect = (
          event.currentTarget as HTMLElement
        ).getBoundingClientRect()
        const x = event.clientX - rect.left
        const y = event.clientY - rect.top
        const cardsWidth = cardsNode.offsetWidth
        const cardsHeight = cardsNode.offsetHeight
        const caption: Caption = {
          data: '',
          position: {
            left: `${parseFloat((x / cardsWidth).toFixed(4)) * 100}%`,
            top: `${parseFloat((y / cardsHeight).toFixed(4)) * 100}%`,
          },
          width: '100px',
          height: '152px',
        }

        const newCaptions = siProps.captions.concat([caption])
        const payload = Object.assign({}, siProps, {
          captions: newCaptions,
        })

        onChange(payload)

        dispatch({
          type: 'edit',
          payload,
        })

        // reset edit status
        setEditorState(EditorStateEnum.DEFAULT)
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape' || event.keyCode === 27) {
        setEditorState(EditorStateEnum.DEFAULT)
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
  }, [cardsRef, editorState, siProps, onChange, dispatch])

  // Add event listeners for undo and redo
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      const isCtrlOrCmd = event.ctrlKey || event.metaKey

      // handle redo keys: ctrl + shift + z
      if (isCtrlOrCmd && event.shiftKey && event.key.toLowerCase() === 'z') {
        event.preventDefault()
        return dispatch({
          type: 'redo',
        })
      }

      // handle undo keys: ctrl + z
      if (isCtrlOrCmd && event.key.toLowerCase() === 'z') {
        event.preventDefault()
        return dispatch({
          type: 'undo',
        })
      }
    }

    if (fullScreen) {
      // Bind the event listener
      document.addEventListener('keydown', handleKeyDown)
    }

    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [fullScreen, dispatch, onChange])

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
                const payload = Object.assign({}, siProps, {
                  imgObjs: newImgObjs,
                })
                onChange(payload)
                dispatch({
                  type: 'edit',
                  payload,
                })
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
                const payload = Object.assign({}, siProps, {
                  imgObjs: newImgObjs,
                })
                onChange(payload)
                dispatch({
                  type: 'edit',
                  payload,
                })
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

              const payload = Object.assign({}, siProps, {
                imgObjs: newImgObjs,
              })
              onChange(payload)
              dispatch({
                type: 'edit',
                payload,
              })
            }}
          />
        </CardPanel>
      </Card>
    )
  })

  let captionsJsx = null

  const handleCaptionChange = (changedCaption: Caption | null, idx: number) => {
    let newCaptions = []
    const prevCaptions = siProps.captions
    if (changedCaption === null) {
      newCaptions = [
        ...prevCaptions.slice(0, idx),
        ...prevCaptions.slice(idx + 1),
      ]
    } else {
      newCaptions = [
        ...prevCaptions.slice(0, idx),
        changedCaption,
        ...prevCaptions.slice(idx + 1),
      ]
    }

    const payload = Object.assign({}, siProps, {
      captions: newCaptions,
    })

    onChange(payload)
    dispatch({
      type: 'edit',
      payload,
    })
  }

  if (!fullScreen) {
    captionsJsx = siProps.captions.map((caption, idx) => {
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
    captionsJsx = siProps.captions.map((caption, idx) => {
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
      onClick={() => {
        setFullScreen(false)
      }}
    />
  ) : (
    <ZoomInButton
      onClick={() => {
        setFullScreen(true)
      }}
    />
  )

  if (preview) {
    return (
      <PreviewContainer ref={scrollerRef}>
        <ClosePreviewButton
          style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            zIndex: '10',
          }}
          onClick={() => {
            setPreview(false)
          }}
        />
        <div style={{ height: '50vh', width: '1px' }} />
        <ScrollableImage
          imgObjs={imgObjs}
          captions={siProps.captions}
          height={siProps.height}
          minHeight={siProps.minHeight}
          maxHeight={siProps.maxHeight}
          darkMode={siProps.theme === ThemeEnum.DARK_MODE}
          scrollerRef={scrollerRef}
        />
        <div style={{ height: '50vh', width: '1px' }} />
      </PreviewContainer>
    )
  }

  return (
    <div>
      <Container $fullScreen={fullScreen}>
        <CardsContainer>
          <Cards $editorState={editorState} ref={cardsRef}>
            {captionsJsx}
            {cardsJsx}
          </Cards>
          <Panel>
            {zoomButtonJsx}
            <OpenPreviewButton
              onClick={() => {
                setPreview(true)
              }}
            />
            <AddImageButton
              onChange={(imgUrl) => {
                const newImgObjs = imgObjs.concat([
                  {
                    url: imgUrl,
                  },
                ])
                const payload = Object.assign({}, siProps, {
                  imgObjs: newImgObjs,
                })
                onChange(payload)
                dispatch({
                  type: 'edit',
                  payload,
                })
              }}
            />
            <CaptionButton
              focus={editorState === EditorStateEnum.ADDING_TEXT}
              onClick={() => setEditorState(EditorStateEnum.ADDING_TEXT)}
            />
          </Panel>
        </CardsContainer>
      </Container>
      <ConfigInput
        inputValue={{
          height: siProps.height,
          maxHeight: siProps.maxHeight,
          minHeight: siProps.minHeight,
          theme: siProps.theme,
        }}
        onChange={(updated) => {
          const payload = Object.assign({}, siProps, updated)
          onChange(payload)
          // Uncomment the follwing lines if we need to undo/redo configure settings
          //dispatch({
          //  type: 'edit',
          //  payload,
          //})
        }}
      />
    </div>
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
  const [captionState, setCaptionState] = useState(CaptionStateEnum.DEFAULT)
  const clickTsRef = useRef<number>(0)
  const textAreaRef = useRef<HTMLTextAreaElement>(null)

  let cursorStyle = 'default'
  switch (captionState) {
    case CaptionStateEnum.EDIT_TEXT:
      cursorStyle = 'auto'
      break
    case CaptionStateEnum.FOCUS:
    case CaptionStateEnum.DEFAULT:
    default: {
      cursorStyle = 'default'
      break
    }
  }

  // handle `captionState` changes
  useEffect(() => {
    const textAreaNode = textAreaRef.current

    function handleClickOutside(event: MouseEvent) {
      if (!textAreaNode?.contains(event.target as Node)) {
        // reset edit status
        setCaptionState(CaptionStateEnum.DEFAULT)
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (
        event.key === 'Delete' ||
        (event.key === 'Backspace' && captionState === CaptionStateEnum.FOCUS)
      ) {
        onChange(null)
        setCaptionState(CaptionStateEnum.DEFAULT)
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
  }, [captionState, onChange])

  // Handle drag and drop,
  // and re-calculate `CaptionTextArea` positions.
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
      if (captionState === CaptionStateEnum.FOCUS && textAreaNode) {
        isDragging = true
        startX = event.clientX
        startY = event.clientY
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

        const parentElement = textAreaNode.parentElement // `parentElement` should be `Cards` element
        if (parentElement) {
          const parentWidth = parentElement.offsetWidth
          const parentHeight = parentElement.offsetHeight

          textAreaNode.style.transform = 'none'

          onChange(
            Object.assign({}, caption, {
              // re-calculate caption positions.
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
  }, [captionState, caption, onChange])

  // handle textarea element resize
  useEffect(() => {
    const textAreaNode = textAreaRef.current

    if (!textAreaNode) {
      return
    }

    const resizeObserver = new ResizeObserver(
      _.throttle((entries) => {
        const entry = entries?.[0]
        if (entry) {
          const minWidth = 20
          const minHeight = 20
          const rect = entry.target.getBoundingClientRect()

          // @TODO to support RWD.
          // Currently unit is `px`, which is not responsive.
          // We might need to change the unit to `vh`.
          const width =
            rect.width > minWidth ? `${rect.width}px` : `${minWidth}px`
          const height =
            rect.height > minHeight ? `${rect.height}px` : `${minHeight}px`

          if (caption.width !== width || caption.height !== height) {
            onChange({
              ...caption,
              width,
              height,
            })
          }
        }
      }, 2000)
    )

    resizeObserver.observe(textAreaNode)

    return () => {
      resizeObserver.unobserve(textAreaNode)
      resizeObserver.disconnect()
    }
  }, [caption, onChange])

  return (
    <TextArea
      ref={textAreaRef}
      className={className}
      readOnly={captionState !== CaptionStateEnum.EDIT_TEXT}
      style={{
        position: 'absolute',
        ...caption.position,
        width: caption.width,
        height: caption.height,
        cursor: cursorStyle,
        border:
          captionState === CaptionStateEnum.FOCUS
            ? '1px solid blue'
            : 'inherit',
      }}
      onClick={() => {
        if (captionState === CaptionStateEnum.DEFAULT) {
          clickTsRef.current = Date.now()
          setCaptionState(CaptionStateEnum.FOCUS)
          return
        }

        const timeElapsed = 300
        // Double click to enter EDIT_TEXT state
        if (
          captionState === CaptionStateEnum.FOCUS &&
          Date.now() - clickTsRef.current < timeElapsed
        ) {
          return setCaptionState(CaptionStateEnum.EDIT_TEXT)
        } else {
          clickTsRef.current = Date.now()
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

type ConfigProp = {
  height?: string
  maxHeight?: string
  minHeight?: string
  theme?: ThemeEnum
}

const themeOptions = [
  {
    label: 'Light Mode',
    value: ThemeEnum.LIGHT_MODE,
  },
  {
    label: 'Dark Mode',
    value: ThemeEnum.DARK_MODE,
  },
]

function ConfigInput({
  inputValue,
  onChange,
}: {
  inputValue: ConfigProp
  onChange: (arg: ConfigProp) => void
}) {
  const selectedThemeValue =
    themeOptions.find((option) => option.value === inputValue.theme) ?? null

  return (
    <>
      <MarginTop />
      <FieldLabel>圖片高度</FieldLabel>
      <FieldDescription id="height">
        預設值為100vh，圖片的高度會與視窗等高（滿版）。
      </FieldDescription>
      <TextInput
        onChange={(e) => {
          onChange(
            Object.assign({}, inputValue, {
              height: e.target.value,
            })
          )
        }}
        type="text"
        defaultValue={inputValue?.height}
      />
      <MarginTop />
      <FieldLabel>圖片最大高度</FieldLabel>
      <FieldDescription id="config-max-height">
        預設為不設定。此設定適用於大螢幕，當「圖片高度」設定成100vh時，圖片會與螢幕等高，可能造成圖片過大；而此設定可以限制圖片高度。例如：設定「圖片最大高度」為800px時，螢幕若高於800px，則圖片不會跟著一起變大，而是停留在800px高。
      </FieldDescription>
      <TextInput
        onChange={(e) => {
          onChange(
            Object.assign({}, inputValue, {
              maxHeight: e.target.value,
            })
          )
        }}
        type="text"
        defaultValue={inputValue?.maxHeight}
      />
      <MarginTop />
      <FieldLabel>圖片最小高度</FieldLabel>
      <FieldDescription id="config-min-height">
        預設為不設定。此設定適用於螢幕高度太小的情況，當「圖片高度」設定成100vh時，圖片會與螢幕等高，可能造成圖片過小；而此設定可以限制圖片高度。例如：設定「圖片最小高度」為500px時，螢幕高度若低於500px，則圖片不會跟著一起變小，而是停留在500px高。
      </FieldDescription>
      <TextInput
        onChange={(e) => {
          onChange(
            Object.assign({}, inputValue, {
              minHeight: e.target.value,
            })
          )
        }}
        type="text"
        defaultValue={inputValue?.minHeight}
      />
      <MarginTop />
      <FieldLabel>主題色</FieldLabel>
      <Select
        isClearable
        options={themeOptions}
        onChange={(option) => {
          if (option) {
            onChange(
              Object.assign({}, inputValue, {
                theme: option.value,
              })
            )
          }
        }}
        value={selectedThemeValue}
      />
    </>
  )
}

const MarginTop = styled.div`
  margin-top: 30px;
`
