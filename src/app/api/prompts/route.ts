import { NextResponse } from "next/server";
import { createPrompt, listPublicPrompts, type PromptMutationInput } from "@/lib/prompt-service";
import { requireUser } from "@/lib/session";

export async function GET() {
  const data = await listPublicPrompts();

  return NextResponse.json({
    code: 0,
    message: "ok",
    data,
  });
}

export async function POST(request: Request) {
  const user = await requireUser();

  if (!user?.email) {
    return NextResponse.json(
      {
        code: 401,
        message: "unauthorized",
        data: null,
      },
      { status: 401 },
    );
  }

  const dbUser = await import("@/lib/db").then(({ db }) =>
    db.user.findUnique({
      where: {
        email: user.email ?? "",
      },
      select: {
        id: true,
      },
    }),
  );

  if (!dbUser) {
    return NextResponse.json(
      {
        code: 404,
        message: "user not found",
        data: null,
      },
      { status: 404 },
    );
  }

  const body = (await request.json()) as PromptMutationInput;
  const prompt = await createPrompt(dbUser.id, body);

  return NextResponse.json(
    {
      code: 0,
      message: "ok",
      data: prompt,
    },
    { status: 201 },
  );
}
