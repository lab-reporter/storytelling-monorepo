import { list } from '@keystone-6/core'
import { image, text, timestamp, relationship } from '@keystone-6/core/fields'
import {
  createdByFilter,
  createdByHooks,
  createStorageHooks,
} from './utils/access-control-list'
const limit = 5
const storageHooks = createStorageHooks('Photo', limit)

const listConfigurations = list({
  fields: {
    name: text({
      label: '標題',
      validation: { isRequired: true },
    }),
    imageFile: image({
      storage: 'images',
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
    validateInput: async (args) => {
      if (typeof storageHooks.validateInput === 'function') {
        await storageHooks?.validateInput(args)
      }
    },
  },
})

export default listConfigurations
