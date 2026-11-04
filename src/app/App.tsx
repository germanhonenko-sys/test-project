import { useEffect } from 'react'
import { RouterProvider } from 'react-router-dom'
import { useAuthStore } from '../store/useAuthStore.ts'
import { router } from './router.tsx'

export default function App() {
  const init = useAuthStore((state) => state.init)

  useEffect(() => init(), [init])

  return <RouterProvider router={router} />
}
