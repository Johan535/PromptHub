import { db } from "@/lib/db";
import { listAllPromptsForAdmin } from "@/lib/prompt-service";

export async function getAdminOverview() {
  const [promptCount, publicPromptCount, userCount, favoriteCount, prompts] =
    await Promise.all([
      db.prompt.count({
        where: {
          deletedAt: null,
        },
      }),
      db.prompt.count({
        where: {
          deletedAt: null,
          visibility: "PUBLIC",
          status: "PUBLISHED",
        },
      }),
      db.user.count(),
      db.favorite.count(),
      listAllPromptsForAdmin(),
    ]);

  return {
    promptCount,
    publicPromptCount,
    userCount,
    favoriteCount,
    recentPrompts: prompts.slice(0, 5),
  };
}

export async function listAdminUsers() {
  return db.user.findMany({
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      username: true,
      email: true,
      role: true,
      status: true,
      createdAt: true,
    },
  });
}
