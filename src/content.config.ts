import { defineCollection } from 'astro:content';
import { docsLoader, i18nLoader } from '@astrojs/starlight/loaders';
import { docsSchema, i18nSchema } from '@astrojs/starlight/schema';

export const collections = {
  docs: defineCollection({ loader: docsLoader(), schema: docsSchema() }),
  // Starlight ships UI strings for most of our languages but not Thai or
  // Bengali, which would leave their chrome — search, "On this page", the
  // untranslated-content notice — in English on an otherwise Thai page.
  // src/content/i18n/*.json fills those in.
  i18n: defineCollection({ loader: i18nLoader(), schema: i18nSchema() }),
};
