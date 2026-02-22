import { create } from "zustand";

const authStore = create((set) => ({
  userData: null,
  signIn: (userDetails) => set((state) => ({ userData: userDetails })),
  signOut: () => set((state) => ({ userData: null })),
}));

export default authStore;
