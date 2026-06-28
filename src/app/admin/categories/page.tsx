import { SiteShell } from "@/components/layout/site-shell";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { categories } from "@/lib/mock-data";

export default function AdminCategoriesPage() {
  return (
    <SiteShell>
      <div className="mb-8">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted">
          Admin / Categories
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight">
          分类管理
        </h1>
      </div>

      <Card className="p-6">
        <div className="flex flex-wrap gap-3">
          {categories.map((category) => (
            <Badge key={category.id}>{category.name}</Badge>
          ))}
        </div>
      </Card>
    </SiteShell>
  );
}
