// The languages this wiki ships, in one place.
//
// Starlight needs the same locale list in several shapes (the `locales` map,
// the sidebar's per-label `translations`, the link checker's idea of which
// prefixes are translations), and keeping those in step by hand is how `ko`
// and `en` ended up correct while nothing else existed. Adding a language is
// one row here plus one column in `sidebar.mjs`.
//
// `root` is the default locale and carries no URL prefix, so zh-TW serves at
// `/openmmo-agent-wiki/` and every other language at `/openmmo-agent-wiki/<code>/`.
// Starlight falls back to the default locale for any page a language has not
// translated yet, with its own "not available in this language" notice — so a
// language can be switched on before its pages exist, and every URL resolves.

/// Label is written in the language itself: a reader looking for their own
/// language in the picker is, by definition, not reading the current one.
export const LOCALES = {
  root: { label: '繁體中文', lang: 'zh-TW' , title: 'OpenMMO 攻略站' },
  en: { label: 'English', lang: 'en' , title: 'OpenMMO Wiki' },
  ko: { label: '한국어', lang: 'ko' , title: 'OpenMMO 공략 위키' },
  ja: { label: '日本語', lang: 'ja' , title: 'OpenMMO 攻略ウィキ' },
  es: { label: 'Español', lang: 'es' , title: 'Wiki de OpenMMO' },
  fr: { label: 'Français', lang: 'fr' , title: 'Wiki OpenMMO' },
  pt: { label: 'Português', lang: 'pt' , title: 'Wiki do OpenMMO' },
  id: { label: 'Bahasa Indonesia', lang: 'id' , title: 'Wiki OpenMMO' },
  th: { label: 'ไทย', lang: 'th' , title: 'วิกิ OpenMMO' },
  hi: { label: 'हिन्दी', lang: 'hi' , title: 'OpenMMO विकी' },
  bn: { label: 'বাংলা', lang: 'bn' , title: 'OpenMMO উইকি' },
  // Right-to-left: Starlight needs it declared, or the whole page lays out
  // left-to-right with Arabic text poured into it.
  ar: { label: 'العربية', lang: 'ar', dir: 'rtl' , title: 'ويكي OpenMMO' },
};

/// The URL prefixes that mean "a translation", i.e. every locale but the
/// unprefixed default. The link checker uses this to catch a link that leaves
/// its own language.
export const PREFIXED = Object.keys(LOCALES).filter((code) => code !== 'root');

/// Every locale's content directory under `src/content/docs`, `root` being the
/// docs root itself.
export const contentDirOf = (code) => (code === 'root' ? '.' : code);

/// Starlight keys the site title by `lang`, not by locale code. Deriving it
/// from the rows above means a language cannot be added without a title —
/// which is what left nine of them titled in Chinese the first time round.
export const TITLES = Object.fromEntries(
  Object.values(LOCALES).map(({ lang, title }) => [lang, title])
);
