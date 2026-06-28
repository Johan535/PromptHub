import { Prisma, PromptStatus, PromptVisibility, VariableType } from "@prisma/client";
import { db } from "@/lib/db";
import { PromptItem, PromptTag, PromptVariable, ToolName } from "@/types/prompt";

const promptInclude = {
  author: {
    select: {
      id: true,
      username: true,
    },
  },
  category: true,
  variables: {
    orderBy: {
      sortOrder: "asc" as const,
    },
  },
  tags: {
    include: {
      tag: true,
    },
  },
} satisfies Prisma.PromptInclude;

type PromptWithRelations = Prisma.PromptGetPayload<{
  include: typeof promptInclude;
}>;

function parseStringArray(value: string | null): string[] | undefined {
  if (!value) {
    return undefined;
  }

  try {
    const parsed = JSON.parse(value) as unknown;

    if (!Array.isArray(parsed)) {
      return undefined;
    }

    return parsed.filter((item): item is string => typeof item === "string");
  } catch {
    return undefined;
  }
}

function mapPrompt(record: PromptWithRelations): PromptItem {
  return {
    id: record.id,
    title: record.title,
    summary: record.summary,
    content: record.content,
    visibility: record.visibility,
    status: record.status,
    toolSupport: parseStringArray(record.toolSupport) as ToolName[] | undefined ?? [],
    favoriteCount: record.favoriteCount,
    useCount: record.useCount,
    createdAt: record.createdAt.toISOString(),
    updatedAt: record.updatedAt.toISOString(),
    author: record.author,
    category: {
      id: record.category.id,
      name: record.category.name,
      slug: record.category.slug,
    },
    tags: record.tags.map(
      (entry): PromptTag => ({
        id: entry.tag.id,
        name: entry.tag.name,
      }),
    ),
    variables: record.variables.map(
      (variable): PromptVariable => ({
        id: variable.id,
        varKey: variable.varKey,
        varLabel: variable.varLabel,
        varType: variable.varType as PromptVariable["varType"],
        defaultValue: variable.defaultValue,
        options: parseStringArray(variable.options),
        isRequired: variable.isRequired,
        sortOrder: variable.sortOrder,
      }),
    ),
  };
}

export async function listPublicPrompts() {
  const records = await db.prompt.findMany({
    where: {
      deletedAt: null,
      visibility: PromptVisibility.PUBLIC,
      status: PromptStatus.PUBLISHED,
    },
    include: promptInclude,
    orderBy: {
      updatedAt: "desc",
    },
  });

  return records.map(mapPrompt);
}

export async function listUserPrompts(userId: string) {
  const records = await db.prompt.findMany({
    where: {
      userId,
      deletedAt: null,
    },
    include: promptInclude,
    orderBy: {
      updatedAt: "desc",
    },
  });

  return records.map(mapPrompt);
}

