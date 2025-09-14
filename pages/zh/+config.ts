import type { Config } from "vike/types";
import { metadataZH } from "../../i18n/locales/zh";

export default {
  // https://vike.dev/head-tags
  title: metadataZH["/"].title,
  description: metadataZH["/"].description,
} satisfies Config;
