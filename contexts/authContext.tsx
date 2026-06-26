import { supabase } from "@/utils/supabase";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useMutation } from "@tanstack/react-query";
import { Session } from "@supabase/supabase-js";
import { router } from "expo-router";
import { createContext, PropsWithChildren, useEffect, useState } from "react";

type authState = {
  isLoggedIn: boolean;
  isAdmin: boolean;
  logIn: (email: string, password: string) => void;
  logOut: () => void;
  logInAsAdmin: () => void;
  logOutAsAdmin: () => void;
  ready: boolean;
  loginPending: boolean;
  loginError: Error | null;
};

const authStorageKey = "my-key";

export const AuthContext = createContext<authState>({
  isLoggedIn: false,
  logIn: () => {},
  logOut: () => {},
  isAdmin: true,
  logInAsAdmin: () => {},
  logOutAsAdmin: () => {},
  ready: false,
  loginPending: false,
  loginError: null,
});

export function AuthProvider({ children }: PropsWithChildren) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [ready, setIsready] = useState(false);
  const [session, setSession] = useState<Session | null>(null);

  const storeAuthState = async (newState: { isLoggedIn: boolean }) => {
    try {
      const jsonValue = JSON.stringify(newState);
      await AsyncStorage.setItem(authStorageKey, jsonValue);
    } catch (error) {
      console.log("Error saving", error);
    }
  };

  const loginMutation = useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      setSession(data.session);
      router.replace("/(protected)/(tabs)");
    },
  });

  const logIn = (email: string, password: string) => {
    loginMutation.mutate({ email, password });
  };

  const logOut = () => {};

  const logInAsAdmin = () => {};

  const logOutAsAdmin = () => {
    setIsLoggedIn(false);
    router.replace("/login");
  };

  useEffect(() => {
    const getAuthFromStorage = async () => {
      try {
        const value = await AsyncStorage.getItem(authStorageKey);
        if (value !== null) {
          const auth = JSON.parse(value);
          setIsLoggedIn(auth.isLoggedIn);
        }
      } catch (error) {
        console.log("Error fetching from storage", error);
      }
      setIsready(true);
    };
    getAuthFromStorage();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        ready,
        isLoggedIn,
        logIn,
        logOut,
        isAdmin,
        logInAsAdmin,
        logOutAsAdmin,
        loginPending: loginMutation.isPending,
        loginError: loginMutation.error,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