export async function listFavoritePrompts(userId: string) {
  const records = await db.favorite.findMany({
    where: {
      userId,
    },
    include: {
      prompt: {
        include: promptInclude,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return records
    .filter((record) => !record.prompt.deletedAt)
    .map((record) => mapPrompt(record.prompt));
}

export async function getPromptDetail(id: string, userId?: string) {
  const prompt = await db.prompt.findFirst({
    where: {
      id,
      deletedAt: null,
      OR: userId
        ? [
            { visibility: PromptVisibility.PUBLIC, status: PromptStatus.PUBLISHED },
            { userId },
          ]
        : [{ visibility: PromptVisibility.PUBLIC, status: PromptStatus.PUBLISHED }],
    },
    include: promptInclude,
  });

  return prompt ? mapPrompt(prompt) : null;
}

export async function getPromptEditorData(id: string, userId: string) {
  const prompt = await db.prompt.findFirst({
    where: {
      id,
      userId,
      deletedAt: null,
    },
    include: promptInclude,
  });

  return prompt ? mapPrompt(prompt) : null;
}

export interface PromptInputVariable {
  varKey: string;
  varLabel: string;
  varType: keyof typeof VariableType;
  defaultValue?: string;
  options?: string[];
  isRequired: boolean;
  sortOrder: number;
}

export interface PromptMutationInput {
  title: string;
  summary: string;
  content: string;
  categoryId: string;
  visibility: keyof typeof PromptVisibility;
  status: keyof typeof PromptStatus;
  toolSupport: ToolName[];
  tags: string[];
  variables: PromptInputVariable[];
}

export async function createPrompt(userId: string, input: PromptMutationInput) {
  const tagRecords = await ensureTags(input.tags);

  const prompt = await db.prompt.create({
    data: {
      userId,
      title: input.title,
      summary: input.summary,
      content: input.content,
      categoryId: input.categoryId,
      visibility: input.visibility,
      status: input.status,
      toolSupport: JSON.stringify(input.toolSupport),
      variables: {
        create: input.variables.map((variable) => ({
          varKey: variable.varKey,
          varLabel: variable.varLabel,
          varType: variable.varType,
          defaultValue: variable.defaultValue ?? "",
          options: JSON.stringify(variable.options ?? []),
          isRequired: variable.isRequired,
          sortOrder: variable.sortOrder,
        })),
      },
      tags: {
        create: tagRecords.map((tag) => ({
          tagId: tag.id,
        })),
      },
    },
    include: promptInclude,
  });

  return mapPrompt(prompt);
}

export async function updatePrompt(
  id: string,
  userId: string,
  input: PromptMutationInput,
) {
  const existing = await db.prompt.findFirst({
    where: {
      id,
      userId,
      deletedAt: null,
    },
    select: {
      id: true,
    },
  });

  if (!existing) {
    return null;
  }

  const tagRecords = await ensureTags(input.tags);

  const prompt = await db.prompt.update({
    where: {
      id,
    },
    data: {
      title: input.title,
      summary: input.summary,
      content: input.content,
      categoryId: input.categoryId,
      visibility: input.visibility,
      status: input.status,
      toolSupport: JSON.stringify(input.toolSupport),
      variables: {
        deleteMany: {},
        create: input.variables.map((variable) => ({
          varKey: variable.varKey,
          varLabel: variable.varLabel,
          varType: variable.varType,
          defaultValue: variable.defaultValue ?? "",
          options: JSON.stringify(variable.options ?? []),
          isRequired: variable.isRequired,
          sortOrder: variable.sortOrder,
        })),
      },
      tags: {
        deleteMany: {},
        create: tagRecords.map((tag) => ({
          tagId: tag.id,
        })),
      },
    },
    include: promptInclude,
  });

  return mapPrompt(prompt);
}

export async function softDeletePrompt(id: string, userId: string) {
  const existing = await db.prompt.findFirst({
    where: {
      id,
      userId,
      deletedAt: null,
    },
    select: {
      id: true,
    },
  });

  if (!existing) {
    return false;
  }

  await db.prompt.update({
    where: {
      id,
    },
    data: {
      deletedAt: new Date(),
      status: PromptStatus.OFFLINE,
    },
  });

  return true;
}

export async function isPromptFavorited(promptId: string, userId: string) {
  const favorite = await db.favorite.findUnique({
    where: {
      userId_promptId: {
        userId,
        promptId,
      },
    },
  });

  return Boolean(favorite);
}

export async function addFavorite(promptId: string, userId: string) {
  const existing = await db.favorite.findUnique({
    where: {
      userId_promptId: {
        userId,
        promptId,
      },
    },
  });

  if (existing) {
    return;
  }

  await db.favorite.create({
    data: {
      userId,
      promptId,
    },
  });

  await db.prompt.update({
    where: {
      id: promptId,
    },
    data: {
      favoriteCount: {
        increment: 1,
      },
    },
  });
}

export async function removeFavorite(promptId: string, userId: string) {
  const favorite = await db.favorite.findUnique({
    where: {
      userId_promptId: {
        userId,
        promptId,
      },
    },
  });

  if (!favorite) {
    return;
  }

  await db.favorite.delete({
    where: {
      userId_promptId: {
        userId,
        promptId,
      },
    },
  });

  await db.prompt.update({
    where: {
      id: promptId,
    },
    data: {
      favoriteCount: {
        decrement: 1,
      },
    },
  });
}

async function ensureTags(tagNames: string[]) {
  const normalized = [...new Set(tagNames.map((tag) => tag.trim()).filter(Boolean))];

  const records = await Promise.all(
    normalized.map((name) =>
      db.tag.upsert({
        where: { name },
        update: {},
        create: { name },
      }),
    ),
  );

  return records;
}
