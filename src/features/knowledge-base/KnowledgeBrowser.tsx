import { FileText, Upload } from 'lucide-react'
import { useRef, useState, type DragEvent } from 'react'
import { Badge } from '../../components/ui/Badge.tsx'
import { Card } from '../../components/ui/Card.tsx'
import { Input } from '../../components/ui/Input.tsx'
import { useWorkspaceData } from '../../hooks/useWorkspaceData.ts'
import { useAppStore } from '../../store/useAppStore.ts'
import { documentCategories, type DocumentCategory } from '../../types/index.ts'
import { cn } from '../../utils/cn.ts'
import { formatBytes, formatRelative } from '../../utils/format.ts'

type CategoryFilter = 'All' | DocumentCategory

export function KnowledgeBrowser() {
  const { documents, workspace } = useWorkspaceData()
  const addDocument = useAppStore((state) => state.addDocument)
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<CategoryFilter>('All')
  const [dragging, setDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const filters: CategoryFilter[] = ['All', ...documentCategories]
  const visible = documents.filter((document) => {
    const matchesCategory = category === 'All' || document.category === category
    const matchesQuery = document.name.toLowerCase().includes(query.trim().toLowerCase())
    return matchesCategory && matchesQuery
  })

  function addFiles(files: FileList | null) {
    if (!files) return
    const nextCategory: DocumentCategory = category === 'All' ? 'Продукт' : category
    Array.from(files).forEach((file) => {
      if (!file.name) return
      addDocument({
        workspaceId: workspace.id,
        name: file.name,
        category: nextCategory,
        size: formatBytes(file.size),
      })
    })
  }

  function onDrop(event: DragEvent<HTMLButtonElement>) {
    event.preventDefault()
    setDragging(false)
    addFiles(event.dataTransfer.files)
  }

  return (
    <div className="grid gap-4 lg:grid-cols-5">
      <div className="lg:col-span-2">
        <input
          ref={inputRef}
          type="file"
          multiple
          className="sr-only"
          aria-label="Загрузить документы"
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
            dragging ? 'border-indigo-400 bg-indigo-50' : 'border-zinc-300 bg-white hover:border-indigo-300 hover:bg-indigo-50/40',
          )}
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
            <Upload className="h-5 w-5" />
          </span>
          <p className="mt-3 text-sm font-medium text-zinc-900">Перетащите файлы или выберите их</p>
          <p className="mt-1 text-xs text-zinc-500">Файлы хранятся только в этой сессии браузера.</p>
        </button>
      </div>
      <Card className="p-4 lg:col-span-3">
        <Input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Поиск документов"
          aria-label="Поиск документов"
        />
        <div className="mt-3 flex flex-wrap gap-2">
          {filters.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setCategory(item)}
              className={cn(
                'rounded-full px-3 py-1 text-xs font-medium',
                category === item
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-zinc-600 ring-1 ring-zinc-200 hover:bg-zinc-50',
              )}
            >
              {item === 'All' ? 'Все' : item}
            </button>
          ))}
        </div>
        {visible.length === 0 ? (
          <p className="mt-6 text-sm text-zinc-500">Ничего не найдено.</p>
        ) : (
          <ul className="mt-4 divide-y divide-zinc-100">
            {visible.map((document) => (
              <li key={document.id} className="flex items-center gap-3 py-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-100 text-zinc-500">
                  <FileText className="h-4 w-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-zinc-900">{document.name}</p>
                  <p className="text-xs text-zinc-500">
                    {document.size} · {formatRelative(document.updatedAt)}
                  </p>
                </div>
                <Badge className="bg-zinc-100 text-zinc-600">{document.category}</Badge>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  )
}
