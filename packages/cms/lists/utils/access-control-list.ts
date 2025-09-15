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
  Editor: 'editor',
}

export const allowRoles = (roles: string[]) => {
  return ({ session }: { session?: Session }) => {
    if (process.env.NODE_ENV === 'test') {
      return true
    }

    if (!Array.isArray(roles)) {
      return false
    }

    if (session?.data.role) {
      return roles.indexOf(session?.data.role) > -1
    }

    return false
  }
}

export const allowAllRoles = () => {
  const roles = [RoleEnum.Owner, RoleEnum.Admin, RoleEnum.Editor]
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
