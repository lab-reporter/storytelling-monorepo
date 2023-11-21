import { AtomicBlockProps } from './block-renderer-fn.type'
import { ContentBlock } from 'draft-js'
import { EditableBlockquote } from './block-renderers/blockquote'
import { EditableEmbeddedCode } from './block-renderers/embedded-code'
import { EditableImage } from './block-renderers/image'
import { EditableInfoBox } from './block-renderers/info-box'
import { EditableSlideshow } from './block-renderers/slideshow'
import { blockRenderers } from '@story-telling-reporter/draft-renderer'

const { Divider, NewsReading } = blockRenderers

const AtomicBlock: React.FC<AtomicBlockProps<any>> = (props) => {
  const entity = props.contentState.getEntity(props.block.getEntityAt(0))

  const entityType = entity.getType()
  const entityData = entity.getData()

  switch (entityType) {
    case 'BLOCKQUOTE': {
      return EditableBlockquote(props)
    }
    case 'DIVIDER': {
      return Divider()
    }
    case 'IMAGE': {
      return EditableImage(props)
    }
    case 'SLIDESHOW': {
      return EditableSlideshow(props)
    }
    case 'EMBEDDEDCODE': {
      return EditableEmbeddedCode(props)
    }
    case 'INFOBOX': {
      return EditableInfoBox(props)
    }
    case 'NEWS_READING': {
      return NewsReading({ data: entityData })
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
