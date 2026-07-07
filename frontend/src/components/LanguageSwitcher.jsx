import { useTranslation } from "react-i18next";
import { Languages } from "lucide-react";
import { supportedLanguages } from "../i18n/index.js";

const labels = { es: "ES", en: "EN" };

export function LanguageSwitcher() {
  const { i18n, t } = useTranslation();

  return (
    <label className="languageSwitcher" title={t("common.language")}>
      <Languages size={18} />
      <select value={i18n.resolvedLanguage} onChange={(event) => i18n.changeLanguage(event.target.value)}>
        {supportedLanguages.map((lang) => <option key={lang} value={lang}>{labels[lang] || lang}</option>)}
      </select>
    </label>
  );
}
