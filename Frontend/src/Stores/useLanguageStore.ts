import { create } from "zustand";

type Language = "en" | "ua";

interface LanguageState {
  language: Language;
  setLanguage: (lang: Language) => void;
}

// Load from localStorage or fallback to "en"
const savedLanguage = localStorage.getItem("language") as Language | null;

export const useLanguageStore = create<LanguageState>((set) => ({
  language: savedLanguage ?? "en",
  setLanguage: (lang) => {
    localStorage.setItem("language", lang);
    set({ language: lang });
  },
}));
