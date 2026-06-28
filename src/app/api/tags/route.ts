import { NextResponse } from "next/server";
import { listTags } from "@/lib/catalog-service";

export async function GET() {
  const data = await listTags();

  return NextResponse.json({
    code: 0,
    message: "ok",
    data,
  });
}
