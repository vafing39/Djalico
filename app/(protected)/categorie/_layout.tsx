import { Stack } from "expo-router";

export default function ParcoursLayout() {
  return (
    // Always render a navigator or Slot first
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="parcoursScreen"
        options={{ headerShown: false, animation: "none" }}
      />
      <Stack.Screen
        name="allParcoursScreen"
        options={{ headerShown: false, animation: "none" }}
      />
    </Stack>
  );
}
