import type { Config } from "vike/types";
import vikeReact from "vike-react/config";
import Layout from "../layouts/LayoutDefault.js";
import { metadataEN } from "../i18n/locales/en.js";

// Default config (can be overridden by pages)
// https://vike.dev/config

export default {
  // https://vike.dev/Layout
  Layout,

  // https://vike.dev/head-tags
  title: metadataEN["/"].title,
  description: metadataEN["/"].description,

  // https://vike.dev/pre-rendering
  prerender: true,

  extends: vikeReact,
} satisfies Config;
