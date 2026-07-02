import { supabase } from "@/utils/supabase";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@supabase/supabase-js";
import { createContext, PropsWithChildren, useContext } from "react";
import { AuthContext } from "@/contexts/authContext";
import { useAuth } from "@/hooks/useAuth";

import type { User, UserPayload, CreateUserInput } from "@/types";

export type { User, UserPayload, CreateUserInput };

type UserContextType = {
  users: User[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
  createUser: (input: CreateUserInput) => Promise<void>;
  updateUser: (id: string, payload: UserPayload) => Promise<void>;
  updateUserInstruments: (id: string, categoryIds: string[]) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
  isCreating: boolean;
  isUpdating: boolean;
  isUpdatingInstruments: boolean;
};

export const UserContext = createContext<UserContextType>(
  {} as UserContextType,
);

// Isolated client so signUp never overwrites the admin's session
const anonClient = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL!,
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!,
  { auth: { persistSession: false, autoRefreshToken: false } },
);

export function UserProvider({ children }: PropsWithChildren) {
  const queryClient = useQueryClient();
  const { session } = useAuth();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("users")
        .select("*, user_instruments(category:categories(id, title, emoji))")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as User[];
    },
    enabled: !!session?.user?.id,
  });

  const createMutation = useMutation({
    mutationFn: async (input: CreateUserInput) => {
      // Use the isolated client so the admin session is not replaced
      const { data: authData, error: authError } = await anonClient.auth.signUp(
        {
          email: input.email,
          password: input.password,
          options: { data: { name: input.name } },
        },
      );
      if (authError) throw authError;

      const userId = authData.user?.id;
      if (!userId) throw new Error("Échec de la création du compte.");

      // Trigger already inserted the public.users row — update role, level,
      // and mark active since the admin already vetted this account at creation.
      const { data: updated, error: updateError } = await supabase
        .from("users")
        .update({ role: input.role, level: input.level, status: "active" })
        .eq("id", userId)
        .select("*, user_instruments(category:categories(id, title, emoji))")
        .single();
      if (updateError) throw updateError;
      return updated as User;
    },
    onSuccess: (newUser) => {
      queryClient.setQueryData<User[]>(["users"], (old = []) => [
        newUser,
        ...old,
      ]);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: string;
      payload: UserPayload;
    }) => {
      const { data: updated, error } = await supabase
        .from("users")
        .update(payload)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return updated as User;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  const updateInstrumentsMutation = useMutation({
    mutationFn: async ({
      id,
      categoryIds,
    }: {
      id: string;
      categoryIds: string[];
    }) => {
      const { error: deleteError } = await supabase
        .from("user_instruments")
        .delete()
        .eq("user_id", id);
      if (deleteError) throw deleteError;

      if (categoryIds.length > 0) {
        const { error: insertError } = await supabase
          .from("user_instruments")
          .insert(
            categoryIds.map((categoryId) => ({
              user_id: id,
              category_id: categoryId,
            })),
          );
        if (insertError) throw insertError;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.functions.invoke("delete-user", {
        body: { id },
      });
      if (error) throw error;
      return id;
    },
    onSuccess: (id) => {
      queryClient.setQueryData<User[]>(["users"], (old = []) =>
        old.filter((u) => u.id !== id),
      );
    },
  });

  return (
    <UserContext.Provider
      value={{
        users: data ?? [],
        isLoading,
        error: error as Error | null,
        refetch,
        createUser: createMutation.mutateAsync,
        updateUser: (id, payload) =>
          updateMutation.mutateAsync({ id, payload }),
        updateUserInstruments: (id, categoryIds) =>
          updateInstrumentsMutation.mutateAsync({ id, categoryIds }),
        deleteUser: deleteMutation.mutateAsync,
        isCreating: createMutation.isPending,
        isUpdating: updateMutation.isPending,
        isUpdatingInstruments: updateInstrumentsMutation.isPending,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}
