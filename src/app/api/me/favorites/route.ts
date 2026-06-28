import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { listFavoritePrompts } from "@/lib/prompt-service";
import { requireUser } from "@/lib/session";

export async function GET() {
  const sessionUser = await requireUser();

  if (!sessionUser?.email) {
    return NextResponse.json(
      {
        code: 401,
        message: "unauthorized",
        data: null,
      },
      { status: 401 },
    );
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
    return NextResponse.json(
      {
        code: 404,
        message: "user not found",
        data: null,
      },
      { status: 404 },
    );
  }

  const data = await listFavoritePrompts(user.id);

  return NextResponse.json({
    code: 0,
    message: "ok",
    data,
  });
}
