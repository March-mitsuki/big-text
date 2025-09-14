import { textEN } from "./locales/en";
import { textJA } from "./locales/ja";
import { textZH } from "./locales/zh";
import { I18nText } from "./types";

export function trans(key: keyof I18nText, locale: string): string {
  switch (locale) {
    case "en":
      return textEN[key] || key;
    case "ja":
      return textJA[key] || key;
    case "zh":
      return textZH[key] || key;
    default:
      return textEN[key] || key;
  }
}
