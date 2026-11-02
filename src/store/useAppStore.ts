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
  ActivityKind,
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
import { DEFAULT_AI_PROMPT, generateSubtasks } from '../utils/ai.ts'

function createId(prefix: string) {
  return `${prefix}-${crypto.randomUUID().slice(0, 8)}`
}

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

function activityEntry(
  workspaceId: string,
  actorId: string,
  kind: ActivityKind,
  message: string,
): Activity {
  return {
    id: createId('activity'),
    workspaceId,
    actorId,
    kind,
    message,
    timestamp: new Date().toISOString(),
  }
}

export const useAppStore = create<AppState>((set, get) => ({
  currentUserId: 'alex',
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
  setActiveWorkspace: (workspaceId) => set({ activeWorkspaceId: workspaceId }),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  openCreateTask: () => set({ createTaskOpen: true }),
  closeCreateTask: () => set({ createTaskOpen: false }),
  addTask: (input) => {
    const task: Task = { id: createId('task'), ...input }
    const projectName = get().projects.find((project) => project.id === task.projectId)?.name ?? 'проект'
    set((state) => ({
      tasks: [task, ...state.tasks],
      activity: [
        activityEntry(
          task.workspaceId,
          state.currentUserId,
          'created',
          `новая задача «${task.title}» в проекте «${projectName}».`,
        ),
        ...state.activity,
      ],
      createTaskOpen: false,
    }))
  },
  setTaskStatus: (taskId, status) => {
    const current = get().tasks.find((task) => task.id === taskId)
    if (!current || current.status === status) return
    const done = status === 'Готово'
    set((state) => ({
      tasks: state.tasks.map((task) => (task.id === taskId ? { ...task, status } : task)),
      activity: [
        activityEntry(
          current.workspaceId,
          state.currentUserId,
          done ? 'completed' : 'status',
          done
            ? `задача «${current.title}» завершена.`
            : `статус задачи «${current.title}» изменён на «${status}».`,
        ),
        ...state.activity,
      ],
    }))
  },
  addDocument: (input) => {
    const document: KnowledgeDocument = {
      ...input,
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
    const text = prompt.trim() || DEFAULT_AI_PROMPT
    const item: AiHistoryItem = {
      id: createId('ai'),
      workspaceId: get().activeWorkspaceId,
      prompt: text,
      subtasks: generateSubtasks(text),
      createdAt: new Date().toISOString(),
    }
    set((state) => ({ aiHistory: [item, ...state.aiHistory].slice(0, 12) }))
    return item
  },
}))
