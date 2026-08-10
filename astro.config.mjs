// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export default defineConfig({
  site: 'https://openmmo-agent-ui.github.io',
  base: '/openmmo-agent-wiki',
  integrations: [
    starlight({
      title: { 'zh-TW': 'OpenMMO 攻略站', ko: 'OpenMMO 공략 위키', en: 'OpenMMO Wiki' },
      description: 'OpenMMO 遊戲攻略、更新日誌,以及 OpenMMO Agent 桌面客戶端下載與操作說明。',
      defaultLocale: 'root',
      locales: {
        root: { label: '繁體中文', lang: 'zh-TW' },
        ko: { label: '한국어', lang: 'ko' },
        en: { label: 'English', lang: 'en' },
      },
      social: [
        { icon: 'github', label: 'GitHub', href: 'https://github.com/OpenMMO-Agent-UI/OpenMMO' },
      ],
      sidebar: [
        {
          label: '開始遊玩', translations: { ko: '시작하기' , en: 'Getting started' },
          items: [
            { label: '這是什麼', translations: { ko: '이 게임은' , en: 'What this is' }, link: '/' },
            { label: '新手入門', translations: { ko: '처음 시작하기' , en: 'Getting started' }, link: '/guides/getting-started/' },
            { label: '角色與屬性', translations: { ko: '캐릭터와 능력치' , en: 'Character & attributes' }, link: '/guides/character/' },
            { label: '戰鬥系統', translations: { ko: '전투 시스템' , en: 'Combat' }, link: '/guides/combat/' },
            { label: '釣魚玩法', translations: { ko: '낚시' , en: 'Fishing gameplay' }, link: '/guides/fishing/' },
            { label: '音樂與吟遊詩人', translations: { ko: '음악과 바드' , en: 'Music & the bard' }, link: '/guides/music/' },
            { label: '好友系統', translations: { ko: '친구 시스템' , en: 'Friends' }, link: '/guides/friends/' },
          ],
        },
        {
          label: '客戶端', translations: { ko: '클라이언트' , en: 'Client' },
          items: [
            { label: '下載', translations: { ko: '다운로드' , en: 'Download' }, link: '/client/download/' },
            { label: '安裝與首次啟動', translations: { ko: '설치와 첫 실행' , en: 'Install & first run' }, link: '/client/install/' },
            { label: '選擇模型與 AI 設定', translations: { ko: '모델 선택과 AI 설정' , en: 'Choosing a model' }, link: '/client/llm/' },
            { label: '面板功能詳解', translations: { ko: '패널 기능 상세' , en: 'Panel reference' }, link: '/client/panel/' },
          ],
        },
        {
          label: '遊戲資料庫', translations: { ko: '게임 데이터베이스' , en: 'Game database' },
          items: [
            { label: '總覽', link: '/database/', translations: { ko: '개요' , en: 'Overview' } },
            { label: '道具一覽', translations: { ko: '아이템 목록' , en: 'Items' }, link: '/database/items/' },
            { label: '怪物圖鑑', translations: { ko: '몬스터 도감' , en: 'Monsters' }, link: '/database/monsters/' },
            { label: '地城', translations: { ko: '던전' , en: 'Dungeons' }, link: '/database/dungeons/' },
            { label: '釣魚', link: '/database/fishing/', translations: { ko: '낚시' , en: 'Fishing' } },
            { label: '食物與飽食度', translations: { ko: '음식과 포만도' , en: 'Food & satiation' }, link: '/database/food/' },
            { label: '商店與經濟', translations: { ko: '상점과 경제' , en: 'Shops & economy' }, link: '/database/economy/' },
            { label: '世界地圖與地名', translations: { ko: '월드맵과 지명' , en: 'World map' }, link: '/database/map/' },
          ],
        },
        {
          label: '更新日誌', translations: { ko: '업데이트 기록' , en: 'Update log' },
          items: [
            { label: '總覽', link: '/updates/', translations: { ko: '개요' , en: 'Overview' } },
          ],
        },
      ],
    }),
  ],
});
