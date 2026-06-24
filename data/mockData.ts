// ─── Types ────────────────────────────────────────────────────────────────────

export type TagType = "expert" | "intermediate" | "beginner";
export type CourseStatus = "en_cours" | "termine" | "non_commence";
export type LessonStatus = "done" | "current" | "locked";

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
}

export interface Course {
  id: string;
  title: string;
  instructor: string;
  tag: string;
  tagType: TagType;
  totalLessons: number;
  completedLessons: number;
  duration: string;
  status: CourseStatus;
  image: string;
  category: string;
  lastWatched?: string;
}

export interface Lesson {
  id: string;
  index: number;
  title: string;
  duration: string;
  status: LessonStatus;
}

export interface Module {
  id: string;
  title: string;
  lessons: Lesson[];
}

export interface ParcoursDetail {
  id: string;
  title: string;
  instructor: string;
  instructorAvatar: string;
  tag: string;
  tagType: TagType;
  totalLessons: number;
  completedLessons: number;
  totalDuration: string;
  category: string;
  description: string;
  coverImage: string;
  modules: Module[];
}

export interface AdminKpi {
  id: string;
  label: string;
  value: number;
  icon: string;
  bg: string;
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
    totalLessons: 12,
    completedLessons: 8,
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
    totalLessons: 8,
    completedLessons: 8,
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
    totalLessons: 10,
    completedLessons: 3,
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
    totalLessons: 15,
    completedLessons: 0,
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
    totalLessons: 20,
    completedLessons: 20,
    duration: "7h 10min",
    status: "termine",
    category: "Théorie",
    lastWatched: "il y a 3 sem.",
    image: "https://images.unsplash.com/photo-1507838153414-b4b713384a76?auto=format&fit=crop&w=800&q=60",
  },
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
  },
  {
    id: "s2",
    title: "Maîtriser le saxophone alto",
    subtitle: "11 vidéos · Intermédiaire",
    level: "Pro",
    duration: "5h 20min",
    image: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?auto=format&fit=crop&w=800&q=60",
  },
  {
    id: "s3",
    title: "Rythme & fingerpicking",
    subtitle: "9 vidéos · Avancé",
    level: "Expert",
    duration: "4h 10min",
    image: "https://images.unsplash.com/photo-1460723237483-7a6dc9d0b212?auto=format&fit=crop&w=800&q=60",
  },
  {
    id: "s4",
    title: "Piano classique — Niveau 1",
    subtitle: "14 vidéos · Tous niveaux",
    level: "Pro",
    duration: "7h 00min",
    image: "https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?auto=format&fit=crop&w=800&q=60",
  },
  {
    id: "s5",
    title: "Balafon traditionnel",
    subtitle: "6 vidéos · Expert",
    level: "Expert",
    duration: "2h 30min",
    image: "https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?auto=format&fit=crop&w=800&q=60",
  },
];

// ─── Parcours detail (shared by parcoursScreen & sauvegardes/[id]) ────────────

export const PARCOURS_DETAIL: ParcoursDetail = {
  id: "p1",
  title: "Chemin vers la guitare",
  instructor: "Marc Dupont",
  instructorAvatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=100&q=60",
  tag: "Expert",
  tagType: "expert",
  totalLessons: 14,
  completedLessons: 7,
  totalDuration: "6h 45min",
  category: "Guitare",
  description:
    "Un parcours complet pour maîtriser la guitare acoustique, des bases aux techniques avancées de fingerstyle et d'improvisation.",
  coverImage:
    "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?auto=format&fit=crop&w=800&q=60",
  modules: [
    {
      id: "m1",
      title: "Les fondamentaux",
      lessons: [
        { id: "l1", index: 1, title: "Posture & prise en main", duration: "12 min", status: "done" },
        { id: "l2", index: 2, title: "Premiers accords ouverts", duration: "18 min", status: "done" },
        { id: "l3", index: 3, title: "Changer d'accord fluidement", duration: "22 min", status: "done" },
        { id: "l4", index: 4, title: "Strumming & rythme de base", duration: "15 min", status: "done" },
      ],
    },
    {
      id: "m2",
      title: "Technique & expressivité",
      lessons: [
        { id: "l5", index: 5, title: "Introduction au fingerpicking", duration: "25 min", status: "done" },
        { id: "l6", index: 6, title: "Gammes pentatoniques", duration: "20 min", status: "done" },
        { id: "l7", index: 7, title: "Bends, slides & vibratos", duration: "28 min", status: "done" },
        { id: "l8", index: 8, title: "Improvisation guidée", duration: "35 min", status: "current" },
      ],
    },
    {
      id: "m3",
      title: "Styles avancés",
      lessons: [
        { id: "l9", index: 9, title: "Fingerstyle acoustique", duration: "32 min", status: "locked" },
        { id: "l10", index: 10, title: "Intro au jazz manouche", duration: "40 min", status: "locked" },
        { id: "l11", index: 11, title: "Arpèges & patterns avancés", duration: "30 min", status: "locked" },
      ],
    },
    {
      id: "m4",
      title: "Projet final",
      lessons: [
        { id: "l12", index: 12, title: "Analyse d'un morceau complet", duration: "38 min", status: "locked" },
        { id: "l13", index: 13, title: "Composition fingerstyle", duration: "45 min", status: "locked" },
        { id: "l14", index: 14, title: "Enregistrement & retour", duration: "20 min", status: "locked" },
      ],
    },
  ],
};

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
  { id: "active", label: "Utilisateurs", value: 56, icon: "people-outline", bg: "#E9F2FF" },
  { id: "videos", label: "Vidéos", value: 34, icon: "videocam-outline", bg: "#FFF3CD" },
  { id: "pending", label: "À valider", value: 4, icon: "hourglass-outline", bg: "#FFE7E7" },
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
