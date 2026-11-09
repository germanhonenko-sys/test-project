import { create } from 'zustand'
import { mockActivity } from '../data/mockActivity.ts'
import { mockDocuments } from '../data/mockDocuments.ts'
import { mockNotifications } from '../data/mockNotifications.ts'
import { mockProjects } from '../data/mockProjects.ts'
import { mockTasks } from '../data/mockTasks.ts'
import { mockUsers } from '../data/mockUsers.ts'
import { mockWorkspaces } from '../data/mockWorkspaces.ts'
import { deleteBoard, ensureProfile, fetchBoards, insertBoard, saveBoard, saveTaskStatus } from '../lib/boards.ts'
import type {
  Activity,
  AiHistoryItem,
  AppNotification,
  Board,
  BoardTask,
  BoardTaskDraft,
  KnowledgeDocument,
  NewBoardInput,
  NewBoardTaskInput,
  NewDocumentInput,
  NewTaskInput,
  Preferences,
  Profile,
  Project,
  Task,
  TaskStatus,
  User,
  Workspace,
} from '../types/index.ts'
import { both, loc } from '../i18n/text.ts'
import { DEFAULT_AI_PROMPT, generateSubtasks } from '../utils/ai.ts'
import { createId, taskCreatedActivity, taskStatusActivity } from './activity.ts'

interface AppState {
  currentUserId: string
  workspaces: Workspace[]
  activeWorkspaceId: string
  projects: Project[]
  tasks: Task[]
  boards: Board[]
  boardTasks: BoardTask[]
  profiles: Profile[]
  boardsStatus: 'idle' | 'loading' | 'ready' | 'error'
  users: User[]
  activity: Activity[]
  documents: KnowledgeDocument[]
  notifications: AppNotification[]
  aiHistory: AiHistoryItem[]
  telegramByWorkspace: Record<string, boolean>
  preferences: Preferences
  sidebarOpen: boolean
  createTaskOpen: boolean
  setCurrentUserId: (userId: string) => void
  addUser: (user: User) => void
  setActiveWorkspace: (workspaceId: string) => void
  setSidebarOpen: (open: boolean) => void
  openCreateTask: () => void
  closeCreateTask: () => void
  addTask: (input: NewTaskInput) => void
  loadBoards: () => Promise<void>
  addBoard: (input: NewBoardInput) => Promise<boolean>
  updateBoard: (boardId: string, input: NewBoardInput) => Promise<boolean>
  removeBoard: (boardId: string) => Promise<boolean>
  setBoardTaskStatus: (taskId: string, status: TaskStatus) => Promise<void>
  addBoardTask: (input: NewBoardTaskInput) => void
  updateBoardTask: (taskId: string, patch: Partial<BoardTaskDraft>) => void
  removeBoardTask: (taskId: string) => void
  setTaskStatus: (taskId: string, status: TaskStatus) => void
  addDocument: (input: NewDocumentInput) => void
  toggleTelegram: (workspaceId: string) => void
  setPreference: (key: keyof Preferences, value: boolean) => void
  markNotificationsRead: () => void
  submitPrompt: (prompt: string) => AiHistoryItem
}

const initialWorkspace = mockWorkspaces[0]

