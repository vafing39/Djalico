// ─── Types ────────────────────────────────────────────────────────────────────

export type TagType = "expert" | "intermediate" | "beginner";
export type CourseStatus = "en_cours" | "termine" | "non_commence";
export type LessonStatus = "done" | "current" | "available" | "locked";

export interface Category {
  id: string;
  title: string;
  emoji: string;
}

export interface FeaturedItem {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  badgeLight: boolean;
  gradientStart: string;
  gradientEnd: string;
  categorie: string;
}

export interface VideoItem {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  tag: string;
  tagType: TagType;
  progress: number;
  bookmarked: boolean;
  categorie: string;
  url: string;
}

export interface Theme {
  id: string;
  title: string;
  count: string;
  emoji: string;
  colors: [string, string];
}

export interface ParcoursItem {
  id: string;
  title: string;
  subtitle: string;
  level: string;
  duration: string;
  image: string;
  progress?: number; // 0–1
}

export interface Course {
  id: string;
  title: string;
  instructor: string;
  tag: string;
  tagType: TagType;
  duration: string;
  status: CourseStatus;
  image: string;
  category: string;
  lastWatched?: string;
}

export interface CourseLesson {
  id: string;
  courseId: string;
  index: number;
  title: string;
  duration: string;
  url: string;
}

export interface Lesson {
  id: string;
  index: number;
  title: string;
  duration: string;
  status: LessonStatus;
  url: string;
}

export interface ParcoursSection {
  id: string;
  courseId: string; // references MY_COURSES[].id
}

export interface ParcoursDetail {
  id: string;
  title: string;
  instructor: string;
  instructorAvatar: string;
  tag: string;
  tagType: TagType;
  totalDuration: string;
  category: string;
  description: string;
  coverImage: string;
  courses: ParcoursSection[];
}

export interface AdminKpi {
  id: string;
  label: string;
  value: number;
  icon: string;
  bg: string;
  iconColor: string;
  trend: string;
  trendUp: boolean;
}

export interface AdminPieSlice {
  value: number;
  color: string;
  text: string;
}

export interface AdminSatisfactionItem {
  label: string;
  value: number;
  color: string;
}

export interface AdminActivity {
  id: string;
  icon: string;
  color: string;
  text: string;
  time: string;
}

