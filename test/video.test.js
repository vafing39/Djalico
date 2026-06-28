import { createClient } from "@supabase/supabase-js";
import { describe, it, expect, beforeAll, afterAll } from "vitest";

// Initialised in beforeAll once env vars are available
let supabase;

const TEST_VIDEO = {
  title: "[TEST] video",
  subtitle: "test subtitle",
  url: "https://example.com/test.mp4",
  tag_type: "beginner",
  duration_seconds: 120,
  published: false,
  category_id: null,
};

let videoId = null;

describe("Videos", () => {
  beforeAll(async () => {
    // env vars are available here (after vitest has loaded .env)
    supabase = createClient(
      process.env.EXPO_PUBLIC_SUPABASE_URL,
      process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
    );

    const email = process.env.EXPO_PUBLIC_TEST_EMAIL;
    const password = process.env.EXPO_PUBLIC_TEST_PASSWORD;
    if (!email || !password)
      throw new Error("Set EXPO_PUBLIC_TEST_EMAIL and EXPO_PUBLIC_TEST_PASSWORD in .env");

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw new Error(`Auth failed: ${error.message}`);
  });

  afterAll(async () => {
    // Safety cleanup if delete test failed
    if (videoId) {
      await supabase.from("videos").delete().eq("id", videoId);
    }
    await supabase.auth.signOut();
  });

  it("adds a video", async () => {
    const { data, error } = await supabase
      .from("videos")
      .insert(TEST_VIDEO)
      .select()
      .single();

    expect(error).toBeNull();
    expect(data).toBeDefined();
    expect(data.title).toBe(TEST_VIDEO.title);
    expect(data.url).toBe(TEST_VIDEO.url);
    expect(data.published).toBe(false);

    videoId = data.id;
  });

  it("updates a video", async () => {
    expect(videoId).not.toBeNull();

    const { error } = await supabase
      .from("videos")
      .update({ title: "[TEST] video updated", published: true })
      .eq("id", videoId);

    expect(error).toBeNull();

    const { data } = await supabase
      .from("videos")
      .select("title, published")
      .eq("id", videoId)
      .single();

    expect(data.title).toBe("[TEST] video updated");
    expect(data.published).toBe(true);
  });

  it("deletes a video", async () => {
    expect(videoId).not.toBeNull();

    const { error } = await supabase.from("videos").delete().eq("id", videoId);

    expect(error).toBeNull();

    const { data } = await supabase
      .from("videos")
      .select("id")
      .eq("id", videoId)
      .maybeSingle();

    expect(data).toBeNull();

    videoId = null;
  });
});
