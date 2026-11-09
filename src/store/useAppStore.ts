import { create } from 'zustand'
import { mockActivity } from '../data/mockActivity.ts'
import { mockDocuments } from '../data/mockDocuments.ts'
import { mockNotifications } from '../data/mockNotifications.ts'
import { mockProjects } from '../data/mockProjects.ts'
import { mockTasks } from '../data/mockTasks.ts'
import { mockUsers } from '../data/mockUsers.ts'
import { mockWorkspaces } from '../data/mockWorkspaces.ts'
import type {
  Activity,
  AiHistoryItem,
  AppNotification,
  KnowledgeDocument,
  NewDocumentInput,
  NewTaskInput,
  Preferences,
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
  setCurrentUserId: (userId) => set({ currentUserId: userId }),
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
