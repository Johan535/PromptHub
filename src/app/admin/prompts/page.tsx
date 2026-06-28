import Link from "next/link";
import { ExternalLink, PencilLine } from "lucide-react";
import { SiteShell } from "@/components/layout/site-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { listAllPromptsForAdmin } from "@/lib/prompt-service";

export default async function AdminPromptsPage() {
  const prompts = await listAllPromptsForAdmin();

  return (
    <SiteShell>
      <div className="mb-8">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted">
          Admin / Prompts
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight">
          Prompt 管理
        </h1>
      </div>

      <div className="grid gap-4">
        {prompts.map((prompt) => (
          <Card key={prompt.id} className="p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="mb-3 flex flex-wrap gap-2">
                  <Badge>{prompt.visibility}</Badge>
                  <Badge>{prompt.status}</Badge>
                  <Badge>{prompt.category.name}</Badge>
                </div>
                <p className="text-xl font-semibold">{prompt.title}</p>
                <p className="mt-2 max-w-3xl text-sm leading-7 text-muted">
                  {prompt.summary}
                </p>
                <p className="mt-2 text-xs text-muted">
                  作者：{prompt.author.username} · 收藏 {prompt.favoriteCount} · 使用{" "}
                  {prompt.useCount}
                </p>
              </div>
              <div className="flex shrink-0 gap-2">
                <Link href={`/prompts/${prompt.id}`}>
                  <Button variant="outline" size="sm">
                    <ExternalLink className="mr-2 size-4" />
                    查看
                  </Button>
                </Link>
                <Link href={`/editor/${prompt.id}`}>
                  <Button variant="secondary" size="sm">
                    <PencilLine className="mr-2 size-4" />
                    编辑
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </SiteShell>
  );
}
