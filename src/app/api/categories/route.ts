import { NextResponse } from "next/server";
import { listCategories } from "@/lib/catalog-service";

export async function GET() {
  const data = await listCategories();

  return NextResponse.json({
    code: 0,
    message: "ok",
    data,
  });
}
