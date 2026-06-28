import { notFound } from "next/navigation";
import { Heart, Layers3, UserRound } from "lucide-react";
import { SiteShell } from "@/components/layout/site-shell";
import { PromptDetailActions } from "@/components/prompt/prompt-detail-actions";
import { PromptRenderer } from "@/components/prompt/prompt-renderer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getPromptDetail } from "@/lib/prompt-service";
import { formatCompactNumber } from "@/lib/utils";

export default async function PromptDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const prompt = await getPromptDetail(id);

  if (!prompt) {
    notFound();
  }

  return (
    <SiteShell>
      <section className="mb-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="p-8">
          <div className="mb-5 flex flex-wrap gap-2">
            <Badge>{prompt.category.name}</Badge>
            {prompt.toolSupport.map((tool) => (
              <Badge key={tool}>{tool}</Badge>
            ))}
          </div>
          <h1 className="text-4xl font-semibold leading-tight tracking-tight">
            {prompt.title}
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-8 text-muted">
            {prompt.summary}
          </p>

          <div className="mt-8 flex flex-wrap gap-6 text-sm text-muted">
            <span className="flex items-center gap-2">
              <UserRound className="size-4" />
              {prompt.author.username}
            </span>
            <span className="flex items-center gap-2">
              <Heart className="size-4" />
              {formatCompactNumber(prompt.favoriteCount)} 收藏
            </span>
            <span className="flex items-center gap-2">
              <Layers3 className="size-4" />
              {formatCompactNumber(prompt.useCount)} 使用
            </span>
          </div>
        </Card>

        <Card className="p-8">
          <div className="mb-4">
            <p className="text-sm font-semibold text-foreground">Prompt 结构</p>
            <p className="mt-2 text-sm leading-7 text-muted">
              当前模板采用“角色 + 上下文 + 任务要求 + 输出格式”的结构，更适合 AI
              编程类任务。
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {prompt.tags.map((tag) => (
              <Badge key={tag.id}>{tag.name}</Badge>
            ))}
          </div>
          <div className="mt-8 flex gap-3">
            <PromptDetailActions promptId={prompt.id} />
            <Button variant="outline">复制原始模板</Button>
          </div>
        </Card>
      </section>

      <PromptRenderer prompt={prompt} />
    </SiteShell>
  );
}
