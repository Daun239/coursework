import { create } from "zustand";

type Theme = "light" | "dark" | "daltonik";

type ThemeStore = {
  currentTheme: Theme;
  setTheme: (theme: Theme) => void;
};
export const useThemeStore = create<ThemeStore>((set) => ({
  currentTheme: "light",
  setTheme: (theme) => set({ currentTheme: theme }),
}));
