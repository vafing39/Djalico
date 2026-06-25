import { Stack } from "expo-router";

export default function ProtectedLayout() {
  return (
    <Stack>
      <Stack.Screen name="index"    options={{ headerShown: false, animation: "none" }} />
      <Stack.Screen name="(tabs)"   options={{ headerShown: false, animation: "none" }} />
      <Stack.Screen name="(admin)"  options={{ headerShown: false, animation: "none" }} />
      <Stack.Screen name="categorie" options={{ headerShown: false, animation: "none" }} />
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}
