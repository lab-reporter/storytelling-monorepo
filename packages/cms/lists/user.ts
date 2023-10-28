import { list } from '@keystone-6/core'
import { text, password, select, timestamp } from '@keystone-6/core/fields'
import {
  allowAllRoles,
  allowRoles,
  RoleEnum,
} from './utils/access-control-list'

const listConfigurations = list({
  fields: {
    name: text({
      label: '姓名',
      validation: { isRequired: true },
    }),
    email: text({
      label: 'Email',
      validation: { isRequired: true },
      isIndexed: 'unique',
      isFilterable: true,
    }),
    password: password({
      label: '密碼',
      validation: { isRequired: true },
    }),
    role: select({
      label: '角色權限',
      type: 'string',
      options: [
        {
          label: RoleEnum.Owner,
          value: RoleEnum.Owner,
        },
        {
          label: RoleEnum.Admin,
          value: RoleEnum.Admin,
        },
        {
          label: RoleEnum.Developer,
          value: RoleEnum.Developer,
        },
        {
          label: RoleEnum.Editor,
          value: RoleEnum.Editor,
        },
        {
          label: RoleEnum.Contributor,
          value: RoleEnum.Contributor,
        },
        {
          label: RoleEnum.FrontendHeadlessAccount,
          value: RoleEnum.FrontendHeadlessAccount,
        },
        {
          label: RoleEnum.PreviewHeadlessAccount,
          value: RoleEnum.PreviewHeadlessAccount,
        },
      ],
      validation: { isRequired: true },
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
    listView: {
      initialColumns: ['name', 'role'],
    },
  },
  access: {
    operation: {
      query: allowAllRoles(),
      create: allowRoles([RoleEnum.Owner, RoleEnum.Admin]),
      update: allowRoles([RoleEnum.Owner, RoleEnum.Admin]),
      delete: allowRoles([RoleEnum.Owner, RoleEnum.Admin]),
    },
  },
  hooks: {},
})

export default listConfigurations
