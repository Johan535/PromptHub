import { SiteShell } from "@/components/layout/site-shell";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { prompts } from "@/lib/mock-data";

export default function AdminPromptsPage() {
  return (
    <SiteShell>
      <div className="mb-8">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted">
          Admin / Prompts
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight">
          Prompt 管理
        </h1>
      </div>

      <div className="grid gap-4">
        {prompts.map((prompt) => (
          <Card key={prompt.id} className="p-6">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="mb-3 flex flex-wrap gap-2">
                  <Badge>{prompt.visibility}</Badge>
                  <Badge>{prompt.status}</Badge>
                </div>
                <p className="text-xl font-semibold">{prompt.title}</p>
                <p className="mt-2 text-sm text-muted">{prompt.summary}</p>
              </div>
              <div className="flex gap-2">
                <Badge>下架</Badge>
                <Badge>编辑</Badge>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </SiteShell>
  );
}
