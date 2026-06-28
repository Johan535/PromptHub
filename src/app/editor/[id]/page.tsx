import { notFound, redirect } from "next/navigation";
import { SiteShell } from "@/components/layout/site-shell";
import { PromptEditorForm } from "@/components/prompt/prompt-editor-form";
import { listCategories } from "@/lib/catalog-service";
import { db } from "@/lib/db";
import { getPromptEditorData } from "@/lib/prompt-service";
import { requireUser } from "@/lib/session";

export default async function EditPromptPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
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

  const { id } = await params;
  const [prompt, categories] = await Promise.all([
    getPromptEditorData(id, user.id),
    listCategories(),
  ]);

  if (!prompt) {
    notFound();
  }

  return (
    <SiteShell>
      <div className="mb-8">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted">
          Prompt Editor
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight">
          编辑 Prompt
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-8 text-muted">
          当前正在编辑：{prompt.title}。修改后会直接更新数据库内容。
        </p>
      </div>
      <PromptEditorForm categories={categories} initialPrompt={prompt} />
    </SiteShell>
  );
}
