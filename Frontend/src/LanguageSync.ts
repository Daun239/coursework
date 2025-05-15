import { useEffect } from "react";
import i18n from "./i18n";
import { useLanguageStore } from "./Stores/useLanguageStore";

export const LanguageSync = () => {
  const language = useLanguageStore((state) => state.language);

  useEffect(() => {
    i18n.changeLanguage(language);
  }, [language]);

  return null;
};
