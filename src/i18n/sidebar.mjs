// The sidebar, and every label's translations.
//
// This used to live inline in astro.config.mjs with a `translations: { ko, en }`
// object on each of 35 entries. At three languages that was merely verbose; at
// twelve it is 385 inline strings and a guarantee that the next language gets
// half of them. So the tree and the words are separate: `NAV` is the shape,
// `LABELS` is the vocabulary, keyed by the zh-TW label because that is the
// language the wiki is written in first.
//
// Adding a language: one row in locales.mjs, one key per entry below. A label
// with no entry for a locale falls back to the zh-TW text rather than going
// blank, and `npm run check:i18n` lists what is missing.

/// zh-TW label -> { locale: label }. The zh-TW side is the key, so it is not
/// repeated here. `總覽` appears under two groups and means the same thing in
/// both, which is why it is one entry.
export const LABELS = {
  開始遊玩: { en: 'Getting started', ko: '시작하기', ja: 'はじめる', es: 'Primeros pasos', fr: 'Démarrer', pt: 'Primeiros passos', id: 'Mulai bermain', th: 'เริ่มเล่น', hi: 'शुरुआत करें', bn: 'শুরু করুন', ar: 'البداية' },
  這是什麼: { en: 'What this is', ko: '이 게임은', ja: 'これは何か', es: 'Qué es esto', fr: "Qu'est-ce que c'est", pt: 'O que é isto', id: 'Apa ini', th: 'นี่คืออะไร', hi: 'यह क्या है', bn: 'এটি কী', ar: 'ما هذا' },
  新手入門: { en: 'Getting started', ko: '처음 시작하기', ja: '初心者ガイド', es: 'Guía para empezar', fr: 'Pour débuter', pt: 'Guia inicial', id: 'Panduan pemula', th: 'คู่มือมือใหม่', hi: 'नया खिलाड़ी गाइड', bn: 'নতুনদের গাইড', ar: 'دليل المبتدئين' },
  角色與屬性: { en: 'Character & attributes', ko: '캐릭터와 능력치', ja: 'キャラクターと能力値', es: 'Personaje y atributos', fr: 'Personnage et attributs', pt: 'Personagem e atributos', id: 'Karakter dan atribut', th: 'ตัวละครและค่าสถานะ', hi: 'किरदार और गुण', bn: 'চরিত্র ও বৈশিষ্ট্য', ar: 'الشخصية والصفات' },
  戰鬥系統: { en: 'Combat', ko: '전투 시스템', ja: '戦闘システム', es: 'Combate', fr: 'Combat', pt: 'Combate', id: 'Pertarungan', th: 'ระบบต่อสู้', hi: 'युद्ध प्रणाली', bn: 'যুদ্ধব্যবস্থা', ar: 'القتال' },
  稱號: { en: 'Titles', ko: '칭호', ja: '称号', es: 'Títulos', fr: 'Titres', pt: 'Títulos', id: 'Gelar', th: 'ฉายา', hi: 'उपाधियाँ', bn: 'উপাধি', ar: 'الألقاب' },
  野外討伐: { en: 'Field Raids', ko: '필드 레이드', ja: 'フィールドレイド', es: 'Incursiones de campo', fr: 'Raids de terrain', pt: 'Raides de campo', id: 'Raid lapangan', th: 'การบุกภาคสนาม', hi: 'फ़ील्ड रेड', bn: 'ফিল্ড রেইড', ar: 'غزوات الحقل' },
  強化系統: { en: 'Enchanting', ko: '강화 시스템', ja: '強化システム', es: 'Encantamiento', fr: 'Enchantement', pt: 'Encantamento', id: 'Peningkatan', th: 'ระบบตีบวก', hi: 'एनचैंटिंग', bn: 'এনচ্যান্টিং', ar: 'التحسين' },
  釣魚玩法: { en: 'Fishing gameplay', ko: '낚시', ja: '釣りの遊び方', es: 'Pesca', fr: 'Pêche', pt: 'Pesca', id: 'Memancing', th: 'วิธีตกปลา', hi: 'मछली पकड़ना', bn: 'মাছ ধরা', ar: 'الصيد' },
  音樂與吟遊詩人: { en: 'Music & the bard', ko: '음악과 바드', ja: '音楽と吟遊詩人', es: 'Música y el bardo', fr: 'Musique et barde', pt: 'Música e o bardo', id: 'Musik dan bard', th: 'ดนตรีและกวี', hi: 'संगीत और बार्ड', bn: 'সঙ্গীত ও বার্ড', ar: 'الموسيقى والشاعر' },
  好友系統: { en: 'Friends', ko: '친구 시스템', ja: 'フレンド機能', es: 'Amigos', fr: 'Amis', pt: 'Amigos', id: 'Teman', th: 'ระบบเพื่อน', hi: 'मित्र', bn: 'বন্ধু', ar: 'الأصدقاء' },
  組隊系統: { en: 'Party', ko: '파티 시스템', ja: 'パーティー機能', es: 'Grupo', fr: 'Groupe', pt: 'Grupo', id: 'Party', th: 'ระบบปาร์ตี้', hi: 'पार्टी', bn: 'পার্টি', ar: 'المجموعة' },
  玩家交易: { en: 'Player trading', ko: '플레이어 거래', ja: 'プレイヤー間取引', es: 'Comercio entre jugadores', fr: 'Échange entre joueurs', pt: 'Comércio entre jogadores', id: 'Perdagangan pemain', th: 'การซื้อขายระหว่างผู้เล่น', hi: 'खिलाड़ी व्यापार', bn: 'খেলোয়াড় বিনিময়', ar: 'تجارة اللاعبين' },
  斗篷染色與印花: { en: 'Cape dyeing & printing', ko: '망토 염색과 프린트', ja: 'マントの染色とプリント', es: 'Teñido e impresión de capas', fr: 'Teinture et impression de cape', pt: 'Tingimento e estampa de capa', id: 'Pewarnaan dan cetak jubah', th: 'การย้อมและพิมพ์ผ้าคลุม', hi: 'लबादा रंगाई और छपाई', bn: 'কেপ রং ও ছাপ', ar: 'صباغة العباءة وطبعها' },
  客棧與女僕: { en: 'Inn & maids', ko: '여관과 메이드', ja: '宿屋とメイド', es: 'Posada y sirvientas', fr: 'Auberge et servantes', pt: 'Estalagem e criadas', id: 'Penginapan dan pelayan', th: 'โรงเตี๊ยมและสาวใช้', hi: 'सराय और सेविकाएँ', bn: 'সরাইখানা ও পরিচারিকা', ar: 'النزل والخادمات' },
  領地系統: { en: 'Estates', ko: '영지 시스템', ja: '領地システム', es: 'Propiedades', fr: 'Domaines', pt: 'Propriedades', id: 'Properti', th: 'ระบบที่ดิน', hi: 'सम्पदा', bn: 'এস্টেট', ar: 'العقارات' },
  騎乘系統: { en: 'Mounts', ko: '탑승 시스템', ja: '騎乗システム', es: 'Monturas', fr: 'Montures', pt: 'Montarias', id: 'Tunggangan', th: 'ระบบพาหนะ', hi: 'सवारी', bn: 'বাহন', ar: 'المركوبات' },
  道具鎖定: { en: 'Item locks', ko: '아이템 잠금', ja: 'アイテムロック', es: 'Bloqueo de objetos', fr: "Verrouillage d'objets", pt: 'Bloqueio de itens', id: 'Kunci item', th: 'การล็อกไอเทม', hi: 'आइटम लॉक', bn: 'আইটেম লক', ar: 'قفل الأغراض' },
  天氣系統: { en: 'Weather', ko: '날씨 시스템', ja: '天候システム', es: 'Clima', fr: 'Météo', pt: 'Clima', id: 'Cuaca', th: 'ระบบอากาศ', hi: 'मौसम', bn: 'আবহাওয়া', ar: 'الطقس' },
  客戶端: { en: 'Client', ko: '클라이언트', ja: 'クライアント', es: 'Cliente', fr: 'Client', pt: 'Cliente', id: 'Klien', th: 'ไคลเอนต์', hi: 'क्लाइंट', bn: 'ক্লায়েন্ট', ar: 'العميل' },
  下載: { en: 'Download', ko: '다운로드', ja: 'ダウンロード', es: 'Descargar', fr: 'Télécharger', pt: 'Baixar', id: 'Unduh', th: 'ดาวน์โหลด', hi: 'डाउनलोड', bn: 'ডাউনলোড', ar: 'التنزيل' },
  安裝與首次啟動: { en: 'Install & first run', ko: '설치와 첫 실행', ja: 'インストールと初回起動', es: 'Instalación y primer inicio', fr: 'Installation et premier lancement', pt: 'Instalação e primeira execução', id: 'Instalasi dan pertama kali', th: 'ติดตั้งและเริ่มใช้ครั้งแรก', hi: 'इंस्टॉल और पहली बार चलाना', bn: 'ইনস্টল ও প্রথম চালু', ar: 'التثبيت والتشغيل الأول' },
  '選擇模型與 AI 設定': { en: 'Choosing a model', ko: '모델 선택과 AI 설정', ja: 'モデル選択と AI 設定', es: 'Elegir un modelo', fr: 'Choisir un modèle', pt: 'Escolher um modelo', id: 'Memilih model', th: 'การเลือกโมเดล', hi: 'मॉडल चुनना', bn: 'মডেল নির্বাচন', ar: 'اختيار النموذج' },
  面板功能詳解: { en: 'Panel reference', ko: '패널 기능 상세', ja: 'パネル機能詳細', es: 'Referencia del panel', fr: 'Référence du panneau', pt: 'Referência do painel', id: 'Referensi panel', th: 'คู่มือแผงควบคุม', hi: 'पैनल संदर्भ', bn: 'প্যানেল রেফারেন্স', ar: 'مرجع اللوحة' },
  遊戲資料庫: { en: 'Game database', ko: '게임 데이터베이스', ja: 'ゲームデータベース', es: 'Base de datos del juego', fr: 'Base de données du jeu', pt: 'Base de dados do jogo', id: 'Basis data gim', th: 'ฐานข้อมูลเกม', hi: 'गेम डेटाबेस', bn: 'গেম ডেটাবেস', ar: 'قاعدة بيانات اللعبة' },
  總覽: { en: 'Overview', ko: '개요', ja: '概要', es: 'Resumen', fr: 'Aperçu', pt: 'Visão geral', id: 'Ikhtisar', th: 'ภาพรวม', hi: 'अवलोकन', bn: 'সংক্ষিপ্ত বিবরণ', ar: 'نظرة عامة' },
  道具一覽: { en: 'Items', ko: '아이템 목록', ja: 'アイテム一覧', es: 'Objetos', fr: 'Objets', pt: 'Itens', id: 'Item', th: 'รายการไอเทม', hi: 'आइटम', bn: 'আইটেম', ar: 'الأغراض' },
  怪物圖鑑: { en: 'Monsters', ko: '몬스터 도감', ja: 'モンスター図鑑', es: 'Monstruos', fr: 'Monstres', pt: 'Monstros', id: 'Monster', th: 'สารานุกรมมอนสเตอร์', hi: 'राक्षस', bn: 'দানব', ar: 'الوحوش' },
  地城: { en: 'Dungeons', ko: '던전', ja: 'ダンジョン', es: 'Mazmorras', fr: 'Donjons', pt: 'Masmorras', id: 'Dungeon', th: 'ดันเจี้ยน', hi: 'तहख़ाने', bn: 'ডানজন', ar: 'الأقبية' },
  釣魚: { en: 'Fishing', ko: '낚시', ja: '釣り', es: 'Pesca', fr: 'Pêche', pt: 'Pesca', id: 'Memancing', th: 'ตกปลา', hi: 'मछली पकड़ना', bn: 'মাছ ধরা', ar: 'الصيد' },
  食物與飽食度: { en: 'Food & satiation', ko: '음식과 포만도', ja: '食料と満腹度', es: 'Comida y saciedad', fr: 'Nourriture et satiété', pt: 'Comida e saciedade', id: 'Makanan dan kenyang', th: 'อาหารและความอิ่ม', hi: 'भोजन और तृप्ति', bn: 'খাদ্য ও তৃপ্তি', ar: 'الطعام والشبع' },
  商店與經濟: { en: 'Shops & economy', ko: '상점과 경제', ja: '商店と経済', es: 'Tiendas y economía', fr: 'Boutiques et économie', pt: 'Lojas e economia', id: 'Toko dan ekonomi', th: 'ร้านค้าและเศรษฐกิจ', hi: 'दुकानें और अर्थव्यवस्था', bn: 'দোকান ও অর্থনীতি', ar: 'المتاجر والاقتصاد' },
  世界地圖與地名: { en: 'World map', ko: '월드맵과 지명', ja: 'ワールドマップと地名', es: 'Mapa del mundo', fr: 'Carte du monde', pt: 'Mapa do mundo', id: 'Peta dunia', th: 'แผนที่โลก', hi: 'विश्व नक्शा', bn: 'বিশ্ব মানচিত্র', ar: 'خريطة العالم' },
  更新日誌: { en: 'Update log', ko: '업데이트 기록', ja: '更新履歴', es: 'Registro de cambios', fr: 'Journal des mises à jour', pt: 'Registro de atualizações', id: 'Catatan pembaruan', th: 'บันทึกอัปเดต', hi: 'अपडेट लॉग', bn: 'আপডেট লগ', ar: 'سجل التحديثات' },
};

