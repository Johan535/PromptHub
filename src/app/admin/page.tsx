import Link from "next/link";
import { AdminStatCard } from "@/components/admin/admin-stat-card";
import { SiteShell } from "@/components/layout/site-shell";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { prompts, tags } from "@/lib/mock-data";

export default function AdminPage() {
  return (
    <SiteShell>
      <div className="mb-8">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted">
          Admin
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight">
          PromptHub 运营后台
        </h1>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <AdminStatCard
          label="公开 Prompt"
          value="128"
          helper="后续接数据库统计"
        />
        <AdminStatCard label="注册用户" value="46" helper="后续接用户表数据" />
        <AdminStatCard label="总收藏" value="1.4k" helper="后续接行为埋点" />
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <Card className="p-6">
          <h2 className="text-xl font-semibold tracking-tight">快捷入口</h2>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link href="/admin/prompts">
              <Badge>管理 Prompt</Badge>
            </Link>
            <Link href="/admin/categories">
              <Badge>分类管理</Badge>
            </Link>
            <Link href="/admin/tags">
              <Badge>标签管理</Badge>
            </Link>
            <Link href="/admin/users">
              <Badge>用户管理</Badge>
            </Link>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold tracking-tight">近期内容样例</h2>
          <div className="mt-5 space-y-4">
            {prompts.slice(0, 3).map((prompt) => (
              <div
                key={prompt.id}
                className="rounded-[1.5rem] border border-border bg-white/70 p-4"
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-medium">{prompt.title}</p>
                    <p className="mt-1 text-sm text-muted">{prompt.summary}</p>
                  </div>
                  <Badge>{prompt.visibility}</Badge>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Badge key={tag.id}>{tag.name}</Badge>
            ))}
          </div>
        </Card>
      </div>
    </SiteShell>
  );
}
