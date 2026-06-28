import { SiteShell } from "@/components/layout/site-shell";
import { Card } from "@/components/ui/card";

const users = [
  { id: "user-1", username: "Aster", role: "ADMIN", status: "ACTIVE" },
  { id: "user-2", username: "Jun", role: "USER", status: "ACTIVE" },
  { id: "user-3", username: "Mina", role: "USER", status: "ACTIVE" },
];

export default function AdminUsersPage() {
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
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xl font-semibold">{user.username}</p>
                <p className="mt-1 text-sm text-muted">{user.id}</p>
              </div>
              <div className="text-right text-sm text-muted">
                <p>{user.role}</p>
                <p>{user.status}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </SiteShell>
  );
}
