import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET() {
  const supabase = createAdminClient();

  const { count, error } = await supabase
    .from("users")
    .select("*", { count: "exact", head: true });

  if (error) {
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }

  return NextResponse.json({ exists: (count ?? 0) > 0 });
}
