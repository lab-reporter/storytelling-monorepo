import React, { useState } from 'react'
import styled from 'styled-components'
import {
  EditorState,
  RawDraftContentState, // eslint-disable-line
  convertToRaw,
  convertFromRaw,
} from 'draft-js'
import { AddButton } from './styled'
import { Drawer, DrawerController, DrawerProvider } from '@keystone-ui/modals'
import { FieldLabel, Select, TextArea, TextInput } from '@keystone-ui/fields'
import {
  RichTextEditor,
  buttonNames,
  decorator,
} from '@story-telling-reporter/draft-editor'
import {
  AlignmentEnum,
  CaptionProp,
  ConfigProp,
  WidthEnum,
  ThemeEnum,
} from './type'
import { customAlphabet } from 'nanoid'

const nanoid = customAlphabet('abcdefghiklmnopq', 10)

const disabledButtons = [
  buttonNames.code,
  buttonNames.codeBlock,
  buttonNames.newsReading,
  buttonNames.slideshow,
  buttonNames.divider,
  buttonNames.infoBox,
  buttonNames.h4,
  buttonNames.h5,
]

const alignmentOptions = [
  {
    label: '置左',
    value: AlignmentEnum.LEFT,
  },
  {
    label: '置中',
    value: AlignmentEnum.CENTER,
  },
  {
    label: '置右',
    value: AlignmentEnum.RIGHT,
  },
]

const widthOptions = [
  {
    label: '窄版',
    value: WidthEnum.NARROW,
  },
  {
    label: '寬版',
    value: WidthEnum.WIDE,
  },
]

export function CaptionInput({
  isOpen,
  onConfirm,
  onCancel,
  inputValue,
}: {
  isOpen: boolean
  onConfirm: (arg0: CaptionProp) => void
  onCancel: () => void
  inputValue: CaptionProp
}) {
  const contentState = convertFromRaw(inputValue.rawContentState)
  const [inputValueState, setInputValueState] = useState({
    id: inputValue.id,
    startTime: inputValue.startTime,
    editorState: EditorState.createWithContent(contentState, decorator),
    alignment: inputValue.alignment,
    width: inputValue.width,
    customCss: inputValue.customCss,
  })

  const selectedAlignmentValue =
    alignmentOptions.find(
      (option) => option.value === inputValueState.alignment
    ) ?? null

  const selectedWidthValue =
    widthOptions.find((option) => option.value === inputValueState.width) ??
    null

  return (
    <DrawerProvider>
      <DrawerController isOpen={isOpen}>
        <Drawer
          width="wide"
          title={`字幕設定`}
          actions={{
            cancel: {
              label: 'Cancel',
              action: () => {
                onCancel()
              },
            },
            confirm: {
              label: 'Confirm',
              action: () => {
                const { editorState, ...rest } = inputValueState  // eslint-disable-line
                onConfirm({
                  rawContentState: convertToRaw(
                    inputValueState.editorState.getCurrentContent()
                  ),
                  ...rest,
                })
              },
            },
          }}
        >
          <MarginTop />
          <FieldLabel>字幕內容</FieldLabel>
          <RichTextEditor
            disabledButtons={disabledButtons}
            editorState={inputValueState.editorState}
            onChange={(editorState: EditorState) => {
              setInputValueState((prevState) => {
                return Object.assign({}, prevState, {
                  editorState,
                })
              })
            }}
          />
          <MarginTop />
          <FieldLabel>字幕出現秒數</FieldLabel>
          <TextInput
            onChange={(e) =>
              setInputValueState((prevState) => {
                return Object.assign({}, prevState, {
                  startTime: Number(e.target.value),
                })
              })
            }
            placeholder="0"
            type="number"
            value={inputValueState.startTime.toString()}
          />
          <MarginTop />
          <FieldLabel>字幕出現位置</FieldLabel>
          <Select
            isClearable
            options={alignmentOptions}
            onChange={(option) => {
              if (option) {
                setInputValueState((prevState) => {
                  return Object.assign({}, prevState, {
                    alignment: option.value,
                  })
                })
              }
            }}
            value={selectedAlignmentValue}
          />
          <MarginTop />
          <FieldLabel>字幕寬度</FieldLabel>
          <Select
            isClearable
            options={widthOptions}
            onChange={(option) => {
              if (option) {
                setInputValueState((prevState) => {
                  return Object.assign({}, prevState, {
                    width: option.value,
                  })
                })
              }
            }}
            value={selectedWidthValue}
          />
          <MarginTop />
          <FieldLabel>客製化 CSS</FieldLabel>
          <TextArea
            onChange={(e) =>
              setInputValueState((prevState) => {
                return Object.assign({}, prevState, {
                  customCss: e.target.value,
                })
              })
            }
            type="text"
            value={inputValueState.customCss}
          />
        </Drawer>
      </DrawerController>
    </DrawerProvider>
  )
}

export function AddCaptionButton({
  className,
  onChange,
  getVideoCurrentTime,
}: {
  className?: string
  onChange: (arg0: CaptionProp) => void
  getVideoCurrentTime: () => number
}) {
  const [toShowInput, setToShowInput] = useState(false)
  const startTime = getVideoCurrentTime()
  const captionId = nanoid(5)
  const rawContentState = {
    blocks: [],
    entityMap: {},
  }
  const customCss = `
  /* 覆寫此區塊預設的 css */
  #section-${captionId} {
    /* 例如：background-color: pink; */

    /* 覆寫此區塊內圖說預設的 css */
    .draft-image-desc {
    }

    /* 覆寫此區塊內抽言預設的 css */
    .draft-blockquote {
    }

    /* 覆寫此區塊內 H2 預設的 css */
    .draft-header-two {
    }

    /* 覆寫此區塊內 H3 預設的 css */
    .draft-header-three {
    }

    /* 覆寫此區塊內內文預設的 css */
    .draft-paragraph {
    }

    /* 覆寫此區塊內超連結預設的 css */
    .draft-link {
    }

    /* 覆寫此區塊內 annotation 預設的 css */
    .annotation-wrapper {
    }
    .annotation-title {
    }
    .annotation-body {
    }
  }
`

  return (
    <React.Fragment>
      {toShowInput && (
        <CaptionInput
          onConfirm={(captionState) => {
            onChange(captionState)
            setToShowInput(false)
          }}
          onCancel={() => {
            setToShowInput(false)
          }}
          isOpen={toShowInput}
          inputValue={{
            id: captionId,
            alignment: AlignmentEnum.LEFT,
            width: WidthEnum.NARROW,
            startTime: startTime,
            customCss,
            rawContentState,
          }}
        />
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

export function ConfigInput({
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
      <FieldLabel>每滑一個視窗的高度對應影片多少秒鐘</FieldLabel>
      <TextInput
        onChange={(e) =>
          onChange(
            Object.assign({}, inputValue, {
              secondsPer100vh: Number(e.target.value),
            })
          )
        }
        placeholder="0"
        type="number"
        value={inputValue?.secondsPer100vh?.toString()}
      />
    </>
  )
}

const MarginTop = styled.div`
  margin-top: 30px;
`
