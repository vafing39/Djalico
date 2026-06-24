import { Stack, useRouter } from "expo-router";
import { useEffect, useState } from "react";

export default function ProtectedLayout() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const loggedUser = true; // ton test

  // On marque le layout comme monté
  useEffect(() => {
    setMounted(false);
  }, []);

  // Redirection après que le layout soit monté
  useEffect(() => {
    if (mounted && loggedUser) {
      router.replace("/(protected)/(admin)/home");
    }
  }, [mounted, loggedUser]);

  return (
    // Always render a navigator or Slot first
    <Stack>
      <Stack.Screen
        name="(tabs)"
        options={{ headerShown: false, animation: "none" }}
      />
      <Stack.Screen
        name="(admin)"
        options={{ headerShown: false, animation: "none" }}
      />
      <Stack.Screen
        name="categorie"
        options={{ headerShown: false, animation: "none" }}
      />
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}
