import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  let body: { username?: string; password?: string };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const username = body.username?.trim().toLowerCase();
  const password = body.password;

  if (!username || !password) {
    return NextResponse.json(
      { error: "Username and password are required" },
      { status: 400 }
    );
  }

  const supabase = createAdminClient();

  const { count, error: countError } = await supabase
    .from("users")
    .select("*", { count: "exact", head: true });

  if (countError) {
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }

  if ((count ?? 0) > 0) {
    return NextResponse.json(
      { error: "Account already exists" },
      { status: 403 }
    );
  }

  const email = `${username}@fluent.local`;

  const { data: authData, error: authError } =
    await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

  if (authError || !authData.user) {
    return NextResponse.json(
      { error: "Could not create account" },
      { status: 500 }
    );
  }

  const { error: insertError } = await supabase.from("users").insert({
    id: authData.user.id,
    email,
    username,
  });

  if (insertError) {
    return NextResponse.json(
      { error: "Could not create account" },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}
