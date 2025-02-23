import config from '../config'
import { list, graphql } from '@keystone-6/core'
import {
  image,
  text,
  timestamp,
  relationship,
  virtual,
} from '@keystone-6/core/fields'
import {
  createdByFilter,
  createdByHooks,
  createImageFieldHooks,
} from './utils/access-control-list'
const limit = 5
const imageFieldHooks = createImageFieldHooks(limit, config.images.storagePath)

const listConfigurations = list({
  fields: {
    name: text({
      label: '標題',
      validation: { isRequired: true },
    }),
    imageFile: image({
      storage: 'images',
      hooks: {
        validateInput: async (args) => {
          if (typeof imageFieldHooks.validateInput === 'function') {
            return await imageFieldHooks.validateInput(args)
          }
        },
      },
    }),
    url: virtual({
      label: '照片網址',
      field: graphql.field({
        type: graphql.String,
        resolve: (item: Record<string, unknown>): string => {
          return `${config.gcs.urlPrefix}/images/${item?.imageFile_id}.${item?.imageFile_extension}`
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
    label: '上傳照片',
    listView: {
      initialColumns: ['name'],
      initialSort: { field: 'updated_at', direction: 'ASC' },
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
