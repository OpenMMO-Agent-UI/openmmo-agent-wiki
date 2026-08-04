// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export default defineConfig({
  site: 'https://openmmo-agent-ui.github.io',
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
        { icon: 'github', label: 'GitHub', href: 'https://github.com/OpenMMO-Agent-UI/OpenMMO' },
      ],
      sidebar: [
        {
          label: '開始遊玩',
          items: [
            { label: '這是什麼', link: '/' },
            { label: '新手入門', link: '/guides/getting-started/' },
            { label: '角色與屬性', link: '/guides/character/' },
            { label: '戰鬥系統', link: '/guides/combat/' },
            { label: '釣魚玩法', link: '/guides/fishing/' },
          ],
        },
        {
          label: '客戶端',
          items: [
            { label: '下載', link: '/client/download/' },
            { label: '安裝與首次啟動', link: '/client/install/' },
            { label: '選擇模型與 AI 設定', link: '/client/llm/' },
            { label: '面板功能詳解', link: '/client/panel/' },
          ],
        },
        {
          label: '遊戲資料庫',
          items: [
            { label: '總覽', link: '/database/' },
            { label: '道具一覽', link: '/database/items/' },
            { label: '怪物圖鑑', link: '/database/monsters/' },
            { label: '地城', link: '/database/dungeons/' },
            { label: '釣魚', link: '/database/fishing/' },
            { label: '食物與飽食度', link: '/database/food/' },
            { label: '商店與經濟', link: '/database/economy/' },
            { label: '世界地圖與地名', link: '/database/map/' },
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
