import { AuthContext } from "@/contexts/authContext";
import { Redirect } from "expo-router";
import { useContext } from "react";
import { ActivityIndicator, View } from "react-native";

export default function Index() {
  const { session, isAdmin, isLoading, loginPending } = useContext(AuthContext);

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
