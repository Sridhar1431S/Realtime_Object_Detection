import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User, Session } from "@supabase/supabase-js";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: string | null }>;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: string | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log("Auth state changed:", _event, session);
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    supabase.auth
      .getSession()
      .then(({ data: { session } }) => {
        console.log("Initial session:", session);
        setSession(session);
        setUser(session?.user ?? null);
      })
      .catch((err) => {
        console.error("Failed to get session on init:", err);
      })
      .finally(() => {
        setLoading(false);
      });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, fullName: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
        emailRedirectTo: window.location.origin,
      },
    });
    return { error: error?.message ?? null };
  };

  const signIn = async (email: string, password: string) => {
    try {
      console.log("Attempting sign in with email:", email);
      console.log("Supabase URL:", import.meta.env.VITE_SUPABASE_URL);
      const { error, data } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        console.error("Sign in error:", error);
        return { error: error.message };
      }
      if (!data?.session) {
        const message = "Sign in succeeded but no session was returned.";
        console.error(message, data);
        return { error: message };
      }
      setSession(data.session);
      setUser(data.session.user ?? null);
      console.log("Sign in successful:", data);
      return { error: null };
    } catch (err) {
      console.error("Sign in exception:", err);
      const message = err instanceof Error ? err.message : "Failed to fetch - check network connection";
      return { error: message };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    return { error: error?.message ?? null };
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signUp, signIn, signOut, resetPassword }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
