type Session = {
  data: {
    name: string
    email: string
    role: string
  }
}

export const RoleEnum = {
  Owner: 'owner',
  Admin: 'admin',
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
