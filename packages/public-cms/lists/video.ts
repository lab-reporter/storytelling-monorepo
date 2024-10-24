import config from '../config'
import { graphql, list } from '@keystone-6/core'
import {
  timestamp,
  text,
  file,
  relationship,
  virtual,
} from '@keystone-6/core/fields'
import { createdByFilter, createdByHooks } from './utils/access-control-list'

const listConfigurations = list({
  fields: {
    name: text({
      label: '標題',
      validation: { isRequired: true },
    }),
    file: file({
      label: '檔案',
      storage: 'files',
    }),
    url: virtual({
      label: '影片網址',
      field: graphql.field({
        type: graphql.String,
        resolve: (item: Record<string, unknown>): string => {
          return `${config.gcs.urlPrefix}/files/${item?.file_filename}`
        },
      }),
    }),
    coverPhoto: relationship({
      label: '首圖',
      ref: 'Photo',
    }),
    description: text({
      label: '描述',
      ui: {
        displayMode: 'textarea',
      },
    }),
    createdAt: timestamp(),
    updatedAt: timestamp({
      db: {
        updatedAt: true,
      },
    }),
  },
  ui: {
    label: '上傳影片',
    labelField: 'name',
    listView: {
      initialColumns: ['name', 'url'],
      pageSize: 50,
    },
  },
  access: {
    operation: () => true,
    filter: createdByFilter,
  },
  hooks: {
    resolveInput: (args) => {
      if (typeof createdByHooks.resolveInput === 'function') {
        return createdByHooks.resolveInput(args)
      }
      return args.resolvedData
    },
  },
})

export default listConfigurations
