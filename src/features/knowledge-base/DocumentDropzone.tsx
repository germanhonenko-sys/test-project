import { Upload } from 'lucide-react'
import { useRef, useState, type DragEvent } from 'react'
import { useI18n } from '../../i18n/useI18n.ts'
import { useAppStore } from '../../store/useAppStore.ts'
import type { DocumentCategory } from '../../types/index.ts'
import { cn } from '../../utils/cn.ts'
import { formatBytes } from '../../utils/format.ts'

export function DocumentDropzone({
  workspaceId,
  category,
}: {
  workspaceId: string
  category: 'All' | DocumentCategory
}) {
  const addDocument = useAppStore((state) => state.addDocument)
  const { t } = useI18n()
  const [dragging, setDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  function addFiles(files: FileList | null) {
    if (!files) return
    const nextCategory: DocumentCategory = category === 'All' ? 'Продукт' : category
    Array.from(files).forEach((file) => {
      if (!file.name) return
      addDocument({
        workspaceId,
        name: file.name,
        category: nextCategory,
        size: {
          ru: formatBytes(file.size, 'ru'),
          en: formatBytes(file.size, 'en'),
        },
      })
    })
  }

  function onDrop(event: DragEvent<HTMLButtonElement>) {
    event.preventDefault()
    setDragging(false)
    addFiles(event.dataTransfer.files)
  }

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        multiple
        className="sr-only"
        aria-label={t('knowledge.uploadLabel')}
        onChange={(event) => {
          addFiles(event.target.files)
          event.target.value = ''
        }}
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        onDragOver={(event) => {
          event.preventDefault()
          setDragging(true)
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        className={cn(
          'flex w-full flex-col items-center rounded-xl border border-dashed px-6 py-10 text-center',
          dragging
            ? 'border-indigo-400 bg-indigo-50'
            : 'border-zinc-300 bg-white hover:border-indigo-300 hover:bg-indigo-50/40',
        )}
      >
        <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
          <Upload className="h-5 w-5" />
        </span>
        <p className="mt-3 text-sm font-medium text-zinc-900">{t('knowledge.drop')}</p>
        <p className="mt-1 text-xs text-zinc-500">{t('knowledge.sessionOnly')}</p>
      </button>
    </>
  )
}
