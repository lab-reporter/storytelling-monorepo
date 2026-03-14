import React, { useState, useCallback } from 'react'
import { FieldProps } from '@keystone-6/core/types'
import { FieldLabel } from '@keystone-ui/fields'
import { controller } from '@keystone-6/core/fields/types/json/views'
import {
  FieldContainerWithMaxWidth,
  LayoutPickerContainer,
  PuzzlePhotoEditorContainer,
  EditorLayoutWrapper,
  EditorLayoutCell,
  ConfigPanelOverlay,
  ConfigPanel,
  ConfigPanelTitle,
  ConfigPanelForm,
  ConfigPanelFooter,
  InputGroup,
  Label,
  Input,
  ActionButton,
  CellOverlay,
  CheckIcon,
} from './styles'
import { Panel } from '../utils/containers'
import { LayoutPicker } from './layoutSelector'
import {
  AddButton,
  ZoomInButton,
  ZoomOutButton,
  EditPhotoIcon,
  DeletePhotoIcon,
  EditLayoutButton,
} from '../utils/buttons'
import {
  LayoutOption,
  LayoutProps,
  PuzzlePhotoConfig,
  Photo,
  layoutSettings,
} from './types'

export const Field = ({
  field,
  value,
  onChange: onFieldChange,
}: FieldProps<typeof controller>) => {
  const config = value ? JSON.parse(value) : { layout: '1A', photos: [] }

  const onChange = useCallback(
    (newConfig: PuzzlePhotoConfig) => {
      onFieldChange?.(JSON.stringify(newConfig))
    },
    [onFieldChange]
  )

  return (
    <FieldContainerWithMaxWidth>
      <FieldLabel>{field.label}</FieldLabel>
      <PuzzlePhotoEditorContainer>
        <PuzzlePhotoEditor onChange={onChange} {...config} />
      </PuzzlePhotoEditorContainer>
    </FieldContainerWithMaxWidth>
  )
}

