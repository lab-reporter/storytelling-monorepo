import { AtomicBlockProps } from './block-renderer-fn.type'
import { ContentBlock } from 'draft-js'
import { EditableEmbeddedCode } from './block-renderers/embedded-code'
import { EditableImage } from './block-renderers/image'
import { EditableImageLink } from './block-renderers/image-link'

const AtomicBlock: React.FC<AtomicBlockProps<any>> = (props) => {
  const entity = props.contentState.getEntity(props.block.getEntityAt(0))

  const entityType = entity.getType()

  switch (entityType) {
    case 'IMAGE': {
      return EditableImage(props)
    }
    case 'IMAGE_LINK': {
      return EditableImageLink(props)
    }
    case 'EMBEDDEDCODE': {
      return EditableEmbeddedCode(props)
    }
  }
  return null
}

export function atomicBlockRenderer(block: ContentBlock) {
  if (block.getType() === 'atomic') {
    return {
      component: AtomicBlock,
      editable: false,
      props: {},
    }
  }

  return null
}
