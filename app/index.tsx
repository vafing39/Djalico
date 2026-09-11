import { useAuth } from "@/hooks/useAuth";
import { Redirect } from "expo-router";
import { ActivityIndicator, View } from "react-native";

export default function Index() {
  const { session, isAdmin, isLoading, loginPending } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator />
      </View>
    );
  }

  if (!session) return <Redirect href="/login" />;

  return (
    <Redirect
      href={isAdmin ? "/(protected)/(admin)/home" : "/(protected)/(tabs)"}
    />
  );
}
