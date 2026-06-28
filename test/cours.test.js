import { createClient } from "@supabase/supabase-js";
import { describe, it, expect, beforeAll, afterAll } from "vitest";

let supabase;

const TEST_COURSE = {
  title: "[TEST] cours",
  instructor: "Instructeur Test",
  tag_type: "beginner",
  total_duration_seconds: 300,
  category_id: null,
  image_url: null,
};

let courseId = null;

describe("Cours", () => {
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
    if (courseId) {
      await supabase.from("courses").delete().eq("id", courseId);
    }
    await supabase.auth.signOut();
  });

  it("adds a cours", async () => {
    const { data, error } = await supabase
      .from("courses")
      .insert(TEST_COURSE)
      .select()
      .single();

    expect(error).toBeNull();
    expect(data).toBeDefined();
    expect(data.title).toBe(TEST_COURSE.title);
    expect(data.instructor).toBe(TEST_COURSE.instructor);
    expect(data.tag_type).toBe(TEST_COURSE.tag_type);

    courseId = data.id;
  });

  it("updates a cours", async () => {
    expect(courseId).not.toBeNull();

    const { error } = await supabase
      .from("courses")
      .update({ title: "[TEST] cours updated", instructor: "Nouvel Instructeur" })
      .eq("id", courseId);

    expect(error).toBeNull();

    const { data } = await supabase
      .from("courses")
      .select("title, instructor")
      .eq("id", courseId)
      .single();

    expect(data.title).toBe("[TEST] cours updated");
    expect(data.instructor).toBe("Nouvel Instructeur");
  });

  it("deletes a cours", async () => {
    expect(courseId).not.toBeNull();

    const { error } = await supabase
      .from("courses")
      .delete()
      .eq("id", courseId);

    expect(error).toBeNull();

    const { data } = await supabase
      .from("courses")
      .select("id")
      .eq("id", courseId)
      .maybeSingle();

    expect(data).toBeNull();

    courseId = null;
  });
});
