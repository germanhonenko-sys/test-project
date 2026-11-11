import type { User as AuthUser } from '@supabase/supabase-js'
import type { TeamRole } from '../data/teamRoles.ts'
import { isTaskPriority, isTaskStatus } from '../utils/guards.ts'
import type { Board, BoardTask, BoardTaskDraft, NewBoardInput, NewBoardTaskInput, Profile, TaskStatus } from '../types/index.ts'
import { supabase } from './supabase.ts'

type TaskRow = {
  id: string
  board_id: string
  title: string
  status: string
  assignee_id: string | null
  priority: string
  deadline: string | null
}

type BoardRow = {
  id: string
  owner_id: string
  name: string
  description: string
  board_members: { user_id: string }[] | null
  tasks: TaskRow[] | null
}

function mapTask(row: TaskRow): BoardTask | null {
  if (!isTaskStatus(row.status) || !isTaskPriority(row.priority)) return null
  return {
    id: row.id,
    boardId: row.board_id,
    title: row.title,
    status: row.status,
    assigneeId: row.assignee_id,
    priority: row.priority,
    deadline: row.deadline,
  }
}

function mapBoard(row: BoardRow): Board {
  return {
    id: row.id,
    ownerId: row.owner_id,
    name: row.name,
    description: row.description,
    memberIds: (row.board_members ?? []).map((member) => member.user_id),
  }
}

export async function ensureProfile(profile: Profile) {
  const { error } = await supabase.from('profiles').upsert({
    id: profile.id,
    email: profile.email,
    name: profile.name,
    ...(profile.role ? { role: profile.role } : {}),
  })
  return error
}

export async function saveProfileRole(profile: Profile, nextRole: TeamRole) {
  const previousRole = profile.role
  const profileError = await ensureProfile({ ...profile, role: nextRole })
  if (profileError) return { error: profileError, user: null as AuthUser | null }

  const { data, error } = await supabase.auth.updateUser({ data: { role: nextRole } })
  if (error || !data.user) {
    await supabase.from('profiles').upsert({
      id: profile.id,
      email: profile.email,
      name: profile.name,
      role: previousRole,
    })
    return { error: error ?? new Error('update failed'), user: null }
  }

  return { error: null, user: data.user }
}

export async function fetchBoards() {
  const [boardsResult, profilesResult] = await Promise.all([
    supabase
      .from('boards')
      .select(
        'id, owner_id, name, description, board_members(user_id), tasks(id, board_id, title, status, assignee_id, priority, deadline)',
      )
      .order('created_at', { ascending: false })
      .order('created_at', { ascending: true, referencedTable: 'tasks' }),
    supabase.from('profiles').select('id, email, name, role').order('name'),
  ])
  if (boardsResult.error || profilesResult.error) return { error: boardsResult.error ?? profilesResult.error }
  const rows = (boardsResult.data ?? []) as BoardRow[]
  return {
    error: null,
    boards: rows.map(mapBoard),
    tasks: rows.flatMap((row) => (row.tasks ?? []).flatMap((task) => {
      const mapped = mapTask(task)
      return mapped ? [mapped] : []
    })),
    profiles: (profilesResult.data ?? []) as Profile[],
  }
}

export async function insertBoard(ownerId: string, input: NewBoardInput) {
  const { data, error } = await supabase
    .from('boards')
    .insert({ owner_id: ownerId, name: input.name, description: input.description })
    .select('id')
    .single()
  if (error || !data) return { error: error ?? new Error('insert failed'), board: null }
  const memberIds = input.memberIds.includes(ownerId) ? input.memberIds : [ownerId, ...input.memberIds]
  const { error: memberError } = await supabase
    .from('board_members')
    .insert(memberIds.map((userId) => ({ board_id: data.id, user_id: userId })))
  if (memberError) return { error: memberError, board: null }
  const board: Board = {
    id: data.id,
    ownerId,
    name: input.name,
    description: input.description,
    memberIds,
  }
  return { error: null, board }
}

export async function saveBoard(boardId: string, input: NewBoardInput) {
  const { error } = await supabase
    .from('boards')
    .update({ name: input.name, description: input.description })
    .eq('id', boardId)
  if (error) return error
  const { error: deleteError } = await supabase.from('board_members').delete().eq('board_id', boardId)
  if (deleteError) return deleteError
  const { error: insertError } = await supabase
    .from('board_members')
    .insert(input.memberIds.map((userId) => ({ board_id: boardId, user_id: userId })))
  return insertError
}

export async function deleteBoard(boardId: string) {
  const { error } = await supabase.from('boards').delete().eq('id', boardId)
  return error
}

export async function saveTaskStatus(taskId: string, status: TaskStatus) {
  return saveBoardTask(taskId, { status })
}

export async function insertBoardTask(input: NewBoardTaskInput) {
  const { data, error } = await supabase
    .from('tasks')
    .insert({
      board_id: input.boardId,
      title: input.title,
      status: input.status,
      assignee_id: input.assigneeId,
      priority: input.priority,
      deadline: input.deadline,
    })
    .select('id, board_id, title, status, assignee_id, priority, deadline')
    .single()
  if (error || !data) return { error: error ?? new Error('insert failed'), task: null }
  const task = mapTask(data)
  if (!task) return { error: new Error('invalid task'), task: null }
  return { error: null, task }
}

export async function saveBoardTask(taskId: string, patch: Partial<BoardTaskDraft>) {
  const row: {
    title?: string
    status?: TaskStatus
    assignee_id?: string | null
    priority?: BoardTaskDraft['priority']
    deadline?: string | null
  } = {}
  if (patch.title !== undefined) row.title = patch.title
  if (patch.status !== undefined) row.status = patch.status
  if (patch.assigneeId !== undefined) row.assignee_id = patch.assigneeId
  if (patch.priority !== undefined) row.priority = patch.priority
  if (patch.deadline !== undefined) row.deadline = patch.deadline
  const { error } = await supabase.from('tasks').update(row).eq('id', taskId)
  return error
}

export async function deleteBoardTask(taskId: string) {
  const { error } = await supabase.from('tasks').delete().eq('id', taskId)
  return error
}
