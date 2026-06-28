import { PromptEditorForm } from "@/components/prompt/prompt-editor-form";
import { SiteShell } from "@/components/layout/site-shell";

export default function NewPromptPage() {
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
          先把结构和交互搭起来，下一步会接入数据库、校验和真实提交逻辑。
        </p>
      </div>
      <PromptEditorForm />
    </SiteShell>
  );
}
