import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import Backend from "i18next-http-backend";
//import LanguageDetector from "i18next-browser-languagedetector";

i18n
  .use(Backend as any)
  //.use(LanguageDetector as any)
  .use(initReactI18next)
  .init({
    backend: {
      loadPath: "/i18n/locales/{{lng}}/translation.json",
    },
    detection: {
      order: ["querystring", "localStorage", "navigator", "htmlTag"],

      lookupQuerystring: "lang",

      caches: ["localStorage"],
    },
    supportedLngs: ["de", "en"],
    fallbackLng: "de",
    interpolation: {
      escapeValue: false,
    },
    debug: false,
  });

export default i18n;