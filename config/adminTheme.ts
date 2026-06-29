export type TagType = "beginner" | "intermediate" | "expert";

export const color = {
  // Blues / navies
  navy:        "#103149",
  navyDeep:    "#0B2035",
  deepBlue:    "#0E2B45",
  blue:        "#2563EB",
  blueDeep:    "#1A3FBF",
  paleBlue:    "#F3F8FB",
  bgTop:       "#ECF6FF",
  bgBottom:    "#FFFFFF",

  // Neutrals
  white:       "#FFFFFF",
  bg:          "#F7FAFF",
  card:        "#FFFFFF",
  border:      "#E5E7EB",
  textPrimary: "#1F2937",
  textMuted:   "#6B7280",
  softGray:    "#9AA6B2",

  // Accents
  yellow:      "#F6C04F",
  yellowLight: "#FFD66B",
  red:         "#F44336",
  redLight:    "#FFE7E7",
  green:       "#22C55E",
};

export const TAG_STYLES: Record<TagType, { bg: string; text: string }> = {
  beginner:     { bg: "#E9F2FF", text: "#1E4FA5" },
  intermediate: { bg: "#DCFCE7", text: "#166534" },
  expert:       { bg: "#FFF3CD", text: "#92610A" },
};

export const LEVELS: { label: string; value: TagType }[] = [
  { label: "Débutant",      value: "beginner"     },
  { label: "Intermédiaire", value: "intermediate" },
  { label: "Expert",        value: "expert"       },
];

/** Shared raw style definitions for the dark-background Picker control. */
export const pickerStyleDefs = {
  wrap: {
    backgroundColor: color.deepBlue,
    borderRadius: 12,
    borderWidth: 1 as const,
    borderColor: color.border,
    overflow: "hidden" as const,
  },
  picker: { color: color.white },
  item: { color: color.white, backgroundColor: color.deepBlue, fontSize: 14 as const },
};
