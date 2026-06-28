import { PromptCard } from "@/components/prompt/prompt-card";
import { SiteShell } from "@/components/layout/site-shell";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { listCategories, listTags } from "@/lib/catalog-service";
import { listPublicPrompts } from "@/lib/prompt-service";

export default async function PromptsPage() {
  const [categories, tags, prompts] = await Promise.all([
    listCategories(),
    listTags(),
    listPublicPrompts(),
  ]);

  return (
    <SiteShell>
      <div className="mb-8">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted">
          Prompt Library
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight">
          面向 AI 编程任务的 Prompt 广场
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-8 text-muted">
          当前页面已经接入真实数据库读取，后续会继续补齐筛选、排序和搜索。
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <aside className="space-y-6">
          <Card className="p-6">
            <p className="text-sm font-semibold text-foreground">分类</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {categories.map((category) => (
                <Badge key={category.id}>{category.name}</Badge>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <p className="text-sm font-semibold text-foreground">热门标签</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Badge key={tag.id}>{tag.name}</Badge>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <p className="text-sm font-semibold text-foreground">适配工具</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {["Cursor", "Claude Code", "Codex", "Windsurf", "Trae"].map(
                (tool) => (
                  <Badge key={tool}>{tool}</Badge>
                ),
              )}
            </div>
          </Card>
        </aside>

        <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {prompts.map((prompt) => (
            <PromptCard key={prompt.id} prompt={prompt} />
          ))}
        </section>
      </div>
    </SiteShell>
  );
}
