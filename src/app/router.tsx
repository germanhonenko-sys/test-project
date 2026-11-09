import { Navigate, createBrowserRouter } from 'react-router-dom'
import { GuestOnly } from '../components/auth/GuestOnly.tsx'
import { RequireAuth } from '../components/auth/RequireAuth.tsx'
import { AppLayout } from '../components/layout/AppLayout.tsx'
import { AIPage } from '../pages/AI/AIPage.tsx'
import { AuthPage } from '../pages/Auth/AuthPage.tsx'
import { DashboardPage } from '../pages/Dashboard/DashboardPage.tsx'
import { IntegrationsPage } from '../pages/Integrations/IntegrationsPage.tsx'
import { KnowledgeBasePage } from '../pages/KnowledgeBase/KnowledgeBasePage.tsx'
import { ProjectsPage } from '../pages/Projects/ProjectsPage.tsx'
import { SettingsPage } from '../pages/Settings/SettingsPage.tsx'
import { BoardsPage } from '../pages/Boards/BoardsPage.tsx'
import { BoardViewPage } from '../pages/Boards/BoardViewPage.tsx'
import { TeamPage } from '../pages/Team/TeamPage.tsx'

export const router = createBrowserRouter([
  {
    element: <GuestOnly />,
    children: [{ path: '/auth', element: <AuthPage /> }],
  },
  {
    path: '/',
    element: <RequireAuth />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { index: true, element: <Navigate to="/dashboard" replace /> },
          { path: 'dashboard', element: <DashboardPage /> },
          { path: 'boards', element: <BoardsPage /> },
          { path: 'boards/:boardId', element: <BoardViewPage /> },
          { path: 'tasks', element: <Navigate to="/boards" replace /> },
          { path: 'projects', element: <ProjectsPage /> },
          { path: 'team', element: <TeamPage /> },
          { path: 'knowledge-base', element: <KnowledgeBasePage /> },
          { path: 'ai', element: <AIPage /> },
          { path: 'integrations', element: <IntegrationsPage /> },
          { path: 'settings', element: <SettingsPage /> },
          { path: '*', element: <Navigate to="/dashboard" replace /> },
        ],
      },
    ],
  },
])
