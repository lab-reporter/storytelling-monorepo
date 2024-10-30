import { BaseListTypeInfo } from '@keystone-6/core/types'
import {
  ListHooks,
  FieldHooks,
} from '@keystone-6/core/dist/declarations/src/types/config/hooks'
import { unlink } from 'node:fs/promises'
import path from 'node:path'
// @ts-ignore @twreporter/errors does not provide definition files
import errors from '@twreporter/errors'

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

const getAbsoluteFilePath = (storagePath: string) => {
  const workingDir = process.cwd()
  const relativePath = path.relative(workingDir, storagePath)
  return path.resolve(workingDir, relativePath)
}

export const createFileFieldHooks = (
  limit: number,
  storagePath: string
): FieldHooks<BaseListTypeInfo> => {
  return {
    validateInput: async ({
      operation,
      context,
      listKey,
      fieldKey,
      addValidationError,
      resolvedData,
    }) => {
      if (operation === 'create') {
        const userId = context.session?.itemId
        const count = await context.query[listKey]?.count({
          where: {
            created_by: {
              id: {
                equals: userId,
              },
            },
          },
        })

        if (count >= limit) {
          addValidationError('已達上傳上限。')

          // We use `file` field, which are provided by Keystone,
          // to handle file uploads.
          // And, we also use `validateInput` hook to prevent users from uploading
          // more than 5 items.
          //
          // But, there is a edge case we need to handle here:
          // Although `validateInput` will prevent from writing 6th item into database,
          // `file` field won't delete the uploaded file.
          // Hence, we need to delete the file manually here.
          const filename = resolvedData?.[fieldKey]?.filename
          const filepath = path.join(getAbsoluteFilePath(storagePath), filename)
          try {
            console.log(
              JSON.stringify({
                severity: 'INFO',
                message:
                  '(validateInput hook): delete dangling file due to reaching file upload limit: ' +
                  filepath,
              })
            )
            await unlink(filepath)
          } catch (_err) {
            const err = errors.helpers.wrap(
              _err,
              'ValidateInputHookError',
              'error delete dangling file',
              { filepath }
            )
            console.error(
              JSON.stringify({
                severity: 'Error',
                message: errors.helpers.printAll(err, {
                  withStack: true,
                  withPayload: true,
                }),
              })
            )
          }
        }
      }
    },
  }
}

export const createImageFieldHooks = (
  limit: number,
  storagePath: string
): FieldHooks<BaseListTypeInfo> => {
  return {
    validateInput: async ({
      operation,
      context,
      listKey,
      fieldKey,
      addValidationError,
      resolvedData,
    }) => {
      if (operation === 'create') {
        const userId = context.session?.itemId
        const count = await context.query[listKey]?.count({
          where: {
            created_by: {
              id: {
                equals: userId,
              },
            },
          },
        })

        if (count >= limit) {
          addValidationError('已達上傳上限。')

          // We use `image` field, which are provided by Keystone,
          // to handle image uploads.
          // And, we also use `validateInput` hook to prevent users from uploading
          // more than 5 items.
          //
          // But, there is a edge case we need to handle here:
          // Although `validateInput` will prevent from writing 6th item into database,
          // `image` field won't delete the uploaded image file.
          // Hence, we need to delete the image file manually here.
          const id = resolvedData?.[fieldKey]?.id
          const extension = resolvedData?.[fieldKey]?.extension
          const filepath = path.join(
            getAbsoluteFilePath(storagePath),
            `${id}.${extension}`
          )
          try {
            console.log(
              JSON.stringify({
                severity: 'INFO',
                message:
                  '(validateInput hook): delete dangling file due to reaching image upload limit: ' +
                  filepath,
              })
            )
            await unlink(filepath)
          } catch (_err) {
            const err = errors.helpers.wrap(
              _err,
              'ValidateInputHookError',
              'error delete dangling file',
              { filepath }
            )
            console.error(
              JSON.stringify({
                severity: 'Error',
                message: errors.helpers.printAll(err, {
                  withStack: true,
                  withPayload: true,
                }),
              })
            )
          }
        }
      }
    },
  }
}
