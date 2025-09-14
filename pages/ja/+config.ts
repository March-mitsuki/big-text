import type { Config } from "vike/types";
import { metadataJA } from "../../i18n/locales/ja";

export default {
  // https://vike.dev/head-tags
  title: metadataJA["/"].title,
  description: metadataJA["/"].description,
} satisfies Config;
