import { useState } from 'react'
import { useWorkspaceData } from '../../hooks/useWorkspaceData.ts'
import type { DocumentCategory } from '../../types/index.ts'
import { DocumentDropzone } from './DocumentDropzone.tsx'
import { DocumentList } from './DocumentList.tsx'

type CategoryFilter = 'All' | DocumentCategory

export function KnowledgeBrowser() {
  const { documents, workspace } = useWorkspaceData()
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<CategoryFilter>('All')

  return (
    <div className="grid gap-4 lg:grid-cols-5">
      <div className="lg:col-span-2">
        <DocumentDropzone workspaceId={workspace.id} category={category} />
      </div>
      <DocumentList
        documents={documents}
        query={query}
        category={category}
        onQueryChange={setQuery}
        onCategoryChange={setCategory}
      />
    </div>
  )
}
