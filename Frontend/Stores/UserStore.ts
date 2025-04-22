import { create } from "zustand";
import { User } from "../Types/User"; // Assuming your User type is already defined

type UserStore = {
  user: User | null;
  token: string | null; // Add the token state
  setUser: (user: User, token: string) => void; // Set user and token
  logOut: () => void; // Log out and clear user/token
};

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  token: null, // Initial state is null for both user and token
  setUser: (user, token) => {
    localStorage.setItem("jwt", token); // Store JWT in localStorage

    console.log("User from API:", user);

    set({ user, token });
  },
  logOut: () => {
    localStorage.removeItem("jwt"); // Remove JWT token from localStorage
    set({ user: null, token: null });
  },
}));
