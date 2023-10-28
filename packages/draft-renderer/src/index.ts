import blockRenderMaps from './block-render-maps/index'
import {
  DraftRenderer,
  ArticleBodyDraftRenderer,
  ArticleIntroductionDraftRenderer,
  ProjectContentDraftRenderer,
} from './draft-renderer'
import { atomicBlockRenderer } from './block-renderer-fn'
import { blockRenderers } from './block-renderers'
import { decorator } from './entity-decorators/index'
import { customStyleFn } from './custom-style-fn'

const blockRenderMap = blockRenderMaps.content

export {
  ArticleBodyDraftRenderer,
  ArticleIntroductionDraftRenderer,
  DraftRenderer,
  ProjectContentDraftRenderer,
  atomicBlockRenderer,
  blockRenderMap,
  blockRenderers,
  customStyleFn,
  decorator,
}

export default {
  ArticleBodyDraftRenderer,
  ArticleIntroductionDraftRenderer,
  DraftRenderer,
  ProjectContentDraftRenderer,
  atomicBlockRenderer,
  blockRenderMap: blockRenderMaps.content,
  blockRenderers,
  customStyleFn,
  decorator,
}
