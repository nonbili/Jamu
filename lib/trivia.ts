import { Tidbit, TidbitCategory, trivia$ } from '@/states/trivia'
import { settings$ } from '@/states/settings'

const threshold = 6 * 3600 * 1000 // 6 hours
const BASE = 'https://m.ame.ninja'

// The language whose data we need: the chosen translation when bilingual reading
// is on, otherwise just Japanese (the smallest payload).
export function targetLang() {
  return settings$.triviaBilingual.get() ? settings$.triviaLang.get() : 'ja'
}

export async function fetchTidbits(lang: string = 'ja') {
  const now = Date.now()
  const fresh = now - trivia$.syncedAt.get() < threshold
  if (fresh && trivia$.lang.get() === lang && trivia$.list.get().length) {
    return
  }
  try {
    const res = await fetch(`${BASE}/api/tidbits/${lang}.json`)
    const data = (await res.json()) as { tidbits: Tidbit[] }
    trivia$.assign({ list: data.tidbits, lang, syncedAt: now })
  } catch (e) {
    console.error(e)
  }
}

export const categoryLabels: Record<TidbitCategory, string> = {
  language: '言葉',
  food: '食',
  culture: '文化',
  nature: '自然',
  history: '歴史',
}

// Display names for the bilingual language picker (mame src/utils/i18n.ts).
export const languageNames: Record<string, string> = {
  en: 'English',
  zh: '中文',
  fr: 'Français',
  it: 'Italiano',
  es: 'Español',
}
