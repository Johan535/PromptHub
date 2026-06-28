import { SiteShell } from "@/components/layout/site-shell";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { tags } from "@/lib/mock-data";

export default function AdminTagsPage() {
  return (
    <SiteShell>
      <div className="mb-8">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted">
          Admin / Tags
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight">
          标签管理
        </h1>
      </div>

      <Card className="p-6">
        <div className="flex flex-wrap gap-3">
          {tags.map((tag) => (
            <Badge key={tag.id}>{tag.name}</Badge>
          ))}
        </div>
      </Card>
    </SiteShell>
  );
}
