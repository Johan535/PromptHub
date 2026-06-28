import Link from "next/link";
import { Search } from "lucide-react";
import { PromptCard } from "@/components/prompt/prompt-card";
import { SiteShell } from "@/components/layout/site-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { listCategories, listTags } from "@/lib/catalog-service";
import { listPublicPrompts, type PromptListFilters } from "@/lib/prompt-service";

const tools = ["Cursor", "Claude Code", "Codex", "Windsurf", "Trae"];

function asValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function PromptsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const filters: PromptListFilters = {
    keyword: asValue(params.keyword),
    category: asValue(params.category),
    tag: asValue(params.tag),
    tool: asValue(params.tool),
    sort: (asValue(params.sort) as PromptListFilters["sort"]) ?? "latest",
  };

  const [categories, tags, prompts] = await Promise.all([
    listCategories(),
    listTags(),
    listPublicPrompts(filters),
  ]);

  return (
    <SiteShell>
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted">
            Prompt Library
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight">
            Prompt 广场
          </h1>
        </div>
        <Link href="/editor/new">
          <Button>新建 Prompt</Button>
        </Link>
      </div>

      <Card className="mb-8 p-5">
        <form className="grid gap-3 lg:grid-cols-[1.4fr_1fr_1fr_1fr_0.8fr_auto]">
          <label className="relative block">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted" />
            <Input
              name="keyword"
              defaultValue={filters.keyword ?? ""}
              className="pl-10"
              placeholder="搜索标题、简介或正文"
            />
          </label>

          <Select name="category" defaultValue={filters.category ?? ""}>
            <option value="">全部分类</option>
            {categories.map((category) => (
              <option key={category.id} value={category.slug}>
                {category.name}
              </option>
            ))}
          </Select>

          <Select name="tag" defaultValue={filters.tag ?? ""}>
            <option value="">全部标签</option>
            {tags.map((tag) => (
              <option key={tag.id} value={tag.name}>
                {tag.name}
              </option>
            ))}
          </Select>

          <Select name="tool" defaultValue={filters.tool ?? ""}>
            <option value="">全部工具</option>
            {tools.map((tool) => (
              <option key={tool} value={tool}>
                {tool}
              </option>
            ))}
          </Select>

          <Select name="sort" defaultValue={filters.sort ?? "latest"}>
            <option value="latest">最新</option>
            <option value="popular">使用最多</option>
            <option value="favorites">收藏最多</option>
          </Select>

          <Button type="submit">筛选</Button>
        </form>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <Badge>{prompts.length} 条结果</Badge>
          {filters.keyword ? <Badge>关键词：{filters.keyword}</Badge> : null}
          {filters.category ? <Badge>分类：{filters.category}</Badge> : null}
          {filters.tag ? <Badge>标签：{filters.tag}</Badge> : null}
          {filters.tool ? <Badge>工具：{filters.tool}</Badge> : null}
          <Link href="/prompts" className="text-sm font-medium text-primary">
            清空筛选
          </Link>
        </div>
      </Card>

      {prompts.length ? (
        <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {prompts.map((prompt) => (
            <PromptCard key={prompt.id} prompt={prompt} />
          ))}
        </section>
      ) : (
        <Card className="p-10 text-center">
          <p className="text-xl font-semibold">没有找到匹配的 Prompt</p>
          <p className="mt-3 text-sm text-muted">换个关键词或清空筛选再试一次。</p>
        </Card>
      )}
    </SiteShell>
  );
}
