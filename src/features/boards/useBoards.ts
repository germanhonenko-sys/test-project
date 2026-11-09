import { useEffect } from 'react'
import { useAppStore } from '../../store/useAppStore.ts'

export function useBoards() {
  const currentUserId = useAppStore((state) => state.currentUserId)
  const loadBoards = useAppStore((state) => state.loadBoards)

  useEffect(() => {
    if (!currentUserId) return
    void loadBoards()
  }, [currentUserId, loadBoards])
}
