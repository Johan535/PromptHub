import Link from "next/link";
import { Code2, Search, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-black/5 bg-background/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex size-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
            <Code2 className="size-5" />
          </div>
          <div>
            <p className="text-base font-semibold tracking-tight">PromptHub</p>
            <p className="text-xs text-muted">AI 编程 Prompt 资产平台</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 text-sm text-muted md:flex">
          <Link href="/prompts" className="transition-colors hover:text-foreground">
            Prompt 广场
          </Link>
          <Link href="/me/prompts" className="transition-colors hover:text-foreground">
            我的资产
          </Link>
          <Link href="/admin" className="transition-colors hover:text-foreground">
            后台管理
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" className="hidden md:inline-flex">
            <Search className="mr-2 size-4" />
            搜索 Prompt
          </Button>
          <Link href="/editor/new">
            <Button size="sm">
              <Sparkles className="mr-2 size-4" />
              新建 Prompt
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
