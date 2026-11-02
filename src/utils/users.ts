import type { User } from '../types/index.ts'

export function userById(users: User[], id: string) {
  return users.find((user) => user.id === id)
}

export function usersByIds(users: User[], ids: string[]) {
  return ids.flatMap((id) => {
    const user = users.find((item) => item.id === id)
    return user ? [user] : []
  })
}

export function firstName(name: string) {
  return name.split(' ')[0] ?? name
}
