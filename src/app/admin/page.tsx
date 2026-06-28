import Link from "next/link";
import { AdminStatCard } from "@/components/admin/admin-stat-card";
import { SiteShell } from "@/components/layout/site-shell";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { getAdminOverview } from "@/lib/admin-service";

export default async function AdminPage() {
  const overview = await getAdminOverview();

  return (
    <SiteShell>
      <div className="mb-8">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted">
          Admin
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight">
          运营后台
        </h1>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <AdminStatCard
          label="全部 Prompt"
          value={String(overview.promptCount)}
          helper="未删除内容总量"
        />
        <AdminStatCard
          label="公开 Prompt"
          value={String(overview.publicPromptCount)}
          helper="广场可见内容"
        />
        <AdminStatCard
          label="注册用户"
          value={String(overview.userCount)}
          helper="当前账号数量"
        />
        <AdminStatCard
          label="总收藏"
          value={String(overview.favoriteCount)}
          helper="收藏关系总数"
        />
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-[300px_1fr]">
        <Card className="p-6">
          <h2 className="text-xl font-semibold tracking-tight">管理入口</h2>
          <div className="mt-5 grid gap-3">
            <Link href="/admin/prompts" className="text-sm font-medium">
              Prompt 管理
            </Link>
            <Link href="/admin/categories" className="text-sm font-medium">
              分类管理
            </Link>
            <Link href="/admin/tags" className="text-sm font-medium">
              标签管理
            </Link>
            <Link href="/admin/users" className="text-sm font-medium">
              用户管理
            </Link>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold tracking-tight">最近 Prompt</h2>
          <div className="mt-5 space-y-4">
            {overview.recentPrompts.map((prompt) => (
              <div
                key={prompt.id}
                className="rounded-lg border border-border bg-white/70 p-4"
              >
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="font-medium">{prompt.title}</p>
                    <p className="mt-1 text-sm text-muted">{prompt.summary}</p>
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <Badge>{prompt.visibility}</Badge>
                    <Badge>{prompt.status}</Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </SiteShell>
  );
}
