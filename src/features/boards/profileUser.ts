import { teamRoleLabel } from '../../data/teamRoles.ts'
import { both } from '../../i18n/text.ts'
import type { Profile, User } from '../../types/index.ts'
import { colorFromEmail, initialsFromName } from '../../utils/auth.ts'

export function profileAsUser(profile: Profile): User {
  const name = profile.name || profile.email || 'Пользователь'
  return {
    id: profile.id,
    name: both(name),
    role: teamRoleLabel(profile.role),
    email: profile.email,
    initials: both(initialsFromName(name)),
    color: colorFromEmail(profile.email || profile.id),
    workspaceIds: [],
  }
}
