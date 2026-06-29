// ─── Shared primitives ────────────────────────────────────────────────────────

export type TagType = "beginner" | "intermediate" | "expert";

export type Category = { id: string; title: string; emoji: string };

// ─── Auth / Profile ───────────────────────────────────────────────────────────

export type UserProfile = {
  name: string;
  email: string;
  avatar_url: string | null;
  role: "eleve" | "professeur" | "admin";
};

export type UpdateProfileInput = {
  name: string;
};

// ─── Users ────────────────────────────────────────────────────────────────────

export type User = {
  id: string;
  name: string;
  email: string;
  avatar_url: string | null;
  role: "eleve" | "professeur" | "admin";
  level: TagType;
  created_at: string;
};

export type UserPayload = {
  name: string;
  role: "eleve" | "professeur" | "admin";
  level: TagType;
};

export type CreateUserInput = {
  name: string;
  email: string;
  password: string;
  role: "eleve" | "professeur" | "admin";
  level: TagType;
};

// ─── Videos ───────────────────────────────────────────────────────────────────

export type Video = {
  id: string;
  title: string;
  subtitle: string | null;
  url: string;
  image_url: string | null;
  tag_type: TagType;
  duration_seconds: number;
  published: boolean;
  created_at: string;
  category: Category | null;
};

export type VideoPayload = {
  title: string;
  subtitle?: string | null;
  category_id?: string | null;
  tag_type: TagType;
  url: string;
  image_url?: string | null;
  duration_seconds: number;
  published: boolean;
};

export type SaveVideoInput = {
  editId?: string | null;
  videoUri: string | null;
  videoUrl: string;
  imageUri: string | null;
  imageUrl: string;
  title: string;
  subtitle: string;
  categoryId: string;
  tagType: TagType;
  durationSeconds: number;
  published: boolean;
  courseId: string;
};

// ─── Courses ──────────────────────────────────────────────────────────────────

export type Course = {
  id: string;
  title: string;
  instructor: string;
  tag_type: TagType;
  image_url: string | null;
  total_duration_seconds: number;
  created_at: string;
  category: Category | null;
};

export type CoursePayload = {
  title: string;
  instructor: string;
  category_id?: string | null;
  tag_type: TagType;
  image_url?: string | null;
  total_duration_seconds: number;
};

export type SaveCourseInput = {
  editId?: string | null;
  imageUri: string | null;
  imageUrl: string;
  title: string;
  instructor: string;
  categoryId: string;
  tagType: TagType;
  totalDurationSeconds: number;
};

// ─── Parcours ─────────────────────────────────────────────────────────────────

export type Parcours = {
  id: string;
  title: string;
  description: string | null;
  cover_image_url: string | null;
  tag_type: TagType;
  total_duration_seconds: number;
  created_at: string;
  category: Category | null;
  instructor: { id: string; name: string; avatar_url: string | null } | null;
};

export type ParcoursPayload = {
  title: string;
  description?: string | null;
  category_id?: string | null;
  instructor_id?: string | null;
  tag_type: TagType;
  cover_image_url?: string | null;
  total_duration_seconds: number;
};

export type SaveParcoursInput = {
  editId?: string | null;
  coverImageUri: string | null;
  coverImageUrl: string;
  title: string;
  description: string;
  categoryId: string;
  instructorId: string;
  tagType: TagType;
  totalDurationSeconds: number;
  courseIds: string[];
};

// ─── Lessons ──────────────────────────────────────────────────────────────────

export type Lesson = {
  id: string;
  course_id: string;
  index: number;
  title: string;
  url: string;
  duration_seconds: number;
};

// ─── Audit ────────────────────────────────────────────────────────────────────

export type AuditEntry = {
  id: string;
  action: string;
  entity_type: string;
  entity_title: string;
  created_at: string;
  actor_name: string | null;
};

// ─── Progress / playback ──────────────────────────────────────────────────────

export type LessonProgress = Record<string, { pct: number; time: number }>;

export type SelectedLesson = { id: string; url: string; title: string };
