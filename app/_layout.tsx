import { LanguageProvider } from "@/contexts/LanguageContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { AuthProvider } from "@/contexts/authContext";
import { CategoryProvider } from "@/contexts/categoryContext";
import { VideoProvider } from "@/contexts/videoContext";
import { ParcoursProvider } from "@/contexts/parcoursContext";
import { CourseProvider } from "@/contexts/courseContext";
import { UserProvider } from "@/contexts/userContext";
import { LessonProvider } from "@/contexts/lessonContext";
import { SavedProvider } from "@/contexts/savedContext";

const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <AuthProvider>
          <CategoryProvider>
          <VideoProvider>
            <ParcoursProvider>
              <CourseProvider>
                <UserProvider>
                  <LessonProvider>
                  <SavedProvider>
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
                        name="register"
                        options={{ headerShown: false, animation: "none" }}
                      />
                      <Stack.Screen
                        name="forgot-password"
                        options={{ headerShown: false, animation: "none" }}
                      />
                      <Stack.Screen
                        name="reset-password"
                        options={{ headerShown: false, animation: "none" }}
                      />
                      <Stack.Screen
                        name="(protected)"
                        options={{ headerShown: false, animation: "none" }}
                      />
                    </Stack>
                  </SavedProvider>
                  </LessonProvider>
                </UserProvider>
              </CourseProvider>
            </ParcoursProvider>
          </VideoProvider>
          </CategoryProvider>
        </AuthProvider>
      </LanguageProvider>
      <StatusBar style="auto" />
    </QueryClientProvider>
  );
}
