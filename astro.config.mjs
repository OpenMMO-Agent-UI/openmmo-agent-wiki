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
          label: '開始遊玩', translations: { ko: '시작하기' },
          items: [
            { label: '這是什麼', translations: { ko: '이 게임은' }, link: '/' },
            { label: '新手入門', translations: { ko: '처음 시작하기' }, link: '/guides/getting-started/' },
            { label: '角色與屬性', translations: { ko: '캐릭터와 능력치' }, link: '/guides/character/' },
            { label: '戰鬥系統', translations: { ko: '전투 시스템' }, link: '/guides/combat/' },
            { label: '釣魚玩法', translations: { ko: '낚시' }, link: '/guides/fishing/' },
          ],
        },
        {
          label: '客戶端', translations: { ko: '클라이언트' },
          items: [
            { label: '下載', translations: { ko: '다운로드' }, link: '/client/download/' },
            { label: '安裝與首次啟動', translations: { ko: '설치와 첫 실행' }, link: '/client/install/' },
            { label: '選擇模型與 AI 設定', translations: { ko: '모델 선택과 AI 설정' }, link: '/client/llm/' },
            { label: '面板功能詳解', translations: { ko: '패널 기능 상세' }, link: '/client/panel/' },
          ],
        },
        {
          label: '遊戲資料庫', translations: { ko: '게임 데이터베이스' },
          items: [
            { label: '總覽', link: '/database/', translations: { ko: '개요' } },
            { label: '道具一覽', translations: { ko: '아이템 목록' }, link: '/database/items/' },
            { label: '怪物圖鑑', translations: { ko: '몬스터 도감' }, link: '/database/monsters/' },
            { label: '地城', translations: { ko: '던전' }, link: '/database/dungeons/' },
            { label: '釣魚', link: '/database/fishing/', translations: { ko: '낚시' } },
            { label: '食物與飽食度', translations: { ko: '음식과 포만도' }, link: '/database/food/' },
            { label: '商店與經濟', translations: { ko: '상점과 경제' }, link: '/database/economy/' },
            { label: '世界地圖與地名', translations: { ko: '월드맵과 지명' }, link: '/database/map/' },
          ],
        },
        {
          label: '更新日誌', translations: { ko: '업데이트 기록' },
          items: [
            { label: '總覽', link: '/updates/', translations: { ko: '개요' } },
          ],
        },
      ],
    }),
  ],
});
