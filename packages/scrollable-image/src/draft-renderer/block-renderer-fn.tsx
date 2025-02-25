import { ContentState, ContentBlock } from 'draft-js'
import { blockRenderers } from './block-renderers'
const { ImageBlock, ImageLink, EmbeddedCodeBlock } = blockRenderers

const AtomicBlock = (props: {
  contentState: ContentState
  block: ContentBlock
}) => {
  const entity = props.contentState.getEntity(props.block.getEntityAt(0))

  const entityType = entity.getType()
  const entityData = entity.getData()

  switch (entityType) {
    case 'IMAGE': {
      return ImageBlock({ data: entityData })
    }
    case 'IMAGE_LINK': {
      return ImageLink({ data: entityData })
    }
    case 'EMBEDDEDCODE': {
      return EmbeddedCodeBlock({ data: entityData })
    }
  }
  return null
}

export function atomicBlockRenderer(block: ContentBlock) {
  if (block.getType() === 'atomic') {
    return {
      component: AtomicBlock,
      editable: false,
    }
  }

  return null
}