export const useAppStore = create<AppState>((set, get) => ({
  currentUserId: '',
  workspaces: mockWorkspaces,
  activeWorkspaceId: initialWorkspace?.id ?? 'ws-aivibe',
  projects: mockProjects,
  tasks: mockTasks,
  boards: [],
  boardTasks: [],
  profiles: [],
  boardsStatus: 'idle',
  users: mockUsers,
  activity: mockActivity,
  documents: mockDocuments,
  notifications: mockNotifications,
  aiHistory: [],
  telegramByWorkspace: {},
  preferences: {
    compactLists: false,
    emailDigest: true,
    desktopAlerts: false,
  },
  sidebarOpen: false,
  createTaskOpen: false,
  setCurrentUserId: (userId) =>
    set(
      userId
        ? { currentUserId: userId }
        : {
            currentUserId: '',
            boards: [],
            boardTasks: [],
            profiles: [],
            boardsStatus: 'idle',
          },
    ),
  addUser: (user) =>
    set((state) =>
      state.users.some(
        (item) => item.id === user.id || item.email.toLowerCase() === user.email.toLowerCase(),
      )
        ? state
        : { users: [...state.users, user] },
    ),
  setActiveWorkspace: (workspaceId) => set({ activeWorkspaceId: workspaceId }),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  openCreateTask: () => set({ createTaskOpen: true }),
  closeCreateTask: () => set({ createTaskOpen: false }),
  addTask: (input) => {
    const task: Task = { id: createId('task'), ...input, title: both(input.title) }
    const projectName =
      get().projects.find((project) => project.id === task.projectId)?.name ?? loc('проект', 'project')
    set((state) => ({
      tasks: [task, ...state.tasks],
      activity: [taskCreatedActivity(task, projectName, state.currentUserId), ...state.activity],
      createTaskOpen: false,
    }))
  },
  loadBoards: async () => {
    const userId = get().currentUserId
    if (!userId || get().boardsStatus === 'loading' || get().boardsStatus === 'ready') return
    const user = get().users.find((item) => item.id === userId)
    set({ boardsStatus: 'loading' })
    try {
      if (user) {
        const profileError = await ensureProfile({ id: user.id, email: user.email, name: user.name.ru })
        if (profileError) {
          set({ boardsStatus: 'error' })
          return
        }
      }
      const result = await fetchBoards()
      if (result.error) {
        set({ boardsStatus: 'error' })
        return
      }
      set({
        boards: result.boards ?? [],
        boardTasks: result.tasks ?? [],
        profiles: result.profiles ?? [],
        boardsStatus: 'ready',
      })
    } catch {
      set({ boardsStatus: 'error' })
    }
  },
  addBoard: async (input) => {
    const ownerId = get().currentUserId
    if (!ownerId) return false
    const { error, board } = await insertBoard(ownerId, input)
    if (error || !board) return false
    set((state) => ({ boards: [board, ...state.boards] }))
    return true
  },
  updateBoard: async (boardId, input) => {
    const error = await saveBoard(boardId, input)
    if (error) return false
    set((state) => ({
      boards: state.boards.map((board) =>
        board.id === boardId
          ? { ...board, name: input.name, description: input.description, memberIds: input.memberIds }
          : board,
      ),
    }))
    return true
  },
  removeBoard: async (boardId) => {
    const error = await deleteBoard(boardId)
    if (error) return false
    set((state) => ({
      boards: state.boards.filter((board) => board.id !== boardId),
      boardTasks: state.boardTasks.filter((task) => task.boardId !== boardId),
    }))
    return true
  },
  addBoardTask: (input) => {
    const task: BoardTask = { id: createId('board-task'), ...input }
    set((state) => ({ boardTasks: [...state.boardTasks, task] }))
  },
  updateBoardTask: (taskId, patch) => {
    set((state) => ({
      boardTasks: state.boardTasks.map((task) => (task.id === taskId ? { ...task, ...patch } : task)),
    }))
  },
  removeBoardTask: (taskId) => {
    set((state) => ({ boardTasks: state.boardTasks.filter((task) => task.id !== taskId) }))
  },
  setBoardTaskStatus: async (taskId, status) => {
    const current = get().boardTasks.find((task) => task.id === taskId)
    if (!current || current.status === status) return
    set((state) => ({
      boardTasks: state.boardTasks.map((task) => (task.id === taskId ? { ...task, status } : task)),
    }))
    const error = await saveTaskStatus(taskId, status)
    if (!error) return
    set((state) => ({
      boardTasks: state.boardTasks.map((task) =>
        task.id === taskId ? { ...task, status: current.status } : task,
      ),
    }))
  },
  setTaskStatus: (taskId, status) => {
    const current = get().tasks.find((task) => task.id === taskId)
    if (!current || current.status === status) return
    set((state) => ({
      tasks: state.tasks.map((task) => (task.id === taskId ? { ...task, status } : task)),
      activity: [taskStatusActivity(current, status, state.currentUserId), ...state.activity],
    }))
  },
  addDocument: (input) => {
    const document: KnowledgeDocument = {
      ...input,
      name: both(input.name),
      id: createId('doc'),
      updatedAt: new Date().toISOString(),
    }
    set((state) => ({ documents: [document, ...state.documents] }))
  },
  toggleTelegram: (workspaceId) =>
    set((state) => ({
      telegramByWorkspace: {
        ...state.telegramByWorkspace,
        [workspaceId]: !state.telegramByWorkspace[workspaceId],
      },
    })),
  setPreference: (key, value) =>
    set((state) => ({ preferences: { ...state.preferences, [key]: value } })),
  markNotificationsRead: () =>
    set((state) => ({
      notifications: state.notifications.map((item) => ({ ...item, read: true })),
    })),
  submitPrompt: (prompt) => {
    const trimmed = prompt.trim()
    const item: AiHistoryItem = {
      id: createId('ai'),
      workspaceId: get().activeWorkspaceId,
      prompt: trimmed ? both(trimmed) : DEFAULT_AI_PROMPT,
      subtasks: generateSubtasks(trimmed || DEFAULT_AI_PROMPT.ru),
      createdAt: new Date().toISOString(),
    }
    set((state) => ({ aiHistory: [item, ...state.aiHistory].slice(0, 12) }))
    return item
  },
}))
