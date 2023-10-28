import React, { useState } from 'react'
import styled from 'styled-components'
import { AtomicBlockProps } from '../block-renderer-fn.type'
import {
  ImageSelectorOnChangeFn,
  ImageSelector,
  ImageEntityWithMeta,
} from '../buttons/selector/image-selector'
import { EditButton, EditableBlock as _EditableBlock } from './styled'
import { blockRenderers } from '@stroy-telling-reporter/draft-renderer'

const { ImageInArticleBody } = blockRenderers

const StyledImage = styled(ImageInArticleBody)``

const EditableBlock = styled(_EditableBlock)`
  &:hover {
    ${StyledImage} {
      background-color: #f0f0f0;
      opacity: 0.3;
    }
`

type EntityData = ImageEntityWithMeta & {
  alignment?: string
}

export function EditableImage(props: AtomicBlockProps<EntityData>) {
  const [isSelectorOpen, setIsSelectorOpen] = useState(false)
  const { block, blockProps, contentState } = props
  const { onEditStart, onEditFinish } = blockProps
  const entityKey = block.getEntityAt(0)
  const entity = contentState.getEntity(entityKey)
  const data = entity.getData() || {}
  const {alignment: _alignment, ...imageWithMeta} = data // eslint-disable-line

  const onChange: ImageSelectorOnChangeFn = (selectedImages, alignment) => {
    // close `ImageSelector`
    setIsSelectorOpen(false)

    if (selectedImages?.length === 0) {
      onEditFinish()
      return
    }

    const selectedImage = selectedImages?.[0]

    onEditFinish({
      entityKey,
      entityData: Object.assign({ alignment: alignment }, selectedImage),
    })
  }

  return (
    <React.Fragment>
      {isSelectorOpen && (
        <ImageSelector
          onChange={onChange}
          enableCaption={true}
          enableAlignment={true}
          alignment={data.alignment}
          selected={[imageWithMeta]}
        />
      )}
      <EditableBlock>
        <StyledImage data={data} />
        <EditButton
          onClick={() => {
            // call `onEditStart` prop as we are trying to update the blockquote entity
            onEditStart()
            // open `BlockquoteInput`
            setIsSelectorOpen(true)
          }}
        >
          <i className="fa-solid fa-pen"></i>
          <span>Modify</span>
        </EditButton>
      </EditableBlock>
    </React.Fragment>
  )
}
