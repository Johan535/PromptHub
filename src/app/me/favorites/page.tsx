import { redirect } from "next/navigation";
import Link from "next/link";
import { Heart } from "lucide-react";
import { SiteShell } from "@/components/layout/site-shell";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { db } from "@/lib/db";
import { listFavoritePrompts } from "@/lib/prompt-service";
import { requireUser } from "@/lib/session";

export default async function MyFavoritesPage() {
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

  const favorites = await listFavoritePrompts(user.id);

  return (
    <SiteShell>
      <div className="mb-8">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted">
          Favorites
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight">
          我的收藏
        </h1>
      </div>

      <div className="grid gap-4">
        {favorites.map((prompt) => (
          <Link key={prompt.id} href={`/prompts/${prompt.id}`}>
            <Card className="p-6 transition-transform hover:-translate-y-0.5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="mb-3 flex flex-wrap gap-2">
                    <Badge>{prompt.category.name}</Badge>
                    {prompt.tags.map((tag) => (
                      <Badge key={tag.id}>{tag.name}</Badge>
                    ))}
                  </div>
                  <h2 className="text-2xl font-semibold tracking-tight">
                    {prompt.title}
                  </h2>
                  <p className="mt-3 max-w-3xl text-sm leading-7 text-muted">
                    {prompt.summary}
                  </p>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted">
                  <Heart className="size-4" />
                  {prompt.favoriteCount}
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </SiteShell>
  );
}
