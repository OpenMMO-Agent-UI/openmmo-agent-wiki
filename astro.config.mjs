// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export default defineConfig({
  site: 'https://openmmo-agent.github.io',
  base: '/openmmo-agent-wiki',
  integrations: [
    starlight({
      title: 'OpenMMO 攻略站',
      description: 'OpenMMO 遊戲攻略、更新日誌,以及 OpenMMO Agent 桌面客戶端下載與操作說明。',
      defaultLocale: 'root',
      locales: {
        root: { label: '繁體中文', lang: 'zh-TW' },
        en: { label: 'English', lang: 'en' },
      },
      social: [
        { icon: 'github', label: 'GitHub', href: 'https://github.com/OpenMMO-agent/OpenMMO' },
      ],
      sidebar: [
        {
          label: '開始遊玩',
          items: [
            { label: '這是什麼', link: '/' },
          ],
        },
        {
          label: '客戶端',
          items: [
            { label: '下載', link: '/client/download/' },
            { label: '安裝與首次啟動', link: '/client/install/' },
            { label: '選擇模型與 AI 設定', link: '/client/llm/' },
          ],
        },
        {
          label: '更新日誌',
          items: [
            { label: '總覽', link: '/updates/' },
          ],
        },
      ],
    }),
  ],
});
