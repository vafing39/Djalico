import { supabase } from "@/utils/supabase";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Session } from "@supabase/supabase-js";
import { router } from "expo-router";
import { createContext, PropsWithChildren, useEffect, useState } from "react";

export type UserProfile = {
  name: string;
  email: string;
  avatar_url: string | null;
  role: "eleve" | "professeur" | "admin";
};

export type UpdateProfileInput = {
  name: string;
};

type AuthType = {
  session: Session | null;
  profile: UserProfile | null;
  isAdmin: boolean;
  isLoading: boolean;
  login: (credentials: { email: string; password: string }) => void;
  loginPending: boolean;
  loginError: string | null;
  logOut: () => void;
  logoutPending: boolean;
  updateProfile: (input: UpdateProfileInput) => Promise<void>;
  updateProfilePending: boolean;
  updateEmail: (newEmail: string) => Promise<void>;
  updateEmailPending: boolean;
  updatePassword: (newPassword: string) => Promise<void>;
  updatePasswordPending: boolean;
  uploadAvatar: (localUri: string) => Promise<void>;
  uploadAvatarPending: boolean;
};

export const AuthContext = createContext<AuthType>({} as AuthType);

const profileQueryOptions = (userId: string) => ({
  queryKey: ["profile", userId],
  queryFn: async () => {
    const { data, error } = await supabase
      .from("users")
      .select("name, email, avatar_url, role")
      .eq("id", userId)
      .single();
    if (error) throw error;
    return data as UserProfile;
  },
});

export function AuthProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<Session | null>(null);
  const [sessionLoading, setSessionLoading] = useState(true);
  const queryClient = useQueryClient();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setSessionLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const { data: profile, isLoading: profileLoading } = useQuery({
    ...profileQueryOptions(session?.user?.id ?? ""),
    enabled: !!session?.user?.id,
  });

  //General state for admin and login
  const isAdmin = profile?.role === "admin";
  const isLoading = sessionLoading || (!!session && profileLoading);

  //Connection de l'utilisateur
  const { mutate: login, isPending: loginPending, error: loginMutationError } = useMutation({
    mutationFn: async ({
      email,
      password,
    }: {
      email: string;
      password: string;
    }) => {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      return data;
    },
    onSuccess: async (data) => {
      setSession(data.session);
      const fetched = await queryClient.fetchQuery(
        profileQueryOptions(data.user.id),
      );
      router.replace(
        fetched?.role === "admin"
          ? "/(protected)/(admin)/home"
          : "/(protected)/(tabs)",
      );
    },
  });

  const { mutateAsync: updateProfile, isPending: updateProfilePending } = useMutation({
    mutationFn: async (input: UpdateProfileInput) => {
      if (!session?.user?.id) throw new Error("Non connecté.");
      const { error } = await supabase
        .from("users")
        .update({ name: input.name })
        .eq("id", session.user.id);
      if (error) throw error;
    },
    onSuccess: () => {
      if (session?.user?.id) {
        queryClient.invalidateQueries({ queryKey: ["profile", session.user.id] });
      }
    },
  });

  const { mutateAsync: updateEmail, isPending: updateEmailPending } = useMutation({
    mutationFn: async (newEmail: string) => {
      const { error } = await supabase.auth.updateUser({ email: newEmail });
      if (error) throw error;
    },
  });

  const { mutateAsync: uploadAvatar, isPending: uploadAvatarPending } = useMutation({
    mutationFn: async (localUri: string) => {
      if (!session?.user?.id) throw new Error("Non connecté.");
      const response = await fetch(localUri);
      const blob = await response.blob();
      const path = `avatars/${session.user.id}.jpg`;
      const { error: uploadError } = await supabase.storage
        .from("image")
        .upload(path, blob, { upsert: true, contentType: "image/jpeg" });
      if (uploadError) throw uploadError;
      const { data: { publicUrl } } = supabase.storage.from("image").getPublicUrl(path);
      const { error: updateError } = await supabase
        .from("users")
        .update({ avatar_url: publicUrl })
        .eq("id", session.user.id);
      if (updateError) throw updateError;
    },
    onSuccess: () => {
      if (session?.user?.id) {
        queryClient.invalidateQueries({ queryKey: ["profile", session.user.id] });
      }
    },
  });

  const { mutateAsync: updatePassword, isPending: updatePasswordPending } = useMutation({
    mutationFn: async (newPassword: string) => {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
    },
  });

  // deconnexion de l'utilisateur
  const { mutate: logOut, isPending: logoutPending } = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    },
    onSuccess: () => {
      setSession(null);
      queryClient.removeQueries({ queryKey: ["profile"] });
      router.replace("/login");
    },
  });

  return (
    <AuthContext.Provider
      value={{
        session,
        profile: profile ?? null,
        isAdmin,
        isLoading,
        login,
        loginPending,
        loginError: loginMutationError?.message ?? null,
        logOut,
        logoutPending,
        updateProfile,
        updateProfilePending,
        updateEmail,
        updateEmailPending,
        updatePassword,
        updatePasswordPending,
        uploadAvatar,
        uploadAvatarPending,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
