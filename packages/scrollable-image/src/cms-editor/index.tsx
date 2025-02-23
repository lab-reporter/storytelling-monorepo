import React, { useCallback, useState, useEffect, useRef } from 'react'
import styled, { ThemeProvider } from '../styled-components'
import {
  AddButton,
  DeleteImgButton,
  SwitchPrevButton,
  SwitchNextButton,
  ZoomInButton,
  CaptionButton,
  SmallCaptionIcon,
  ZoomOutButton,
  OpenPreviewButton,
  ClosePreviewButton,
} from './styled'
import { EditorStateEnum, ThemeEnum } from './type'
import { CaptionTextEditor } from './caption-text-editor'
import { Drawer, DrawerController, DrawerProvider } from '@keystone-ui/modals'
import {
  FieldLabel,
  FieldDescription,
  Select,
  TextArea,
  TextInput,
} from '@keystone-ui/fields'
import { ImgObj, CaptionData } from '../type'
import { ScrollableImage } from '../scrollable-image'
import { useImmerReducer } from 'use-immer'

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
        z-index: 0;
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
  className?: string
  imgObjs: ImgObj[]
  captions: CaptionData[]
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
  const [paragraphFontSize, setParagraphFontSize] = useState('16px')
  const [history, dispatch] = useImmerReducer(historyReducer, {
    past: [],
    present: siProps,
    future: [],
  })
  const cardsRef = useRef<HTMLDivElement>(null)
  const scrollerRef = useRef<HTMLDivElement>(null)
  const imgObjs = siProps.imgObjs
  const className =
    siProps.className || 'storytelling-react-scrollable-image-container'
  const fontToImgRatio = siProps.fontToImgRatio ?? 0
  const customCss = siProps.customCss

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
        const caption: CaptionData = {
          position: {
            left: `${parseFloat((x / cardsWidth).toFixed(4)) * 100}%`,
            top: `${parseFloat((y / cardsHeight).toFixed(4)) * 100}%`,
          },
          width: `${parseFloat((100 / cardsWidth).toFixed(4)) * 100}%`,
          height: `${parseFloat((100 / cardsHeight).toFixed(4)) * 100}%`,
          rawContentState: { blocks: [], entityMap: {} },
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

  useEffect(() => {
    if (preview && customCss) {
      const attrName = 'data-scrollable-image-preview'
      // add pdf custom styles
      const head = document.head
      const fragment = document.createDocumentFragment()
      const styleEle = document.querySelector(`head > style[${attrName}]`)

      if (styleEle) {
        head.removeChild(styleEle)
      }

      const newStyleEle = document.createElement('style')
      newStyleEle.setAttribute(attrName, '')
      newStyleEle.textContent = customCss
      fragment.appendChild(newStyleEle)
      head.appendChild(fragment)
    }
  }, [preview, customCss])

  useEffect(() => {
    const calculateFontSize = () => {
      const cardsEle = cardsRef.current
      const cardsHeight = cardsEle?.clientHeight

      if (!fullScreen || !cardsHeight || !fontToImgRatio) {
        return
      }

      const fontSize = (cardsHeight * fontToImgRatio).toFixed(2) + 'px'

      setParagraphFontSize(fontSize)
    }

    calculateFontSize()

    window.addEventListener('resize', calculateFontSize)

    return () => {
      window.removeEventListener('resize', calculateFontSize)
    }
  }, [fullScreen, cardsRef, fontToImgRatio])

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
          <DeleteImgButton
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

  const handleCaptionChange = (
    changedCaption: CaptionData | null,
    idx: number
  ) => {
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

  const getParentElementWidthAndHeight = useCallback(() => {
    const cardsNode = cardsRef.current
    if (!cardsNode) {
      return {
        width: window.innerWidth,
        height: window.innerHeight,
      }
    }

    return {
      width: cardsNode.offsetWidth,
      height: cardsNode.offsetHeight,
    }
  }, [cardsRef])

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
        <CaptionTextEditor
          key={idx}
          caption={caption}
          onChange={(changedCaption) =>
            handleCaptionChange(changedCaption, idx)
          }
          getParentElementWidthAndHeight={getParentElementWidthAndHeight}
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
          className={className}
          imgObjs={imgObjs}
          captions={siProps.captions}
          height={siProps.height}
          minHeight={siProps.minHeight}
          maxHeight={siProps.maxHeight}
          darkMode={siProps.theme === ThemeEnum.DARK_MODE}
          scrollerRef={scrollerRef}
          fontToImgRatio={fontToImgRatio}
        />
        <div style={{ height: '50vh', width: '1px' }} />
      </PreviewContainer>
    )
  }

  return (
    <ThemeProvider
      theme={{
        darkMode: siProps.theme === ThemeEnum.DARK_MODE,
        paragraphFontSize,
      }}
    >
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
      {!fullScreen && (
        <ConfigInput
          inputValue={{
            height: siProps.height,
            maxHeight: siProps.maxHeight,
            minHeight: siProps.minHeight,
            theme: siProps.theme,
            customCss,
            fontToImgRatio,
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
      )}
    </ThemeProvider>
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
  customCss?: string
  fontToImgRatio?: number
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
    <div>
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
      <MarginTop />
      <FieldLabel>客製化 CSS</FieldLabel>
      <TextArea
        onChange={(e) =>
          onChange(
            Object.assign({}, inputValue, {
              customCss: e.target.value,
            })
          )
        }
        type="text"
        defaultValue={inputValue.customCss}
      />
      <MarginTop />
      <FieldLabel>字體大小與圖片高度的比例</FieldLabel>
      <FieldDescription id="config-font-to-img-ratio">
        預設值為0，代表不隨著圖片縮放調整字體大小。若值為非0，字體大小會隨著圖片縮放等比例調整；舉例：若值為0.02，而圖片高度為800px，則字體大小會是16px（800
        *
        0.02）。若使用者調整視窗大小，圖片高度變成1200px，則字體大小也會隨之變成24px（1200
        * 0.02）。
      </FieldDescription>
      <TextInput
        onChange={(e) => {
          onChange(
            Object.assign({}, inputValue, {
              fontToImgRatio: parseFloat(e.target.value),
            })
          )
        }}
        type="text"
        defaultValue={inputValue?.fontToImgRatio}
      />
      <MarginTop />
    </div>
  )
}

const MarginTop = styled.div`
  margin-top: 30px;
`
