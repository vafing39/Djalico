import { createClient } from "@supabase/supabase-js";
import { describe, it, expect, beforeAll, afterAll } from "vitest";

let supabase;
let adminId;
let originalData;

describe("Utilisateurs", () => {
  beforeAll(async () => {
    supabase = createClient(
      process.env.EXPO_PUBLIC_SUPABASE_URL,
      process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
    );

    const email = process.env.EXPO_PUBLIC_TEST_EMAIL;
    const password = process.env.EXPO_PUBLIC_TEST_PASSWORD;
    if (!email || !password)
      throw new Error(
        "Set EXPO_PUBLIC_TEST_EMAIL and EXPO_PUBLIC_TEST_PASSWORD in .env",
      );

    const { data: authData, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw new Error(`Auth failed: ${error.message}`);

    adminId = authData.user.id;

    // Save original values so we can restore them in afterAll
    const { data } = await supabase
      .from("users")
      .select("name, role, level")
      .eq("id", adminId)
      .single();
    originalData = data;
  });

  afterAll(async () => {
    // Restore the admin user's original values
    if (adminId && originalData) {
      await supabase.from("users").update(originalData).eq("id", adminId);
    }
    await supabase.auth.signOut();
  });

  it("updates name", async () => {
    const { error } = await supabase
      .from("users")
      .update({ name: "[TEST] nom modifié" })
      .eq("id", adminId);

    expect(error).toBeNull();

    const { data } = await supabase
      .from("users")
      .select("name")
      .eq("id", adminId)
      .single();

    expect(data.name).toBe("[TEST] nom modifié");
  });

  it("updates role", async () => {
    const newRole = originalData.role === "admin" ? "professeur" : "admin";

    const { error } = await supabase
      .from("users")
      .update({ role: newRole })
      .eq("id", adminId);

    expect(error).toBeNull();

    const { data } = await supabase
      .from("users")
      .select("role")
      .eq("id", adminId)
      .single();

    expect(data.role).toBe(newRole);
  });

  it("updates level", async () => {
    const newLevel = originalData.level === "beginner" ? "intermediate" : "beginner";

    const { error } = await supabase
      .from("users")
      .update({ level: newLevel })
      .eq("id", adminId);

    expect(error).toBeNull();

    const { data } = await supabase
      .from("users")
      .select("level")
      .eq("id", adminId)
      .single();

    expect(data.level).toBe(newLevel);
  });
});
