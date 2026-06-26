import { LanguageProvider } from "@/contexts/LanguageContext";
import { useColorScheme } from "@/hooks/useColorScheme";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { AuthProvider } from "@/contexts/authContext";
import { VideoProvider } from "@/contexts/videoContext";
import { ParcoursProvider } from "@/contexts/parcoursContext";
import { CourseProvider } from "@/contexts/courseContext";
import { UserProvider } from "@/contexts/userContext";

const queryClient = new QueryClient();

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <LanguageProvider>
          <AuthProvider>
            <VideoProvider>
              <ParcoursProvider>
                <CourseProvider>
                  <UserProvider>
            <Stack>
              <Stack.Screen
                name="index"
                options={{ headerShown: false, animation: "none" }}
              />
              <Stack.Screen
                name="login"
                options={{ headerShown: false, animation: "none" }}
              />
              <Stack.Screen
                name="(protected)"
                options={{ headerShown: false, animation: "none" }}
              />
            </Stack>
                  </UserProvider>
                </CourseProvider>
              </ParcoursProvider>
            </VideoProvider>
          </AuthProvider>
        </LanguageProvider>
        <StatusBar style="auto" />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
