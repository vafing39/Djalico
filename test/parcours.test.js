import { createClient } from "@supabase/supabase-js";
import { describe, it, expect, beforeAll, afterAll } from "vitest";

let supabase;

const TEST_PARCOURS = {
  title: "[TEST] parcours",
  description: "Description test",
  tag_type: "intermediate",
  total_duration_seconds: 600,
  category_id: null,
  instructor_id: null,
  cover_image_url: null,
};

let parcoursId = null;

describe("Parcours", () => {
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

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw new Error(`Auth failed: ${error.message}`);
  });

  afterAll(async () => {
    if (parcoursId) {
      await supabase.from("parcours_courses").delete().eq("parcours_id", parcoursId);
      await supabase.from("parcours").delete().eq("id", parcoursId);
    }
    await supabase.auth.signOut();
  });

  it("adds a parcours", async () => {
    const { data, error } = await supabase
      .from("parcours")
      .insert(TEST_PARCOURS)
      .select()
      .single();

    expect(error).toBeNull();
    expect(data).toBeDefined();
    expect(data.title).toBe(TEST_PARCOURS.title);
    expect(data.description).toBe(TEST_PARCOURS.description);
    expect(data.tag_type).toBe(TEST_PARCOURS.tag_type);

    parcoursId = data.id;
  });

  it("updates a parcours", async () => {
    expect(parcoursId).not.toBeNull();

    const { error } = await supabase
      .from("parcours")
      .update({ title: "[TEST] parcours updated", description: "Description mise à jour" })
      .eq("id", parcoursId);

    expect(error).toBeNull();

    const { data } = await supabase
      .from("parcours")
      .select("title, description")
      .eq("id", parcoursId)
      .single();

    expect(data.title).toBe("[TEST] parcours updated");
    expect(data.description).toBe("Description mise à jour");
  });

  it("deletes a parcours", async () => {
    expect(parcoursId).not.toBeNull();

    // Delete junction rows first (mirrors the context's deleteParcours logic)
    await supabase.from("parcours_courses").delete().eq("parcours_id", parcoursId);

    const { error } = await supabase
      .from("parcours")
      .delete()
      .eq("id", parcoursId);

    expect(error).toBeNull();

    const { data } = await supabase
      .from("parcours")
      .select("id")
      .eq("id", parcoursId)
      .maybeSingle();

    expect(data).toBeNull();

    parcoursId = null;
  });
});