/// The shape: group label -> its links, each `[zh-TW label, path]`.
const NAV = [
  ['開始遊玩', [
    ['這是什麼', '/'],
    ['新手入門', '/guides/getting-started/'],
    ['角色與屬性', '/guides/character/'],
    ['戰鬥系統', '/guides/combat/'],
    ['稱號', '/guides/titles/'],
    ['野外討伐', '/guides/field-raid/'],
    ['強化系統', '/guides/enchant/'],
    ['釣魚玩法', '/guides/fishing/'],
    ['音樂與吟遊詩人', '/guides/music/'],
    ['好友系統', '/guides/friends/'],
    ['組隊系統', '/guides/party/'],
    ['玩家交易', '/guides/trade/'],
    ['斗篷染色與印花', '/guides/cape/'],
    ['客棧與女僕', '/guides/inn/'],
    ['領地系統', '/guides/estates/'],
    ['騎乘系統', '/guides/mounts/'],
    ['道具鎖定', '/guides/item-locks/'],
    ['天氣系統', '/guides/weather/'],
  ]],
  ['客戶端', [
    ['下載', '/client/download/'],
    ['安裝與首次啟動', '/client/install/'],
    ['選擇模型與 AI 設定', '/client/llm/'],
    ['面板功能詳解', '/client/panel/'],
  ]],
  ['遊戲資料庫', [
    ['總覽', '/database/'],
    ['道具一覽', '/database/items/'],
    ['怪物圖鑑', '/database/monsters/'],
    ['地城', '/database/dungeons/'],
    ['釣魚', '/database/fishing/'],
    ['食物與飽食度', '/database/food/'],
    ['商店與經濟', '/database/economy/'],
    ['世界地圖與地名', '/database/map/'],
  ]],
  ['更新日誌', [
    ['總覽', '/updates/'],
  ]],
];

/// A missing translation falls back to the zh-TW label. Blank sidebar entries
/// would be worse than untranslated ones, and check-i18n.mjs reports the gap.
const translationsFor = (zh) => LABELS[zh] ?? {};

export const sidebar = NAV.map(([group, items]) => ({
  label: group,
  translations: translationsFor(group),
  items: items.map(([label, link]) => ({
    label,
    translations: translationsFor(label),
    link,
  })),
}));
