"use client";
import authStore from "@/lib/authStore";

export const useAuth = () => {
  const signIn = authStore((state) => state.signIn);
  const signOut = authStore((state) => state.signOut);
  const userData = authStore((state) => state.userData);

  return { signIn, signOut, userData };
};

