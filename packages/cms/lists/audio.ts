import config from '../config'
import { graphql, list } from '@keystone-6/core'
import { timestamp, text, file, virtual } from '@keystone-6/core/fields'
import {
  allowAllRoles,
  allowRoles,
  RoleEnum,
} from './utils/access-control-list'

const listConfigurations = list({
  graphql: {
    plural: 'Audios',
  },
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
      label: '音檔網址',
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
    label: 'Audio（音檔）',
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
