import { gojuon } from './gojuon'
import { measureWords } from './numbers'
import { todofuken } from './todofuken'
import { QuizQuestion } from '@/states/quiz'

function shuffle<T>(array: T[]): T[] {
  return [...array].sort(() => Math.random() - 0.5)
}

function getRandomOptions(correct: string, allPossible: string[], count: number = 4): string[] {
  const options = new Set<string>()
  options.add(correct)
  const others = shuffle(allPossible.filter((o) => o !== correct))
  for (let i = 0; i < others.length && options.size < count; i++) {
    options.add(others[i])
  }
  return shuffle(Array.from(options))
}

const basicNumbers: [number, string, string][] = [
  [1, '一', 'いち'],
  [2, '二', 'に'],
  [3, '三', 'さん'],
  [4, '四', 'よん'],
  [5, '五', 'ご'],
  [6, '六', 'ろく'],
  [7, '七', 'なな'],
  [8, '八', 'はち'],
  [9, '九', 'きゅう'],
  [10, '十', 'じゅう'],
]

const unitEmojis: Record<string, string> = {
  人: '👤',
  匹: '🐱',
  本: '🥢',
  冊: '📖',
  個: '⚽',
  枚: '✉️',
  杯: '🍷',
  羽: '🐰',
  階: '🏢',
}

export function generateGojuonQuestion(): QuizQuestion {
  const rows = gojuon.flat().filter((item) => item.length > 0)
  const item = rows[Math.floor(Math.random() * rows.length)]
  const isHiragana = Math.random() > 0.5
  const question = isHiragana ? item[0] : item[1]
  const answer = item[2]
  const allRomaji = rows.map((r) => r[2])
  return {
    question,
    answer,
    options: getRandomOptions(answer, allRomaji),
  }
}

export function generateNumberQuestion(): QuizQuestion {
  const rand = Math.random()
  
  // Basic numbers
  if (rand < 0.2) {
    const item = basicNumbers[Math.floor(Math.random() * basicNumbers.length)]
    const question = item[1]
    const answer = item[2]
    const allReadings = basicNumbers.map((r) => r[2])
    return {
      question,
      answer,
      options: getRandomOptions(answer, allReadings),
    }
  }

  // Visual Counter Question (Emoji -> Counter)
  if (rand < 0.5) {
    const units = Object.keys(unitEmojis)
    const unit = units[Math.floor(Math.random() * units.length)]
    const emoji = unitEmojis[unit]
    
    if (Math.random() > 0.5) {
        // Mode 1: Emoji -> Counter name
        const question = emoji
        const answer = unit
        return {
            question,
            answer,
            options: getRandomOptions(answer, units),
        }
    } else {
        // Mode 2: Emoji x N -> Reading
        const num = Math.floor(Math.random() * 10) + 1
        const question = `${emoji} x ${num}`
        const answer = `${num}${unit}`
        const allOptions = units.map(u => `${num}${u}`)
        return {
            question,
            answer,
            options: getRandomOptions(answer, allOptions),
        }
    }
  }

  // Measure word readings
  const units = Object.keys(measureWords) as (keyof typeof measureWords)[]
  const unit = units[Math.floor(Math.random() * units.length)]
  const entries = Object.entries(measureWords[unit])
  const [num, reading] = entries[Math.floor(Math.random() * entries.length)]

  const firstReading = reading.split(' ')[0]
  let q = `${num}${unit}`
  if (unit === '百') q = `${num}00`
  if (unit === '千') q = `${num}000`
  if (unit === 'つ' && num === '10') q = '10'

  const answer = firstReading
  const allReadings = entries.map(([_, r]) => r.split(' ')[0])
  return {
    question: q,
    answer,
    options: getRandomOptions(answer, allReadings),
  }
}

export function generateTodofukenQuestion(): QuizQuestion {
  const item = todofuken[Math.floor(Math.random() * todofuken.length)]
  const question = item.kanji
  const answer = item.hiragana
  const allHiragana = todofuken.map((t) => t.hiragana)
  return {
    question,
    answer,
    options: getRandomOptions(answer, allHiragana),
  }
}

export function generateQuizSession(category: string, enabledCategories: Record<string, boolean> = { gojuon: true, numbers: true, todofuken: true }): QuizQuestion[] {
  const questions: QuizQuestion[] = []
  const usedQuestions = new Set<string>()

  const activeCategories = Object.entries(enabledCategories)
    .filter(([_, enabled]) => enabled)
    .map(([cat]) => cat)

  if (activeCategories.length === 0) return []

  // Safety counter to prevent infinite loops if category has too few questions
  let attempts = 0
  while (questions.length < 7 && attempts < 100) {
    attempts++
    let qCategory = category
    if (category === 'mixed') {
      qCategory = activeCategories[Math.floor(Math.random() * activeCategories.length)]
    }

    let q: QuizQuestion
    if (qCategory === 'gojuon') {
      q = generateGojuonQuestion()
    } else if (qCategory === 'numbers') {
      q = generateNumberQuestion()
    } else {
      q = generateTodofukenQuestion()
    }

    const key = `${q.question}:${q.answer}`
    if (!usedQuestions.has(key)) {
      usedQuestions.add(key)
      questions.push(q)
    }
  }
  return questions
}
