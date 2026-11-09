import { Avatar } from '../../components/ui/Avatar.tsx'
import { Card } from '../../components/ui/Card.tsx'
import { PageHeader, PageShell } from '../../components/layout/PageHeader.tsx'
import { useWorkspaceData } from '../../hooks/useWorkspaceData.ts'
import { useI18n } from '../../i18n/useI18n.ts'
import { formatProjects } from '../../utils/format.ts'

export function TeamPage() {
  const { members, projects, workspace } = useWorkspaceData()
  const { locale, t, text } = useI18n()

  return (
    <PageShell>
      <PageHeader
        eyebrow={text(workspace.name)}
        title={t('nav.team')}
        description={t('page.teamDescription')}
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {members.map((member) => {
          const count = projects.filter((project) => project.memberIds.includes(member.id)).length
          return (
            <Card key={member.id} className="p-4">
              <div className="flex items-center gap-3">
                <Avatar user={member} />
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-zinc-900">{text(member.name)}</p>
                  <p className="truncate text-xs text-zinc-500">{text(member.role)}</p>
                </div>
              </div>
              <p className="mt-3 text-xs text-zinc-500">{member.email}</p>
              <p className="mt-2 text-xs text-zinc-600">
                {formatProjects(count, locale)}
              </p>
            </Card>
          )
        })}
      </div>
    </PageShell>
  )
}
