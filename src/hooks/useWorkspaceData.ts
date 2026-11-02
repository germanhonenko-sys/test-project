import { useMemo } from 'react'
import { useAppStore } from '../store/useAppStore.ts'

export function useWorkspaceData() {
  const activeWorkspaceId = useAppStore((state) => state.activeWorkspaceId)
  const workspaces = useAppStore((state) => state.workspaces)
  const projects = useAppStore((state) => state.projects)
  const tasks = useAppStore((state) => state.tasks)
  const users = useAppStore((state) => state.users)
  const activity = useAppStore((state) => state.activity)
  const documents = useAppStore((state) => state.documents)
  const currentUserId = useAppStore((state) => state.currentUserId)
  const aiHistory = useAppStore((state) => state.aiHistory)

  return useMemo(() => {
    const workspace = workspaces.find((item) => item.id === activeWorkspaceId)
    const currentUser = users.find((user) => user.id === currentUserId)
    if (!workspace || !currentUser) {
      throw new Error('Workspace data is missing')
    }
    return {
      workspace,
      currentUser,
      members: users.filter((user) => user.workspaceIds.includes(activeWorkspaceId)),
      projects: projects.filter((project) => project.workspaceId === activeWorkspaceId),
      tasks: tasks.filter((task) => task.workspaceId === activeWorkspaceId),
      activity: activity.filter((item) => item.workspaceId === activeWorkspaceId),
      documents: documents.filter((document) => document.workspaceId === activeWorkspaceId),
      aiHistory: aiHistory.filter((item) => item.workspaceId === activeWorkspaceId),
      users,
    }
  }, [
    activeWorkspaceId,
    workspaces,
    projects,
    tasks,
    users,
    activity,
    documents,
    currentUserId,
    aiHistory,
  ])
}
