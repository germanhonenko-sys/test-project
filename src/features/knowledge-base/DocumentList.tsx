import { FileText } from 'lucide-react'
import { FilterChip } from '../../components/ui/FilterChip.tsx'
import { Badge } from '../../components/ui/Badge.tsx'
import { Card } from '../../components/ui/Card.tsx'
import { Input } from '../../components/ui/Input.tsx'
import { categoryLabel } from '../../i18n/labels.ts'
import { searchText } from '../../i18n/text.ts'
import { useI18n } from '../../i18n/useI18n.ts'
import { documentCategories, type DocumentCategory, type KnowledgeDocument } from '../../types/index.ts'
import { formatRelative } from '../../utils/format.ts'

type CategoryFilter = 'All' | DocumentCategory

export function DocumentList({
  documents,
  query,
  category,
  onQueryChange,
  onCategoryChange,
}: {
  documents: KnowledgeDocument[]
  query: string
  category: CategoryFilter
  onQueryChange: (query: string) => void
  onCategoryChange: (category: CategoryFilter) => void
}) {
  const { locale, t, text } = useI18n()
  const filters: CategoryFilter[] = ['All', ...documentCategories]
  const visible = documents.filter((document) => {
    const matchesCategory = category === 'All' || document.category === category
    const matchesQuery = searchText(document.name).toLowerCase().includes(query.trim().toLowerCase())
    return matchesCategory && matchesQuery
  })

  return (
    <Card className="p-4 lg:col-span-3">
      <Input
        value={query}
        onChange={(event) => onQueryChange(event.target.value)}
        placeholder={t('knowledge.search')}
        aria-label={t('knowledge.search')}
      />
      <div className="mt-3 flex flex-wrap gap-2">
        {filters.map((item) => (
          <FilterChip
            key={item}
            active={category === item}
            tone="indigo"
            hover
            onClick={() => onCategoryChange(item)}
          >
            {item === 'All' ? t('page.filterAll') : categoryLabel(item, locale)}
          </FilterChip>
        ))}
      </div>
      {visible.length === 0 ? (
        <p className="mt-6 text-sm text-zinc-500">{t('knowledge.empty')}</p>
      ) : (
        <ul className="mt-4 divide-y divide-zinc-100">
          {visible.map((document) => (
            <li key={document.id} className="flex items-center gap-3 py-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-100 text-zinc-500">
                <FileText className="h-4 w-4" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-zinc-900">{text(document.name)}</p>
                <p className="text-xs text-zinc-500">
                  {text(document.size)} · {formatRelative(document.updatedAt, locale)}
                </p>
              </div>
              <Badge className="bg-zinc-100 text-zinc-600">{categoryLabel(document.category, locale)}</Badge>
            </li>
          ))}
        </ul>
      )}
    </Card>
  )
}
