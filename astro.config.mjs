// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import { LOCALES, TITLES } from './src/i18n/locales.mjs';
import { sidebar } from './src/i18n/sidebar.mjs';

export default defineConfig({
  site: 'https://openmmo-agent-ui.github.io',
  base: '/openmmo-agent-wiki',
  integrations: [
    starlight({
      title: TITLES,
      description: 'OpenMMO 遊戲攻略、更新日誌,以及 OpenMMO Agent 桌面客戶端下載與操作說明。',
      defaultLocale: 'root',
      // One row per language in src/i18n/locales.mjs. Starlight serves the
      // default locale's page for anything a language has not translated yet,
      // with its own notice, so switching a language on never 404s.
      locales: LOCALES,
      social: [
        { icon: 'github', label: 'GitHub', href: 'https://github.com/OpenMMO-Agent-UI/OpenMMO' },
      ],
      sidebar,
    }),
  ],
});
