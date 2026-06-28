import { SiteShell } from "@/components/layout/site-shell";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { listAdminUsers } from "@/lib/admin-service";

export default async function AdminUsersPage() {
  const users = await listAdminUsers();

  return (
    <SiteShell>
      <div className="mb-8">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted">
          Admin / Users
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight">
          用户管理
        </h1>
      </div>

      <div className="grid gap-4">
        {users.map((user) => (
          <Card key={user.id} className="p-6">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-xl font-semibold">{user.username}</p>
                <p className="mt-1 text-sm text-muted">{user.email}</p>
              </div>
              <div className="flex gap-2">
                <Badge>{user.role}</Badge>
                <Badge>{user.status}</Badge>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </SiteShell>
  );
}
