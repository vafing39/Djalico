import { StyleSheet } from "react-native";
import { color } from "@/config/color";

export const onboardingStyles = StyleSheet.create({
  step: { justifyContent: "center", gap: 16, paddingHorizontal: 4 },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: color.deepBlue,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: color.softGray,
    lineHeight: 20,
    textAlign: "center",
  },

  field: { gap: 7 },
  label: {
    fontSize: 13,
    fontWeight: "700",
    color: color.deepBlue,
  },
  inputWrap: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: color.paleBlue,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: "#E5E7EB",
    paddingHorizontal: 14,
    height: 52,
  },
  inputWrapError: {
    borderColor: "#EF4444",
    backgroundColor: "#FFF5F5",
  },
  textAreaWrap: { height: 110, alignItems: "flex-start", paddingVertical: 12 },
  textArea: { height: "100%", textAlignVertical: "top" },
  inputIcon: { marginRight: 10 },
  input: {
    flex: 1,
    fontSize: 15,
    color: color.deepBlue,
    height: "100%",
  },
  fieldError: {
    fontSize: 12,
    color: "#EF4444",
    fontWeight: "500",
    marginLeft: 2,
  },

  chipGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    justifyContent: "center",
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: color.paleBlue,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: "#E5E7EB",
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  chipSelected: {
    borderColor: color.yellowDark,
    backgroundColor: "#FFF7E6",
  },
  chipEmoji: { fontSize: 15 },
  chipText: {
    fontSize: 13,
    fontWeight: "600",
    color: color.deepBlue,
  },
});
