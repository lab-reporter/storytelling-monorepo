import config from '../config'
import { graphql, list } from '@keystone-6/core'
import {
  timestamp,
  text,
  file,
  relationship,
  virtual,
} from '@keystone-6/core/fields'
import {
  createdByFilter,
  createdByHooks,
  createFileFieldHooks,
} from './utils/access-control-list'

const limit = 5
const fileFieldHooks = createFileFieldHooks(limit, config.files.storagePath)

const listConfigurations = list({
  fields: {
    name: text({
      label: '標題',
      validation: { isRequired: true },
    }),
    file: file({
      label: '檔案',
      storage: 'files',
      hooks: {
        validateInput: async (args) => {
          if (typeof fileFieldHooks.validateInput === 'function') {
            return await fileFieldHooks.validateInput(args)
          }
        },
      },
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
    description: text({
      label: '描述',
      ui: {
        displayMode: 'textarea',
      },
    }),
    created_at: timestamp({
      label: 'Created At',
      defaultValue: { kind: 'now' },
      ui: {
        createView: {
          fieldMode: 'hidden',
        },
        itemView: {
          fieldMode: 'read',
        },
      },
    }),
    updated_at: timestamp({
      label: 'Updated At',
      db: {
        updatedAt: true,
      },
      ui: {
        createView: {
          fieldMode: 'hidden',
        },
        itemView: {
          fieldMode: 'read',
        },
      },
    }),
    created_by: relationship({
      ref: 'User',
      many: false,
      ui: {
        createView: {
          fieldMode: 'hidden',
        },
        itemView: {
          fieldMode: 'read',
        },
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
