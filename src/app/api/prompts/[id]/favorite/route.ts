import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { addFavorite, removeFavorite } from "@/lib/prompt-service";
import { requireUser } from "@/lib/session";

async function resolveUserId() {
  const sessionUser = await requireUser();

  if (!sessionUser?.email) {
    return null;
  }

  const user = await db.user.findUnique({
    where: {
      email: sessionUser.email,
    },
    select: {
      id: true,
    },
  });

  return user?.id ?? null;
}

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const userId = await resolveUserId();

  if (!userId) {
    return NextResponse.json(
      {
        code: 401,
        message: "unauthorized",
        data: null,
      },
      { status: 401 },
    );
  }

  const { id } = await params;
  await addFavorite(id, userId);

  return NextResponse.json({
    code: 0,
    message: "ok",
    data: true,
  });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const userId = await resolveUserId();

  if (!userId) {
    return NextResponse.json(
      {
        code: 401,
        message: "unauthorized",
        data: null,
      },
      { status: 401 },
    );
  }

  const { id } = await params;
  await removeFavorite(id, userId);

  return NextResponse.json({
    code: 0,
    message: "ok",
    data: true,
  });
}
