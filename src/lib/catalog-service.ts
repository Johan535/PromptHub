import { db } from "@/lib/db";

export async function listCategories() {
  return db.category.findMany({
    orderBy: {
      sortOrder: "asc",
    },
  });
}

export async function listTags() {
  return db.tag.findMany({
    orderBy: {
      name: "asc",
    },
  });
}
