import { supabase } from "@/utils/supabase";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Session } from "@supabase/supabase-js";
import { router } from "expo-router";
import * as Linking from "expo-linking";
import { createContext, PropsWithChildren, useEffect, useState } from "react";
import type { UserProfile, UpdateProfileInput, OnboardingInput } from "@/types";

export type { UserProfile, UpdateProfileInput };

type AuthType = {
  session: Session | null;
  profile: UserProfile | null;
  isAdmin: boolean;
  isLoading: boolean;
  login: (credentials: { email: string; password: string }) => void;
  loginPending: boolean;
  loginError: string | null;
  register: (input: { name: string; email: string; password: string }) => void;
  registerPending: boolean;
  registerError: string | null;
  registerRequiresConfirmation: boolean;
  resetRegister: () => void;
  requestPasswordReset: (email: string) => void;
  requestPasswordResetPending: boolean;
  requestPasswordResetError: string | null;
  requestPasswordResetSuccess: boolean;
  resetRequestPasswordReset: () => void;
  verifyRecoverySession: (tokens: {
    access_token: string;
    refresh_token: string;
  }) => void;
  verifyRecoverySessionPending: boolean;
  verifyRecoverySessionError: string | null;
  verifyRecoverySessionSuccess: boolean;
  logOut: () => void;
  logoutPending: boolean;
  refreshProfile: () => void;
  completeOnboarding: (input: OnboardingInput) => Promise<void>;
  completeOnboardingPending: boolean;
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
      .select("name, email, avatar_url, role, level, status")
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
  const {
    mutate: login,
    isPending: loginPending,
    error: loginMutationError,
  } = useMutation({
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

  // Création de compte (auto-connexion si aucune confirmation email n'est requise)
  const {
    mutate: register,
    reset: resetRegister,
    isPending: registerPending,
    error: registerMutationError,
    data: registerResult,
  } = useMutation({
    mutationFn: async ({
      name,
      email,
      password,
    }: {
      name: string;
      email: string;
      password: string;
    }) => {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { name } },
      });
      if (error) throw error;
      return data;
    },
    onSuccess: async (data) => {
      if (!data.session) return;
      setSession(data.session);
      const fetched = await queryClient.fetchQuery(
        profileQueryOptions(data.user!.id),
      );
      router.replace(
        fetched?.role === "admin"
          ? "/(protected)/(admin)/home"
          : "/(protected)/(tabs)",
      );
    },
  });
  const registerRequiresConfirmation = !!registerResult && !registerResult.session;

  // Demande de réinitialisation du mot de passe (envoi de l'email)
  const {
    mutate: requestPasswordReset,
    reset: resetRequestPasswordReset,
    isPending: requestPasswordResetPending,
    error: requestPasswordResetMutationError,
    isSuccess: requestPasswordResetSuccess,
  } = useMutation({
    mutationFn: async (email: string) => {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: Linking.createURL("reset-password"),
      });
      if (error) throw error;
    },
  });

  // Établissement de la session de récupération à partir des tokens du lien reçu par email
  const {
    mutate: verifyRecoverySession,
    isPending: verifyRecoverySessionPending,
    error: verifyRecoverySessionMutationError,
    isSuccess: verifyRecoverySessionSuccess,
  } = useMutation({
    mutationFn: async ({
      access_token,
      refresh_token,
    }: {
      access_token: string;
      refresh_token: string;
    }) => {
      const { data, error } = await supabase.auth.setSession({
        access_token,
        refresh_token,
      });
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      setSession(data.session);
    },
  });

  function refreshProfile() {
    if (session?.user?.id) {
      queryClient.invalidateQueries({ queryKey: ["profile", session.user.id] });
    }
  }

  // Soumission du formulaire d'onboarding (passe le statut à "pending_review")
  const {
    mutateAsync: completeOnboarding,
    isPending: completeOnboardingPending,
  } = useMutation({
    mutationFn: async (input: OnboardingInput) => {
      if (!session?.user?.id) throw new Error("Non connecté.");
      const { error } = await supabase
        .from("users")
        .update({
          birth_date: input.birthDate,
          phone: input.phone,
          learning_goal: input.learningGoal,
          requested_level: input.requestedLevel,
          status: "pending_review",
        })
        .eq("id", session.user.id);
      if (error) throw error;

      const { error: instrumentsError } = await supabase
        .from("user_instruments")
        .insert(
          input.instrumentCategoryIds.map((categoryId) => ({
            user_id: session.user.id,
            category_id: categoryId,
          })),
        );
      if (instrumentsError) throw instrumentsError;
    },
    onSuccess: refreshProfile,
  });

  const { mutateAsync: updateProfile, isPending: updateProfilePending } =
    useMutation({
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
          queryClient.invalidateQueries({
            queryKey: ["profile", session.user.id],
          });
        }
      },
    });

  const { mutateAsync: updateEmail, isPending: updateEmailPending } =
    useMutation({
      mutationFn: async (newEmail: string) => {
        const { error } = await supabase.auth.updateUser({ email: newEmail });
        if (error) throw error;
      },
    });

  const { mutateAsync: uploadAvatar, isPending: uploadAvatarPending } =
    useMutation({
      mutationFn: async (localUri: string) => {
        if (!session?.user?.id) throw new Error("Non connecté.");
        const response = await fetch(localUri);
        const blob = await response.blob();
        const path = `avatars/${session.user.id}.jpg`;
        const { error: uploadError } = await supabase.storage
          .from("image")
          .upload(path, blob, { upsert: true, contentType: "image/jpeg" });
        if (uploadError) throw uploadError;
        const {
          data: { publicUrl },
        } = supabase.storage.from("image").getPublicUrl(path);
        const { error: updateError } = await supabase
          .from("users")
          .update({ avatar_url: publicUrl })
          .eq("id", session.user.id);
        if (updateError) throw updateError;
      },
      onSuccess: () => {
        if (session?.user?.id) {
          queryClient.invalidateQueries({
            queryKey: ["profile", session.user.id],
          });
        }
      },
    });

  const { mutateAsync: updatePassword, isPending: updatePasswordPending } =
    useMutation({
      mutationFn: async (newPassword: string) => {
        const { error } = await supabase.auth.updateUser({
          password: newPassword,
        });
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
        register,
        registerPending,
        registerError: registerMutationError?.message ?? null,
        registerRequiresConfirmation,
        resetRegister,
        requestPasswordReset,
        requestPasswordResetPending,
        requestPasswordResetError: requestPasswordResetMutationError?.message ?? null,
        requestPasswordResetSuccess,
        resetRequestPasswordReset,
        verifyRecoverySession,
        verifyRecoverySessionPending,
        verifyRecoverySessionError: verifyRecoverySessionMutationError?.message ?? null,
        verifyRecoverySessionSuccess,
        logOut,
        logoutPending,
        refreshProfile,
        completeOnboarding,
        completeOnboardingPending,
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
