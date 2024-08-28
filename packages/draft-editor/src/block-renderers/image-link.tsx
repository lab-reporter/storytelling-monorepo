import React, { useState } from 'react'
import styled from 'styled-components'
import { Drawer, DrawerController } from '@keystone-ui/modals'
import { TextInput, TextArea } from '@keystone-ui/fields'
import { AtomicBlockProps } from '../block-renderer-fn.type'
import { EditableBlock } from './styled'
import { ImageBlock } from './image'

const Label = styled.label`
  display: block;
  margin: 10px 0;
  font-weight: 600;
`

export type ImageLinkValue = {
  url: string
  desc: string
}

export const ImageLinkEditor = (props: {
  isOpen: boolean
  inputValue: ImageLinkValue
  onConfirm: (arg0: ImageLinkValue) => void
  onCancel: () => void
}) => {
  const { isOpen, inputValue, onConfirm, onCancel } = props
  const [url, setURL] = useState(inputValue.url ?? '')
  const [desc, setDesc] = useState(inputValue.desc ?? '')

  return (
    <DrawerController isOpen={isOpen}>
      <Drawer
        title="Image Link"
        actions={{
          cancel: {
            label: 'Cancel',
            action: () => onCancel(),
          },
          confirm: {
            label: 'Confirm',
            action: () =>
              onConfirm({
                url: url,
                desc: desc,
              }),
          },
        }}
      >
        <Label>連結</Label>
        <TextInput
          placeholder="圖片連結"
          type="text"
          value={url}
          onChange={(e) => setURL(e.target.value)}
        />
        <Label>圖說</Label>
        <TextArea
          placeholder="圖說"
          type="text"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
        />
      </Drawer>
    </DrawerController>
  )
}

export const EditableImageLink = (props: AtomicBlockProps<ImageLinkValue>) => {
  const [isEditorOpen, setIsEditorOpen] = useState(false)
  const { block, blockProps, contentState } = props
  const { onEditStart, onEditFinish } = blockProps
  const entityKey = block.getEntityAt(0)
  const entity = contentState.getEntity(entityKey)
  const data = entity.getData() || {}
  const { url, desc } = data // eslint-disable-line

  const onChange = (inputValue: ImageLinkValue) => {
    setIsEditorOpen(false)
    onEditFinish({
      entityKey,
      entityData: inputValue,
    })
  }

  return (
    <>
      {isEditorOpen && (
        <ImageLinkEditor
          isOpen={isEditorOpen}
          inputValue={{
            url,
            desc,
          }}
          onConfirm={onChange}
          onCancel={() => {
            setIsEditorOpen(false)
            onEditFinish()
          }}
        />
      )}
      <EditableBlock
        onClick={() => {
          onEditStart()
          setIsEditorOpen(true)
        }}
      >
        <ImageBlock
          data={{
            imageFile: {
              url,
            },
            desc,
          }}
        />
      </EditableBlock>
    </>
  )
}
