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
  allowAllRoles,
  allowRoles,
  RoleEnum,
} from './utils/access-control-list'

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
    createdAt: timestamp({
      defaultValue: { kind: 'now' },
      ui: {
        itemView: {
          fieldMode: 'read',
        },
      },
    }),
    updatedAt: timestamp({
      db: {
        updatedAt: true,
      },
      ui: {
        itemView: {
          fieldMode: 'read',
        },
      },
    }),
  },
  ui: {
    label: 'Video（影片）',
    labelField: 'name',
    listView: {
      initialColumns: ['name', 'url'],
      pageSize: 50,
    },
  },

  access: {
    operation: {
      query: allowAllRoles(),
      create: allowRoles([
        RoleEnum.Owner,
        RoleEnum.Admin,
        RoleEnum.Editor,
        RoleEnum.Contributor,
      ]),
      update: allowRoles([RoleEnum.Owner, RoleEnum.Admin, RoleEnum.Editor]),
      delete: allowRoles([RoleEnum.Owner, RoleEnum.Admin, RoleEnum.Editor]),
    },
  },

  hooks: {},
})

export default listConfigurations
