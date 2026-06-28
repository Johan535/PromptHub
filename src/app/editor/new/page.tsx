import { PromptEditorForm } from "@/components/prompt/prompt-editor-form";
import { SiteShell } from "@/components/layout/site-shell";
import { listCategories } from "@/lib/catalog-service";

export default async function NewPromptPage() {
  const categories = await listCategories();

  return (
    <SiteShell>
      <div className="mb-8">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted">
          Prompt Editor
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight">
          新建一条可沉淀的 Prompt 资产
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-8 text-muted">
          现在可以直接创建新 Prompt，数据会真实写入数据库。
        </p>
      </div>
      <PromptEditorForm categories={categories} />
    </SiteShell>
  );
}
