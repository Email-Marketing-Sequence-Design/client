import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";
import resourcesToBackend from "i18next-resources-to-backend";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .use(
    resourcesToBackend((language, namespace) =>
      import(`@/i18n/locales/${language}/${namespace}.json`)
    )
  )
  .init({
    lng: "en",
    fallbackLng: "en",
    debug: true,
    returnObjects: true,
    defaultNS: "common",
    fallbackNS: "common",
    ns: ["common"],
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
