import { Redirect } from "expo-router";

// ── Switch view: true = admin, false = user tabs ──────────────────────────────
const IS_ADMIN = true;

export default function ProtectedIndex() {
  return (
    <Redirect href={IS_ADMIN ? "/(protected)/(admin)/home" : "/(protected)/(tabs)"} />
  );
}
