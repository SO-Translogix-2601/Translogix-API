import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import es from "./locales/es.json";
import en from "./locales/en.json";

const STORAGE_KEY = "translogix_lang";
export const supportedLanguages = ["es", "en"];

function detectInitialLanguage() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored && supportedLanguages.includes(stored)) return stored;
  const browserLang = navigator.language?.slice(0, 2);
  return supportedLanguages.includes(browserLang) ? browserLang : "es";
}

i18n.use(initReactI18next).init({
  resources: { es: { translation: es }, en: { translation: en } },
  lng: detectInitialLanguage(),
  fallbackLng: "es",
  interpolation: { escapeValue: false },
});

i18n.on("languageChanged", (lng) => {
  localStorage.setItem(STORAGE_KEY, lng);
});

export default i18n;
