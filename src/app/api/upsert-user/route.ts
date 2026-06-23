import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function POST(request: NextRequest) {
  try {
    const { id, email, full_name, avatar_url, provider } = await request.json();

    if (!id || !email) {
      return NextResponse.json(
        { error: "id and email are required" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const { data: existing } = await supabaseAdmin
      .from("users")
      .select("id")
      .eq("id", id)
      .single();

    if (existing) {
      // Returning user — fetch full profile
      const { data: profile } = await supabaseAdmin
        .from("users")
        .select("*")
        .eq("id", id)
        .single();

      return NextResponse.json({ isNew: false, profile });
    }

    // New user — insert row
    const { data: profile, error } = await supabaseAdmin
      .from("users")
      .insert({
        id,
        email,
        full_name: full_name || null,
        avatar_url: avatar_url || null,
        provider: provider || "email",
      })
      .select()
      .single();

    if (error) {
      console.error("User insert error:", error);
      return NextResponse.json(
        { error: "Failed to create user profile" },
        { status: 500 }
      );
    }

    return NextResponse.json({ isNew: true, profile });
  } catch (error) {
    console.error("Upsert user error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
