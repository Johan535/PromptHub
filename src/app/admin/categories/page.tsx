import { SiteShell } from "@/components/layout/site-shell";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { listCategories } from "@/lib/catalog-service";

export default async function AdminCategoriesPage() {
  const categories = await listCategories();

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

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {categories.map((category) => (
          <Card key={category.id} className="p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xl font-semibold">{category.name}</p>
                <p className="mt-1 text-sm text-muted">{category.slug}</p>
              </div>
              <Badge>排序 {category.sortOrder}</Badge>
            </div>
          </Card>
        ))}
      </div>
    </SiteShell>
  );
}
