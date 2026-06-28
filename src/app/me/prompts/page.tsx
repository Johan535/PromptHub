import { redirect } from "next/navigation";
import Link from "next/link";
import { PencilLine } from "lucide-react";
import { SiteShell } from "@/components/layout/site-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { db } from "@/lib/db";
import { listUserPrompts } from "@/lib/prompt-service";
import { requireUser } from "@/lib/session";

export default async function MyPromptsPage() {
  const sessionUser = await requireUser();

  if (!sessionUser?.email) {
    redirect("/login");
  }

  const user = await db.user.findUnique({
    where: {
      email: sessionUser.email,
    },
    select: {
      id: true,
    },
  });

  if (!user) {
    redirect("/login");
  }

  const prompts = await listUserPrompts(user.id);

  return (
    <SiteShell>
      <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted">
            My Assets
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight">
            我的 Prompt 资产
          </h1>
        </div>
        <Link href="/editor/new">
          <Button>新建 Prompt</Button>
        </Link>
      </div>

      <div className="grid gap-4">
        {prompts.map((prompt) => (
          <Card key={prompt.id} className="p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  <Badge>{prompt.visibility}</Badge>
                  <Badge>{prompt.status}</Badge>
                  <Badge>{prompt.category.name}</Badge>
                </div>
                <h2 className="text-2xl font-semibold tracking-tight">
                  {prompt.title}
                </h2>
                <p className="max-w-3xl text-sm leading-7 text-muted">
                  {prompt.summary}
                </p>
              </div>
              <div className="flex shrink-0 gap-3">
                <Link href={`/editor/${prompt.id}`}>
                  <Button variant="outline">
                    <PencilLine className="mr-2 size-4" />
                    编辑
                  </Button>
                </Link>
                <Link href={`/prompts/${prompt.id}`}>
                  <Button variant="secondary">查看详情</Button>
                </Link>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </SiteShell>
  );
}
