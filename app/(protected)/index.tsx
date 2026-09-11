import { useAuth } from "@/hooks/useAuth";
import { Redirect } from "expo-router";
import { ActivityIndicator, View } from "react-native";

export default function ProtectedIndex() {
  const { isAdmin, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <Redirect
      href={isAdmin ? "/(protected)/(admin)/home" : "/(protected)/(tabs)"}
    />
  );
}
