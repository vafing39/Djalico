import { useAuth } from "@/hooks/useAuth";
import { Redirect, Stack, usePathname, useSegments } from "expo-router";
import { ActivityIndicator, View } from "react-native";

export default function ProtectedLayout() {
  const { session, isLoading, isAdmin, profile } = useAuth();
  const pathname = usePathname();
  const segments = useSegments();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!session) return <Redirect href="/login" />;

  // Non-admins must never reach the (admin) route group, no matter how they
  // got there (deep link, guessed URL, stale navigation state).
  if (!isAdmin && (segments as string[]).includes("(admin)")) {
    return <Redirect href="/(protected)/(tabs)" />;
  }

  // Self-registered students must finish onboarding and be validated by an
  // admin before reaching the app; admins bypass this gate entirely.
  if (!isAdmin && profile) {
    if (profile.status === "onboarding" && pathname !== "/onboarding") {
      return <Redirect href="/(protected)/onboarding" />;
    }
    if (profile.status === "pending_review" && pathname !== "/pending-review") {
      return <Redirect href="/(protected)/pending-review" />;
    }
    if (
      profile.status === "active" &&
      (pathname === "/onboarding" || pathname === "/pending-review")
    ) {
      return <Redirect href="/(protected)/(tabs)" />;
    }
  }

  return (
    <Stack>
      <Stack.Screen name="index"          options={{ headerShown: false, animation: "none" }} />
      <Stack.Screen name="onboarding"     options={{ headerShown: false, animation: "none" }} />
      <Stack.Screen name="pending-review" options={{ headerShown: false, animation: "none" }} />
      <Stack.Screen name="(tabs)"         options={{ headerShown: false, animation: "none" }} />
      <Stack.Screen name="(admin)"        options={{ headerShown: false, animation: "none" }} />
      <Stack.Screen name="categorie"      options={{ headerShown: false, animation: "none" }} />
      <Stack.Screen name="legal"          options={{ headerShown: false, animation: "none" }} />
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}
