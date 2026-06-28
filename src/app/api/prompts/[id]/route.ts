import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import {
  getPromptDetail,
  softDeletePrompt,
  updatePrompt,
  type PromptMutationInput,
} from "@/lib/prompt-service";
import { requireUser } from "@/lib/session";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const user = await requireUser();
  const prompt = await getPromptDetail(id, user?.email ? undefined : undefined);

  if (!prompt) {
    return NextResponse.json(
      {
        code: 404,
        message: "prompt not found",
        data: null,
      },
      { status: 404 },
    );
  }

  return NextResponse.json({
    code: 0,
    message: "ok",
    data: prompt,
  });
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
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

  const dbUser = await db.user.findUnique({
    where: {
      email: sessionUser.email,
    },
    select: {
      id: true,
    },
  });

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

  const { id } = await params;
  const body = (await request.json()) as PromptMutationInput;
  const prompt = await updatePrompt(id, dbUser.id, body);

  if (!prompt) {
    return NextResponse.json(
      {
        code: 404,
        message: "prompt not found",
        data: null,
      },
      { status: 404 },
    );
  }

  return NextResponse.json({
    code: 0,
    message: "ok",
    data: prompt,
  });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
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

  const dbUser = await db.user.findUnique({
    where: {
      email: sessionUser.email,
    },
    select: {
      id: true,
    },
  });

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

  const { id } = await params;
  const deleted = await softDeletePrompt(id, dbUser.id);

  if (!deleted) {
    return NextResponse.json(
      {
        code: 404,
        message: "prompt not found",
        data: null,
      },
      { status: 404 },
    );
  }

  return NextResponse.json({
    code: 0,
    message: "ok",
    data: true,
  });
}
