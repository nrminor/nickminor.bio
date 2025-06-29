/**
 * This configures the translations for all ui text in your website.
 *
 * All languages will follow this ordering/structure and will fallback to the
 * default language for any entries that haven't been translated
 */
import type { SupportedLanguage } from "../utils/i18n.ts";

export default {
  "en": {
    "site.title": {
      text: "nickminor.bio",
    },
    "site.description": {
      text: "An web experiment at the interface of biology and computing.",
    },
    "profile.description": {
      text: "your bio description",
    },
    "blog.lastUpdated": {
      text: "Last updated:",
    },
    "sidebar.tableOfContents": {
      text: "Table of Contents",
    },
    "project.platform": {
      text: "PLATFORM",
    },
    "project.stack": {
      text: "STACK",
    },
    "project.website": {
      text: "WEBSITE",
    },
  },
} as const satisfies TranslationUIEntries;

type TranslationUIEntries = Record<SupportedLanguage, Record<string, UIEntry>>;

export type UIEntry = { text: string };
