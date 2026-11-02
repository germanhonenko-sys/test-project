import { Avatar } from '../../components/ui/Avatar.tsx'
import { Card } from '../../components/ui/Card.tsx'
import { PageHeader, PageShell } from '../../components/layout/PageHeader.tsx'
import { useWorkspaceData } from '../../hooks/useWorkspaceData.ts'
import { plural } from '../../utils/format.ts'

export function TeamPage() {
  const { members, projects, workspace } = useWorkspaceData()

  return (
    <PageShell>
      <PageHeader
        eyebrow={workspace.name}
        title="Команда"
        description="Люди, которые работают в этом пространстве."
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {members.map((member) => {
          const count = projects.filter((project) => project.memberIds.includes(member.id)).length
          return (
            <Card key={member.id} className="p-4">
              <div className="flex items-center gap-3">
                <Avatar user={member} />
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-zinc-900">{member.name}</p>
                  <p className="truncate text-xs text-zinc-500">{member.role}</p>
                </div>
              </div>
              <p className="mt-3 text-xs text-zinc-500">{member.email}</p>
              <p className="mt-2 text-xs text-zinc-600">
                {count} {plural(count, 'проект', 'проекта', 'проектов')}
              </p>
            </Card>
          )
        })}
      </div>
    </PageShell>
  )
}