export interface AdminVideo {
  id: string;
  title: string;
  duration: string;
  thumbnail: string;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface CurrentUser {
  name: string;
  avatar: string;
  level: TagType;
}

// ─── Current user (replace with real API data once auth is wired) ─────────────

export const CURRENT_USER: CurrentUser = {
  name: "Magdalena",
  avatar:
    "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=60",
  level: "expert",
};

// ─── Home screen ──────────────────────────────────────────────────────────────

export const CATEGORIES: Category[] = [
  { id: "0", title: "Tout", emoji: "🎵" },
  { id: "1", title: "Guitare", emoji: "🎸" },
  { id: "2", title: "Basse", emoji: "🎸" },
  { id: "3", title: "Trompette", emoji: "🎺" },
  { id: "4", title: "Piano", emoji: "🎹" },
  { id: "5", title: "Saxophone", emoji: "🎷" },
  { id: "6", title: "Balafon", emoji: "🥁" },
];

export const FEATURED_PARCOURS: FeaturedItem[] = [
  {
    id: "f1",
    title: "Guitare acoustique débutant",
    subtitle: "8 vidéos · 3h 45min",
    badge: "Débutant",
    badgeLight: true,
    gradientStart: "#0E2B45",
    gradientEnd: "#1A5F9A",
    categorie: "Guitare",
  },
  {
    id: "f2",
    title: "Maîtriser le saxophone alto",
    subtitle: "11 vidéos · 5h 20min",
    badge: "Intermédiaire",
    badgeLight: true,
    gradientStart: "#1a3d5c",
    gradientEnd: "#2A7FA5",
    categorie: "Saxophone",
  },
  {
    id: "f3",
    title: "Piano classique — Niveau 1",
    subtitle: "14 vidéos · 7h 00min",
    badge: "Débutant",
    badgeLight: true,
    gradientStart: "#2E4A1E",
    gradientEnd: "#5A8A3C",
    categorie: "Piano",
  },
  {
    id: "f4",
    title: "Balafon traditionnel",
    subtitle: "6 vidéos · 2h 30min",
    badge: "Expert",
    badgeLight: false,
    gradientStart: "#5C2E00",
    gradientEnd: "#A0522D",
    categorie: "Balafon",
  },
];

export const HOME_VIDEOS: VideoItem[] = [
  {
    id: "v1",
    title: "Les accords ouverts de base",
    subtitle: "Guitare acoustique · 22 min",
    image: "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?auto=format&fit=crop&w=200&q=60",
    tag: "Débutant",
    tagType: "beginner",
    progress: 0.72,
    bookmarked: true,
    categorie: "Guitare",
    url: "https://www.youtube.com/watch?v=g4tEghJ8E7E",
  },
  {
    id: "v2",
    title: "Lecture de partition — Do majeur",
    subtitle: "Solfège · 18 min",
    image: "https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?auto=format&fit=crop&w=200&q=60",
    tag: "Débutant",
    tagType: "beginner",
    progress: 0.4,
    bookmarked: false,
    categorie: "Piano",
    url: "https://www.youtube.com/watch?v=g4tEghJ8E7E",
  },
  {
    id: "v3",
    title: "Improvisation blues au saxophone",
    subtitle: "Saxophone alto · 35 min",
    image: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?auto=format&fit=crop&w=200&q=60",
    tag: "Intermédiaire",
    tagType: "intermediate",
    progress: 0,
    bookmarked: false,
    categorie: "Saxophone",
    url: "https://www.youtube.com/watch?v=g4tEghJ8E7E",
  },
  {
    id: "v4",
    title: "Rythmes de base au balafon",
    subtitle: "Balafon · 28 min",
    image: "https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?auto=format&fit=crop&w=200&q=60",
    tag: "Débutant",
    tagType: "beginner",
    progress: 0,
    bookmarked: false,
    categorie: "Balafon",
    url: "https://www.youtube.com/watch?v=g4tEghJ8E7E",
  },
  {
    id: "v5",
    title: "Gamme de trompette — Exercices",
    subtitle: "Trompette · 20 min",
    image: "https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?auto=format&fit=crop&w=200&q=60",
    tag: "Intermédiaire",
    tagType: "intermediate",
    progress: 0.55,
    bookmarked: true,
    categorie: "Trompette",
    url: "https://www.youtube.com/watch?v=g4tEghJ8E7E",
  },
];

// ─── Explorer screen ──────────────────────────────────────────────────────────

export const THEMES: Theme[] = [
  {
    id: "t1",
    title: "Cordes",
    count: "38 vidéos",
    emoji: "🎸",
    colors: ["#0E2B45", "#1A5F9A"],
  },
  {
    id: "t2",
    title: "Cuivres",
    count: "24 vidéos",
    emoji: "🎺",
    colors: ["#7B4F2E", "#C4813D"],
  },
  {
    id: "t3",
    title: "Claviers",
    count: "31 vidéos",
    emoji: "🎹",
    colors: ["#1a3d5c", "#2E7D6B"],
  },
  {
    id: "t4",
    title: "Percussions",
    count: "17 vidéos",
    emoji: "🥁",
    colors: ["#3D1A5E", "#7A3BAA"],
  },
];

export const EXPLORER_PARCOURS: VideoItem[] = [
  {
    id: "p1",
    title: "Guitare acoustique débutant",
    subtitle: "8 vidéos · 3h 45min",
    image: "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?auto=format&fit=crop&w=200&q=60",
    tag: "Débutant",
    tagType: "beginner",
    progress: 0,
    bookmarked: false,
    categorie: "Guitare",
    url: "",
  },
  {
    id: "p2",
    title: "Maîtriser le saxophone alto",
    subtitle: "11 vidéos · 5h 20min",
    image: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?auto=format&fit=crop&w=200&q=60",
    tag: "Intermédiaire",
    tagType: "intermediate",
    progress: 0,
    bookmarked: true,
    categorie: "Saxophone",
    url: "",
  },
  {
    id: "p3",
    title: "Piano classique — Niveau 1",
    subtitle: "14 vidéos · 7h 00min",
    image: "https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?auto=format&fit=crop&w=200&q=60",
    tag: "Débutant",
    tagType: "beginner",
    progress: 0,
    bookmarked: false,
    categorie: "Piano",
    url: "",
  },
];

export const EXPLORER_VIDEOS: VideoItem[] = [
  {
    id: "ev1",
    title: "Fingerstyle acoustique — Pattern 1",
    subtitle: "Guitare · 28 min",
    image: "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?auto=format&fit=crop&w=200&q=60",
    tag: "Intermédiaire",
    tagType: "intermediate",
    progress: 0,
    bookmarked: true,
    categorie: "Guitare",
    url: "https://www.youtube.com/watch?v=g4tEghJ8E7E",
  },
  {
    id: "ev2",
    title: "Gammes pentatoniques mineures",
    subtitle: "Piano · 22 min",
    image: "https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?auto=format&fit=crop&w=200&q=60",
    tag: "Intermédiaire",
    tagType: "intermediate",
    progress: 0,
    bookmarked: false,
    categorie: "Piano",
    url: "https://www.youtube.com/watch?v=g4tEghJ8E7E",
  },
  {
    id: "ev3",
    title: "Introduction au jazz manouche",
    subtitle: "Guitare · 40 min",
    image: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?auto=format&fit=crop&w=200&q=60",
    tag: "Expert",
    tagType: "expert",
    progress: 0,
    bookmarked: false,
    categorie: "Guitare",
    url: "https://www.youtube.com/watch?v=g4tEghJ8E7E",
  },
  {
    id: "ev4",
    title: "Souffle et embouchure — Trompette",
    subtitle: "Trompette · 15 min",
    image: "https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?auto=format&fit=crop&w=200&q=60",
    tag: "Débutant",
    tagType: "beginner",
    progress: 0,
    bookmarked: false,
    categorie: "Trompette",
    url: "https://www.youtube.com/watch?v=g4tEghJ8E7E",
  },
  {
    id: "ev5",
    title: "Rythmes traditionnels — Balafon",
    subtitle: "Balafon · 32 min",
    image: "https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?auto=format&fit=crop&w=200&q=60",
    tag: "Débutant",
    tagType: "beginner",
    progress: 0,
    bookmarked: true,
    categorie: "Balafon",
    url: "https://www.youtube.com/watch?v=g4tEghJ8E7E",
  },
];

// ─── Mes Cours screen ─────────────────────────────────────────────────────────

export const MY_COURSES: Course[] = [
  {
    id: "c1",
    title: "Fingerstyle acoustique",
    instructor: "Marc Dupont",
    tag: "Expert",
    tagType: "expert",
    duration: "4h 30min",
    status: "en_cours",
    category: "Guitare",
    lastWatched: "il y a 2 jours",
    image: "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?auto=format&fit=crop&w=800&q=60",
  },
  {
    id: "c2",
    title: "Gammes pentatoniques",
    instructor: "Sophie Martin",
    tag: "Intermédiaire",
    tagType: "intermediate",
    duration: "2h 15min",
    status: "termine",
    category: "Piano",
    lastWatched: "il y a 1 sem.",
    image: "https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?auto=format&fit=crop&w=800&q=60",
  },
  {
    id: "c3",
    title: "Intro au jazz manouche",
    instructor: "Louis Berger",
    tag: "Débutant",
    tagType: "beginner",
    duration: "3h 45min",
    status: "en_cours",
    category: "Guitare",
    lastWatched: "hier",
    image: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?auto=format&fit=crop&w=800&q=60",
  },
  {
    id: "c4",
    title: "Percussions africaines — Djembé",
    instructor: "Kofi Mensah",
    tag: "Débutant",
    tagType: "beginner",
    duration: "5h 00min",
    status: "non_commence",
    category: "Percussions",
    image: "https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?auto=format&fit=crop&w=800&q=60",
  },
  {
    id: "c5",
    title: "Harmonie & composition",
    instructor: "Claire Vidal",
    tag: "Expert",
    tagType: "expert",
    duration: "7h 10min",
    status: "termine",
    category: "Théorie",
    lastWatched: "il y a 3 sem.",
    image: "https://images.unsplash.com/photo-1507838153414-b4b713384a76?auto=format&fit=crop&w=800&q=60",
  },
];

// ─── Cours leçons (table liée par courseId) ───────────────────────────────────

const YT   = "https://www.youtube.com/watch?v=g4tEghJ8E7E";
const MP4A = "https://media.w3.org/2010/05/bunny/trailer.mp4";
const MP4B = "https://media.w3.org/2010/05/sintel/trailer.mp4";

export const COURSE_LESSONS: CourseLesson[] = [
  // c1 — Fingerstyle acoustique
  { id: "lc1_1", courseId: "c1", index: 1, title: "Introduction & posture",         duration: "12 min", url: YT   },
  { id: "lc1_2", courseId: "c1", index: 2, title: "Accords fondamentaux",            duration: "18 min", url: MP4A },
  { id: "lc1_3", courseId: "c1", index: 3, title: "Techniques fingerstyle de base",  duration: "25 min", url: MP4B },
  { id: "lc1_4", courseId: "c1", index: 4, title: "Enchaînements et fluidité",       duration: "22 min", url: YT   },

  // c2 — Gammes pentatoniques
  { id: "lc2_1", courseId: "c2", index: 1, title: "Les 5 positions de la gamme",     duration: "20 min", url: MP4B },
  { id: "lc2_2", courseId: "c2", index: 2, title: "Application sur le manche",       duration: "15 min", url: YT   },
  { id: "lc2_3", courseId: "c2", index: 3, title: "Improvisation guidée",            duration: "30 min", url: MP4A },

  // c3 — Intro au jazz manouche
  { id: "lc3_1", courseId: "c3", index: 1, title: "Histoire & esthétique",           duration: "15 min", url: YT   },
  { id: "lc3_2", courseId: "c3", index: 2, title: "La pompe manouche",               duration: "25 min", url: MP4A },
  { id: "lc3_3", courseId: "c3", index: 3, title: "Accords de jazz",                 duration: "20 min", url: MP4B },
  { id: "lc3_4", courseId: "c3", index: 4, title: "Phrases mélodiques typiques",     duration: "30 min", url: YT   },

  // c4 — Percussions africaines
  { id: "lc4_1", courseId: "c4", index: 1, title: "Origines et tenue du djembé",     duration: "10 min", url: MP4A },
  { id: "lc4_2", courseId: "c4", index: 2, title: "Sons de base : basse, ton, gifle","duration": "20 min", url: MP4B },
  { id: "lc4_3", courseId: "c4", index: 3, title: "Premier rythme : Kuku",           duration: "25 min", url: YT   },
  { id: "lc4_4", courseId: "c4", index: 4, title: "Polyrhythmie et dialogue",        duration: "35 min", url: MP4A },

  // c5 — Harmonie & composition
  { id: "lc5_1", courseId: "c5", index: 1, title: "Intervalles et gammes",           duration: "20 min", url: MP4B },
  { id: "lc5_2", courseId: "c5", index: 2, title: "Construction des accords",        duration: "25 min", url: YT   },
  { id: "lc5_3", courseId: "c5", index: 3, title: "Progressions harmoniques",        duration: "30 min", url: MP4A },
  { id: "lc5_4", courseId: "c5", index: 4, title: "Composition d'une mélodie",       duration: "35 min", url: MP4B },
];

// ─── Sauvegardes screen ───────────────────────────────────────────────────────

export const SAVED_PARCOURS: ParcoursItem[] = [
  {
    id: "s1",
    title: "Chemin vers la guitare",
    subtitle: "8 vidéos · Débutant",
    level: "Expert",
    duration: "3h 20min",
    image: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=800&q=60",
    progress: 0.5,
  },
  {
    id: "s2",
    title: "Maîtriser le saxophone alto",
    subtitle: "11 vidéos · Intermédiaire",
    level: "Pro",
    duration: "5h 20min",
    image: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?auto=format&fit=crop&w=800&q=60",
    progress: 0.22,
  },
  {
    id: "s3",
    title: "Rythme & fingerpicking",
    subtitle: "9 vidéos · Avancé",
    level: "Expert",
    duration: "4h 10min",
    image: "https://images.unsplash.com/photo-1460723237483-7a6dc9d0b212?auto=format&fit=crop&w=800&q=60",
    progress: 0.75,
  },
  {
    id: "s4",
    title: "Piano classique — Niveau 1",
    subtitle: "14 vidéos · Tous niveaux",
    level: "Pro",
    duration: "7h 00min",
    image: "https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?auto=format&fit=crop&w=800&q=60",
    progress: 0.1,
  },
  {
    id: "s5",
    title: "Balafon traditionnel",
    subtitle: "6 vidéos · Expert",
    level: "Expert",
    duration: "2h 30min",
    image: "https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?auto=format&fit=crop&w=800&q=60",
    progress: 0,
  },
];

// ─── Parcours details ─────────────────────────────────────────────────────────

// MY_COURSES ids: c1=Fingerstyle, c2=Gammes pentatoniques, c3=Jazz manouche, c4=Percussions, c5=Harmonie
const GUITARE_DETAIL: ParcoursDetail = {
  id: "p1",
  title: "Chemin vers la guitare",
  instructor: "Marc Dupont",
  instructorAvatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=100&q=60",
  tag: "Expert", tagType: "expert",
  totalDuration: "6h 45min", category: "Guitare",
  description: "Un parcours complet pour maîtriser la guitare acoustique, des bases aux techniques avancées de fingerstyle et d'improvisation.",
  coverImage: "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?auto=format&fit=crop&w=800&q=60",
  courses: [
    { id: "p1s1", courseId: "c3" }, // Intro au jazz manouche
    { id: "p1s2", courseId: "c1" }, // Fingerstyle acoustique
  ],
};

const SAXOPHONE_DETAIL: ParcoursDetail = {
  id: "p2",
  title: "Maîtriser le saxophone alto",
  instructor: "Sophie Martin",
  instructorAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=60",
  tag: "Intermédiaire", tagType: "intermediate",
  totalDuration: "5h 20min", category: "Saxophone",
  description: "Apprenez les bases et les techniques intermédiaires du saxophone alto, des premières notes aux improvisations jazz.",
  coverImage: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?auto=format&fit=crop&w=800&q=60",
  courses: [
    { id: "p2s1", courseId: "c3" }, // Intro au jazz manouche
    { id: "p2s2", courseId: "c5" }, // Harmonie & composition
  ],
};

const FINGERPICKING_DETAIL: ParcoursDetail = {
  id: "p3",
  title: "Rythme & fingerpicking",
  instructor: "Lucas Bernard",
  instructorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=60",
  tag: "Expert", tagType: "expert",
  totalDuration: "4h 10min", category: "Guitare",
  description: "Maîtrisez les techniques de rythmique et de fingerpicking pour guitare acoustique, du Travis picking aux patterns complexes.",
  coverImage: "https://images.unsplash.com/photo-1460723237483-7a6dc9d0b212?auto=format&fit=crop&w=800&q=60",
  courses: [
    { id: "p3s1", courseId: "c1" }, // Fingerstyle acoustique
    { id: "p3s2", courseId: "c5" }, // Harmonie & composition
  ],
};

const PIANO_DETAIL: ParcoursDetail = {
  id: "p4",
  title: "Piano classique — Niveau 1",
  instructor: "Claire Vidal",
  instructorAvatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=100&q=60",
  tag: "Débutant", tagType: "beginner",
  totalDuration: "7h 00min", category: "Piano",
  description: "Un parcours progressif pour apprendre le piano classique en partant de zéro, jusqu'aux premières pièces de répertoire.",
  coverImage: "https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?auto=format&fit=crop&w=800&q=60",
  courses: [
    { id: "p4s1", courseId: "c2" }, // Gammes pentatoniques
    { id: "p4s2", courseId: "c5" }, // Harmonie & composition
  ],
};

const BALAFON_DETAIL: ParcoursDetail = {
  id: "p5",
  title: "Balafon traditionnel",
  instructor: "Sékou Diabaté",
  instructorAvatar: "https://images.unsplash.com/photo-1530268729831-4b0b9e170218?auto=format&fit=crop&w=100&q=60",
  tag: "Expert", tagType: "expert",
  totalDuration: "2h 30min", category: "Percussions",
  description: "Découvrez le balafon, instrument traditionnel d'Afrique de l'Ouest, et maîtrisez ses rythmes fondamentaux.",
  coverImage: "https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?auto=format&fit=crop&w=800&q=60",
  courses: [
    { id: "p5s1", courseId: "c4" }, // Percussions africaines — Djembé
  ],
};

const JAZZ_DETAIL: ParcoursDetail = {
  id: "p6",
  title: "Improvisation jazz manouche",
  instructor: "Django Rémy",
  instructorAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=60",
  tag: "Expert", tagType: "expert",
  totalDuration: "3h 55min", category: "Guitare",
  description: "Plongez dans l'univers du jazz manouche et apprenez à improviser dans le style de Django Reinhardt.",
  coverImage: "https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?auto=format&fit=crop&w=800&q=60",
  courses: [
    { id: "p6s1", courseId: "c3" }, // Intro au jazz manouche
    { id: "p6s2", courseId: "c5" }, // Harmonie & composition
  ],
};

export const PARCOURS_DETAILS: Record<string, ParcoursDetail> = {
  p1: GUITARE_DETAIL,      p2: SAXOPHONE_DETAIL,     p3: FINGERPICKING_DETAIL,
  p4: PIANO_DETAIL,        p5: BALAFON_DETAIL,        p6: JAZZ_DETAIL,
  // saved
  s1: GUITARE_DETAIL,      s2: SAXOPHONE_DETAIL,     s3: FINGERPICKING_DETAIL,
  s4: PIANO_DETAIL,        s5: BALAFON_DETAIL,
  // catalogue
  ap1: GUITARE_DETAIL,     ap2: SAXOPHONE_DETAIL,    ap3: FINGERPICKING_DETAIL,
  ap4: PIANO_DETAIL,       ap5: BALAFON_DETAIL,       ap6: JAZZ_DETAIL,
  // featured
  f1: GUITARE_DETAIL,      f2: SAXOPHONE_DETAIL,
  f3: PIANO_DETAIL,        f4: BALAFON_DETAIL,
};

export const PARCOURS_DETAIL = GUITARE_DETAIL;

// ─── All parcours list (categorie/allParcoursScreen) ──────────────────────────

export const ALL_PARCOURS: ParcoursItem[] = [
  {
    id: "ap1",
    title: "Chemin vers la guitare",
    subtitle: "8 vidéos · Débutant",
    level: "Expert",
    duration: "3h 20min",
    image: "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?auto=format&fit=crop&w=800&q=60",
  },
  {
    id: "ap2",
    title: "Maîtriser le saxophone alto",
    subtitle: "11 vidéos · Intermédiaire",
    level: "Pro",
    duration: "5h 20min",
    image: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?auto=format&fit=crop&w=800&q=60",
  },
  {
    id: "ap3",
    title: "Rythme & fingerpicking",
    subtitle: "9 vidéos · Avancé",
    level: "Expert",
    duration: "4h 10min",
    image: "https://images.unsplash.com/photo-1460723237483-7a6dc9d0b212?auto=format&fit=crop&w=800&q=60",
  },
  {
    id: "ap4",
    title: "Piano classique — Niveau 1",
    subtitle: "14 vidéos · Tous niveaux",
    level: "Pro",
    duration: "7h 00min",
    image: "https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?auto=format&fit=crop&w=800&q=60",
  },
  {
    id: "ap5",
    title: "Balafon traditionnel",
    subtitle: "6 vidéos · Expert",
    level: "Expert",
    duration: "2h 30min",
    image: "https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?auto=format&fit=crop&w=800&q=60",
  },
  {
    id: "ap6",
    title: "Improvisation jazz manouche",
    subtitle: "7 vidéos · Expert",
    level: "Expert",
    duration: "3h 55min",
    image: "https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?auto=format&fit=crop&w=800&q=60",
  },
];

// ─── Admin dashboard ──────────────────────────────────────────────────────────

export const ADMIN_KPI: AdminKpi[] = [
  { id: "active",  label: "Utilisateurs", value: 56, icon: "people-outline",    bg: "#E9F2FF", iconColor: "#1E88E5", trend: "+12%", trendUp: true  },
  { id: "videos",  label: "Vidéos",       value: 34, icon: "videocam-outline",  bg: "#FFF3CD", iconColor: "#F59E0B", trend: "+5%",  trendUp: true  },
  { id: "pending", label: "À valider",    value: 4,  icon: "hourglass-outline", bg: "#FFE7E7", iconColor: "#F44336", trend: "+2",   trendUp: false },
];

export const ADMIN_PIE_DATA: AdminPieSlice[] = [
  { value: 47, color: "#F6C04F", text: "Excellent" },
  { value: 40, color: "#FFEB3B", text: "Bien" },
  { value: 16, color: "#E9F2FF", text: "Moyen" },
  { value: 3, color: "#103149", text: "Faible" },
];

export const ADMIN_SATISFACTION: AdminSatisfactionItem[] = [
  { label: "Guitare", value: 47, color: "#F6C04F" },
  { label: "Balafon", value: 40, color: "#E9F2FF" },
  { label: "Piano", value: 16, color: "#103149" },
  { label: "Saxophone", value: 3, color: "#FFEB3B" },
];

export const ADMIN_ACTIVITY: AdminActivity[] = [
  {
    id: "1",
    icon: "person-outline",
    color: "#1E88E5",
    text: "Aminata Diallo a rejoint la plateforme",
    time: "il y a 2h",
  },
  {
    id: "2",
    icon: "videocam-outline",
    color: "#FF7043",
    text: "Nouvelle vidéo ajoutée : « Balafon — Rythmes fondamentaux »",
    time: "il y a 4h",
  },
  {
    id: "3",
    icon: "checkmark-circle-outline",
    color: "#4CAF50",
    text: "6 élèves ont terminé le parcours Guitare Débutant",
    time: "il y a 6h",
  },
  {
    id: "4",
    icon: "alert-circle-outline",
    color: "#F44336",
    text: "2 vidéos en attente de validation",
    time: "il y a 8h",
  },
];

// ─── Admin gestion vidéo ──────────────────────────────────────────────────────

export const ADMIN_VIDEOS: AdminVideo[] = [
  {
    id: "1",
    title: "Les accords ouverts de base",
    duration: "22:14",
    thumbnail: "https://images.pexels.com/photos/9437696/pexels-photo-9437696.jpeg",
  },
  {
    id: "2",
    title: "Introduction au fingerpicking",
    duration: "28:05",
    thumbnail: "https://images.pexels.com/photos/9437696/pexels-photo-9437696.jpeg",
  },
  {
    id: "3",
    title: "Rythmes traditionnels — Balafon",
    duration: "31:47",
    thumbnail: "https://images.pexels.com/photos/9437696/pexels-photo-9437696.jpeg",
  },
];

// ─── Admin gestion utilisateurs ───────────────────────────────────────────────

export const ADMIN_USERS_INITIAL: AdminUser[] = [
  { id: "1", name: "Aminata Diallo", email: "aminata@djalico.com", role: "Élève" },
  { id: "2", name: "Jean-Marc Dupont", email: "jm.dupont@djalico.com", role: "Professeur" },
  { id: "3", name: "Sophie Leroy", email: "s.leroy@djalico.com", role: "Élève" },
  { id: "4", name: "Kofi Mensah", email: "kofi@djalico.com", role: "Professeur" },
  { id: "5", name: "Claire Vidal", email: "c.vidal@djalico.com", role: "Admin" },
];
