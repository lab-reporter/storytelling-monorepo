import { list } from '@keystone-6/core'
import { image, text, timestamp } from '@keystone-6/core/fields'
import { createdByFilter, createdByHooks } from './utils/access-control-list'

const listConfigurations = list({
  fields: {
    name: text({
      label: '標題',
      validation: { isRequired: true },
    }),
    imageFile: image({
      storage: 'images',
    }),
    createdAt: timestamp({
      defaultValue: { kind: 'now' },
    }),
    updatedAt: timestamp({
      db: {
        updatedAt: true,
      },
    }),
  },
  ui: {
    label: '上傳照片',
    listView: {
      initialColumns: ['name'],
      initialSort: { field: 'updatedAt', direction: 'ASC' },
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
