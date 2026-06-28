import Link from "next/link";
import { SiteShell } from "@/components/layout/site-shell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function NotFound() {
  return (
    <SiteShell>
      <div className="flex min-h-[60vh] items-center justify-center">
        <Card className="max-w-xl p-10 text-center">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted">
            404
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight">
            这个页面暂时不存在
          </h1>
          <p className="mt-4 text-base leading-8 text-muted">
            你可以先回到首页浏览 Prompt，或者新建一条自己的 Prompt 资产。
          </p>
          <div className="mt-8 flex justify-center gap-3">
            <Link href="/">
              <Button>返回首页</Button>
            </Link>
            <Link href="/editor/new">
              <Button variant="outline">新建 Prompt</Button>
            </Link>
          </div>
        </Card>
      </div>
    </SiteShell>
  );
}
