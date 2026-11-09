import { isTaskPriority, isTaskStatus } from '../utils/guards.ts'
import type { Board, BoardTask, NewBoardInput, Profile, TaskStatus } from '../types/index.ts'
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
  })
  return error
}

export async function fetchBoards() {
  const [boardsResult, profilesResult] = await Promise.all([
    supabase
      .from('boards')
      .select(
        'id, owner_id, name, description, board_members(user_id), tasks(id, board_id, title, status, assignee_id, priority, deadline)',
      )
      .order('created_at', { ascending: false }),
    supabase.from('profiles').select('id, email, name').order('name'),
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
  const { error } = await supabase.from('tasks').update({ status }).eq('id', taskId)
  return error
}
