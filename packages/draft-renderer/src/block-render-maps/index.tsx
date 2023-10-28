import { blockRenderMap as blockRenderMapForAnnotation } from './annotation'
import { blockRenderMap as blockRenderMapForBrief } from './article-brief'
import { blockRenderMap as blockRenderMapForContent } from './article-content'
import {
  blockRenderMap as blockRenderMapForInfoBox,
  blockRenderMapForInfoBoxWithHeaderBorder,
} from './info-box'
import { blockRenderMap as blockRenderMapForProjectContent } from './project-content'

export default {
  annotation: blockRenderMapForAnnotation,
  // article page brief
  brief: blockRenderMapForBrief,
  // article page content
  content: blockRenderMapForContent,
  infoBox: {
    default: blockRenderMapForInfoBox,
    headerBorder: blockRenderMapForInfoBoxWithHeaderBorder,
  },
  // project page content
  projectContent: blockRenderMapForProjectContent,
}
