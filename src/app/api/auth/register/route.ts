import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(request: Request) {
  const body = (await request.json()) as {
    email?: string;
    username?: string;
    password?: string;
  };

  const email = body.email?.trim().toLowerCase();
  const username = body.username?.trim();
  const password = body.password?.trim();

  if (!email || !username || !password) {
    return NextResponse.json(
      {
        code: 400,
        message: "请完整填写邮箱、用户名和密码。",
        data: null,
      },
      { status: 400 },
    );
  }

  if (password.length < 8) {
    return NextResponse.json(
      {
        code: 400,
        message: "密码长度至少需要 8 位。",
        data: null,
      },
      { status: 400 },
    );
  }

  const existing = await db.user.findFirst({
    where: {
      OR: [{ email }, { username }],
    },
  });

  if (existing) {
    return NextResponse.json(
      {
        code: 409,
        message: "该邮箱或用户名已被使用。",
        data: null,
      },
      { status: 409 },
    );
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await db.user.create({
    data: {
      email,
      username,
      passwordHash,
    },
    select: {
      id: true,
      email: true,
      username: true,
    },
  });

  return NextResponse.json({
    code: 0,
    message: "ok",
    data: user,
  });
}
