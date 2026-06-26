import { AuthContext } from "@/contexts/authContext";
import { Redirect, Stack } from "expo-router";
import { useContext } from "react";
import { ActivityIndicator, View } from "react-native";

export default function ProtectedLayout() {
  const { session, isLoading, isAdmin } = useContext(AuthContext);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!session) return <Redirect href="/login" />;

  return (
    <Stack>
      <Stack.Screen name="index"      options={{ headerShown: false, animation: "none" }} />
      <Stack.Screen name="(tabs)"     options={{ headerShown: false, animation: "none" }} />
      <Stack.Screen name="(admin)"    options={{ headerShown: false, animation: "none" }} />
      <Stack.Screen name="categorie"  options={{ headerShown: false, animation: "none" }} />
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}
