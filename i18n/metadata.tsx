import { metadataEN } from "./locales/en";
import { metadataJA } from "./locales/ja";
import { metadataZH } from "./locales/zh";
import { I18nMetadata } from "./types";

export function makeI18nHead(locale: string, pathname: keyof I18nMetadata) {
  const metadata = getI18nMetadata(locale, pathname);

  return (
    <>
      <link rel="canonical" href={metadata.canonical} />
      {Object.entries(metadata.languages).map(([lang, url]) => (
        <link key={lang} rel="alternate" hrefLang={lang} href={url} />
      ))}
    </>
  );
}

type Metadata = {
  title: string;
  description: string;
  canonical: string;
  languages: Record<string, string>;
};

function getI18nMetadata(locale: string, pathname: keyof I18nMetadata): Metadata {
  const result: Metadata = {
    title: "Big Text | Build by Mitsuki-March",
    description: "Display big text on your screen with custom styles.",
    canonical: "https://big-text.mitsuki.app",
    languages: {
      en: `https://big-text.mitsuki.app${pathname}`,
      ja: `https://big-text.mitsuki.app/ja${pathname}`,
      zh: `https://big-text.mitsuki.app/zh${pathname}`,
    },
  };

  switch (locale) {
    case "en":
      result.title = metadataEN["/"].title;
      result.description = metadataEN["/"].description;
      break;
    case "ja":
      result.title = metadataJA["/"].title;
      result.description = metadataJA["/"].description;
      break;
    case "zh":
      result.title = metadataZH["/"].title;
      result.description = metadataZH["/"].description;
      break;
  }

  return result;
}
