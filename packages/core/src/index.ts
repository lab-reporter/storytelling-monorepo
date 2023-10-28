import addManualOrderRelationshipFields from './utils/manual-order-relationship'
import { richTextEditor } from './custom-fields/rich-text-editor'

export { buttonNames as richTextEditorButtonNames } from '@stroy-telling-reporter/draft-editor'

export const customFields = {
  richTextEditor,
}

export const utils = {
  addManualOrderRelationshipFields,
}

export default {
  customFields,
  utils,
}
