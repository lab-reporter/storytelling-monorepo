import { BaseListTypeInfo, ListHooks } from '@keystone-6/core/types'

type Session = {
  data: {
    name: string
    email: string
    role: string
  }
  itemId: string
}

export const RoleEnum = {
  Owner: 'owner',
  Admin: 'admin',
  SystemEditor: 'system_editor',
  Developer: 'developer',
  Editor: 'editor',
  Contributor: 'contributor',
  FrontendHeadlessAccount: 'frontend_headless_account',
  PreviewHeadlessAccount: 'preview_headless_account',
}

export const allowRoles = (roles: string[]) => {
  return ({ session }: { session: Session }) => {
    if (process.env.NODE_ENV === 'test') {
      return true
    }

    if (!Array.isArray(roles)) {
      return false
    }
    return roles.indexOf(session?.data.role) > -1
  }
}

export const allowAllRoles = () => {
  const roles = [
    RoleEnum.Owner,
    RoleEnum.Admin,
    RoleEnum.SystemEditor,
    RoleEnum.Developer,
    RoleEnum.Editor,
    RoleEnum.Contributor,
    RoleEnum.FrontendHeadlessAccount,
    RoleEnum.PreviewHeadlessAccount,
  ]
  return allowRoles(roles)
}

export const denyRoles = (roles: string[]) => {
  return ({ session }: { session: Session }) => {
    if (!Array.isArray(roles)) {
      return true
    }
    return roles.indexOf(session?.data.role) === -1
  }
}

const filterQueryOperation = ({ session }: { session: Session }) => {
  const role = session?.data?.role
  if (role === RoleEnum.Admin || role === RoleEnum.Owner) {
    return true
  }

  return {
    created_by: {
      OR: [
        {
          id: {
            equals: session?.itemId,
          },
        },
        {
          role: {
            equals: RoleEnum.SystemEditor,
          },
        },
      ],
    },
  }
}

const filterUpdateOperation = ({ session }: { session: Session }) => {
  return {
    created_by: {
      id: {
        equals: session?.itemId,
      },
    },
  }
}

const filterDeleteOpertion = filterUpdateOperation

export const createdByFilter = {
  query: filterQueryOperation,
  update: filterUpdateOperation,
  delete: filterDeleteOpertion,
}

export const createdByHooks: ListHooks<BaseListTypeInfo> = {
  resolveInput: ({ resolvedData, operation, context }) => {
    if (operation === 'create') {
      const userId = context.session?.itemId
      resolvedData.created_by = {
        connect: {
          id: Number(userId),
        },
      }
    }
    return resolvedData
  },
}
