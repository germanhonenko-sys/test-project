import { useEffect, useRef } from 'react'

export function useOnOutside<T extends HTMLElement>(active: boolean, onOutside: () => void) {
  const ref = useRef<T>(null)

  useEffect(() => {
    if (!active) return
    const onPointer = (event: MouseEvent) => {
      if (!ref.current?.contains(event.target as Node)) onOutside()
    }
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onOutside()
    }
    document.addEventListener('mousedown', onPointer)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onPointer)
      document.removeEventListener('keydown', onKey)
    }
  }, [active, onOutside])

  return ref
}