function PuzzlePhotoEditor({
  onChange,
  ...initialConfig
}: PuzzlePhotoConfig & { onChange: (arg: PuzzlePhotoConfig) => void }) {
  const [layout, setLayout] = useState<LayoutOption>(
    initialConfig.layout || '1A'
  )
  const [photos, setPhotos] = useState<Photo[]>(initialConfig.photos || [])
  const [fullScreen, setFullScreen] = useState(false)
  const [layoutPickerOpen, setLayoutPickerOpen] = useState(false)
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [tempPhoto, setTempPhoto] = useState<Photo>({
    url: '',
    fitMode: 'height',
    focusPosition: 'center',
  })

  const getPhotoAt = (index: number): Photo => {
    return (
      photos[index] || { url: '', fitMode: 'height', focusPosition: 'center' }
    )
  }

  const onLayoutChange = useCallback(
    (newLayoutProps: LayoutProps) => {
      setLayout(newLayoutProps.layout)
      onChange({ ...initialConfig, ...newLayoutProps, photos })
    },
    [onChange, initialConfig, photos]
  )

  const onPhotoConfirm = () => {
    if (editingIndex !== null) {
      const newPhotos = [...photos]
      newPhotos[editingIndex] = tempPhoto
      setPhotos(newPhotos)
      onChange({
        ...initialConfig,
        ...layoutSettings[layout].props,
        photos: newPhotos,
      })
      setEditingIndex(null)
    }
  }

  const onPhotoDelete = (index: number) => {
    const newPhotos = [...photos]
    newPhotos[index] = { url: '', fitMode: 'height', focusPosition: 'center' }
    setPhotos(newPhotos)
    onChange({
      ...initialConfig,
      ...layoutSettings[layout].props,
      photos: newPhotos,
    })
  }

  const zoomButtonJsx = fullScreen ? (
    <ZoomOutButton
      onClick={() => {
        setFullScreen(false)
      }}
      style={{
        position: 'absolute',
        right: '10px',
        top: '10px',
      }}
    />
  ) : (
    <ZoomInButton
      onClick={() => {
        setFullScreen(true)
      }}
      style={{
        position: 'absolute',
        right: '10px',
        top: '10px',
        width: '50px',
        height: '50px',
        border: 'none',
        borderRadius: '12px',
        backgroundColor: '#191919',
        color: 'white',
      }}
    />
  )

  const layoutSetting = layoutSettings[layout]

  return (
    <Panel $fullScreen={fullScreen}>
      {zoomButtonJsx}
      <EditorLayoutWrapper
        cols={layoutSetting.pickerSetting.cols}
        rows={layoutSetting.pickerSetting.rows}
        inset={layoutSetting.pickerSetting.inset}
      >
        {layoutSetting.pickerSetting.cells.map((cell, index) => {
          const photo = getPhotoAt(index)
          return (
            <EditorLayoutCell key={index} col={cell.col} row={cell.row}>
              {photo.url ? (
                <img
                  src={photo.url}
                  style={{
                    width: '100%',
                    height: '100%',
                    // objectFit: photo.fitMode === 'width' ? 'contain' : 'cover',
                    objectFit: 'cover',
                    // objectPosition: photo.focusPosition,
                  }}
                />
              ) : (
                <EditLayoutButton
                  onClick={() => {
                    setEditingIndex(index)
                    setTempPhoto(getPhotoAt(index))
                  }}
                  style={{
                    width: '50px',
                    height: '50px',
                    backgroundColor: 'transparent',
                    filter: 'none',
                  }}
                />
              )}
              <CellOverlay>
                <EditPhotoIcon
                  onClick={() => {
                    setEditingIndex(index)
                    setTempPhoto(getPhotoAt(index))
                  }}
                />
                <DeletePhotoIcon onClick={() => onPhotoDelete(index)} />
              </CellOverlay>
              {photo.url && <CheckIcon />}
            </EditorLayoutCell>
          )
        })}
      </EditorLayoutWrapper>

      <AddButton
        onClick={() => {
          setLayoutPickerOpen(true)
        }}
        style={{
          position: 'absolute',
          left: '10px',
          bottom: '10px',
        }}
      />

      {layoutPickerOpen && (
        <LayoutPickerContainer>
          <LayoutPicker
            onChange={onLayoutChange}
            layout={layout}
            onClose={() => setLayoutPickerOpen(false)}
          />
        </LayoutPickerContainer>
      )}

      {editingIndex !== null && (
        <>
          <ConfigPanelOverlay onClick={() => setEditingIndex(null)} />
          <ConfigPanel>
            <ConfigPanelTitle>照片設定</ConfigPanelTitle>
            <ConfigPanelForm>
              <InputGroup>
                <Label>檔案URL</Label>
                <Input
                  value={tempPhoto.url}
                  onChange={(e) =>
                    setTempPhoto({ ...tempPhoto, url: e.target.value })
                  }
                  placeholder="輸入圖片網址"
                  autoFocus
                />
              </InputGroup>
              <InputGroup>
                <Label>以寬度或高度撐滿</Label>
                <select
                  value={tempPhoto.fitMode}
                  onChange={(e) =>
                    setTempPhoto({
                      ...tempPhoto,
                      fitMode: e.target.value as any,
                    })
                  }
                  style={{
                    padding: '8px',
                    borderRadius: '4px',
                    backgroundColor: '#252525',
                    color: 'white',
                    border: '1px solid #444',
                  }}
                >
                  <option value="width">寬度</option>
                  <option value="height">高度</option>
                </select>
              </InputGroup>
              <InputGroup>
                <Label>對焦位置</Label>
                <select
                  value={tempPhoto.focusPosition}
                  onChange={(e) =>
                    setTempPhoto({
                      ...tempPhoto,
                      focusPosition: e.target.value as any,
                    })
                  }
                  style={{
                    padding: '8px',
                    borderRadius: '4px',
                    backgroundColor: '#252525',
                    color: 'white',
                    border: '1px solid #444',
                  }}
                >
                  <option value="left">左</option>
                  <option value="center">中</option>
                  <option value="right">右</option>
                </select>
              </InputGroup>
            </ConfigPanelForm>
            <ConfigPanelFooter>
              <ActionButton primary onClick={onPhotoConfirm}>
                Confirm
              </ActionButton>
              <ActionButton onClick={() => setEditingIndex(null)}>
                Cancel
              </ActionButton>
            </ConfigPanelFooter>
          </ConfigPanel>
        </>
      )}
    </Panel>
  )
}
