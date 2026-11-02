import { Navigate, createBrowserRouter } from 'react-router-dom'
import { AppLayout } from '../components/layout/AppLayout.tsx'
import { AIPage } from '../pages/AI/AIPage.tsx'
import { DashboardPage } from '../pages/Dashboard/DashboardPage.tsx'
import { IntegrationsPage } from '../pages/Integrations/IntegrationsPage.tsx'
import { KnowledgeBasePage } from '../pages/KnowledgeBase/KnowledgeBasePage.tsx'
import { ProjectsPage } from '../pages/Projects/ProjectsPage.tsx'
import { SettingsPage } from '../pages/Settings/SettingsPage.tsx'
import { TasksPage } from '../pages/Tasks/TasksPage.tsx'
import { TeamPage } from '../pages/Team/TeamPage.tsx'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: 'dashboard', element: <DashboardPage /> },
      { path: 'tasks', element: <TasksPage /> },
      { path: 'projects', element: <ProjectsPage /> },
      { path: 'team', element: <TeamPage /> },
      { path: 'knowledge-base', element: <KnowledgeBasePage /> },
      { path: 'ai', element: <AIPage /> },
      { path: 'integrations', element: <IntegrationsPage /> },
      { path: 'settings', element: <SettingsPage /> },
      { path: '*', element: <Navigate to="/dashboard" replace /> },
    ],
  },
])
