import Link from "next/link";
import { ArrowRight, FolderKanban, Search, Sparkles, Star } from "lucide-react";
import { PromptCard } from "@/components/prompt/prompt-card";
import { SiteShell } from "@/components/layout/site-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { listCategories } from "@/lib/catalog-service";
import { listPublicPrompts } from "@/lib/prompt-service";

export default async function HomePage() {
  const [categories, prompts] = await Promise.all([
    listCategories(),
    listPublicPrompts(),
  ]);
  const featuredPrompts = prompts.slice(0, 3);

  return (
    <SiteShell>
      <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <Card className="overflow-hidden p-8 lg:p-10">
          <div className="max-w-3xl">
            <Badge className="mb-5">AI 编程时代的 Prompt 资产工作台</Badge>
            <h1 className="max-w-3xl text-4xl font-semibold leading-tight tracking-tight text-foreground lg:text-6xl">
              把零散 Prompt 变成
              <span className="text-primary">可查找、可复用、可沉淀</span>
              的开发资产。
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-muted lg:text-lg">
              PromptHub 面向使用 Cursor、Claude Code、Codex、Trae、Windsurf
              的开发者，帮助你管理高质量 Prompt，减少重复试错。
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/prompts">
                <Button size="lg">
                  开始浏览 Prompt
                  <ArrowRight className="ml-2 size-4" />
                </Button>
              </Link>
              <Link href="/editor/new">
                <Button variant="outline" size="lg">
                  新建我的 Prompt
                </Button>
              </Link>
            </div>
          </div>
        </Card>

        <div className="grid gap-6">
          <Card className="p-6">
            <div className="mb-6 flex items-center gap-3">
              <div className="rounded-2xl bg-secondary p-3">
                <Search className="size-5 text-primary" />
              </div>
              <div>
                <p className="font-semibold">主流程验证</p>
                <p className="text-sm text-muted">
                  发现 {"->"} 使用 {"->"} 收藏 {"->"} 创建
                </p>
              </div>
            </div>
            <ul className="space-y-3 text-sm leading-7 text-muted">
              <li>支持按分类、标签、工具筛选 Prompt</li>
              <li>支持变量表单实时生成最终 Prompt</li>
              <li>支持公开 / 私有资产沉淀</li>
            </ul>
          </Card>

          <Card className="p-6">
            <div className="mb-5 flex items-center gap-3">
              <div className="rounded-2xl bg-secondary p-3">
                <FolderKanban className="size-5 text-primary" />
              </div>
              <div>
                <p className="font-semibold">MVP 当前重点</p>
                <p className="text-sm text-muted">先把可上线最小版本跑通</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Badge key={category.id}>{category.name}</Badge>
              ))}
            </div>
          </Card>
        </div>
      </section>

      <section className="mt-14">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted">
              Featured
            </p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight">
              本周高频使用 Prompt
            </h2>
          </div>
          <Link href="/prompts" className="text-sm font-medium text-foreground">
            查看全部
          </Link>
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          {featuredPrompts.map((prompt) => (
            <PromptCard key={prompt.id} prompt={prompt} />
          ))}
        </div>
      </section>

      <section className="mt-14 grid gap-6 lg:grid-cols-3">
        <Card className="p-6">
          <div className="mb-4 flex items-center gap-3">
            <Star className="size-5 text-accent" />
            <h3 className="text-lg font-semibold">结构化模板</h3>
          </div>
          <p className="text-sm leading-7 text-muted">
            每条 Prompt 都带变量、标签、适配工具和场景信息，真正能复用。
          </p>
        </Card>
        <Card className="p-6">
          <div className="mb-4 flex items-center gap-3">
            <Sparkles className="size-5 text-accent" />
            <h3 className="text-lg font-semibold">更接近真实产品</h3>
          </div>
          <p className="text-sm leading-7 text-muted">
            首版按可上线网站的标准搭建，而不是只做静态演示页。
          </p>
        </Card>
        <Card className="p-6">
          <div className="mb-4 flex items-center gap-3">
            <FolderKanban className="size-5 text-accent" />
            <h3 className="text-lg font-semibold">面向后续扩展</h3>
          </div>
          <p className="text-sm leading-7 text-muted">
            代码结构已经为鉴权、数据库、后台管理和后续 AI 能力预留空间。
          </p>
        </Card>
      </section>
    </SiteShell>
  );
}
