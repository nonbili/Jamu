import { trivia$ } from '@/states/trivia'
import { settings$ } from '@/states/settings'
import { categoryLabels, fetchTidbits } from '@/lib/trivia'
import { TriviaSettingsButton } from '@/components/trivia/TriviaSettingsButton'
import { useValue } from '@legendapp/state/react'
import dayjs from 'dayjs'
import { Stack, useLocalSearchParams } from 'expo-router'
import { useEffect, useMemo } from 'react'
import { Pressable, Share, Text, View } from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'
import { WebView } from 'react-native-webview'
import { useColorScheme } from 'nativewind'
import { colors } from '@/lib/colors'
import * as WebBrowser from 'expo-web-browser'

function wrapHtml(body: string, isDark: boolean) {
  const muted = isDark ? '#94a3b8' : '#64748b'
  const border = isDark ? '#1e293b' : '#e2e8f0'
  return /* HTML */ `
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <style>
          img {
            max-width: 100%;
          }
          body {
            margin: 0;
            padding: 8px 16px 40px;
            line-height: 1.9;
            font-size: 18px;
            background-color: ${isDark ? '#020617' : '#ffffff'};
            color: ${isDark ? '#f8fafc' : '#020617'};
          }
          a {
            color: ${isDark ? '#60a5fa' : '#2563eb'};
          }
          p {
            margin: 0 0 10px;
          }
          .pair {
            padding-bottom: 14px;
            margin-bottom: 14px;
            border-bottom: 1px solid ${border};
          }
          .pair:last-child {
            border-bottom: none;
          }
          .tr {
            color: ${muted};
            font-size: 16px;
          }
        </style>
      </head>
      <body>
        ${body}
      </body>
    </html>
  `
}

function buildSingleBody(paragraphs: string[]) {
  return paragraphs.map((p) => `<p>${p}</p>`).join('\n')
}

function buildBilingualBody(ja: string[], tr: string[]) {
  const n = Math.max(ja.length, tr.length)
  const blocks: string[] = []
  for (let i = 0; i < n; i++) {
    const parts: string[] = []
    if (ja[i]) parts.push(`<p class="ja">${ja[i]}</p>`)
    if (tr[i]) parts.push(`<p class="tr">${tr[i]}</p>`)
    blocks.push(`<div class="pair">${parts.join('')}</div>`)
  }
  return blocks.join('\n')
}

export default function TriviaSlugScreen() {
  const params = useLocalSearchParams()
  const list = useValue(trivia$.list)
  const loadedLang = useValue(trivia$.lang)
  const { triviaBilingual, triviaLang } = useValue(settings$)
  const { colorScheme } = useColorScheme()
  const isDark = colorScheme === 'dark'

  const tidbit = useMemo(() => list.find((x) => x.slug === params.slug), [list, params.slug])

  // The chosen translation is a global setting; honor it only when this tidbit
  // actually has that language, otherwise fall back to Japanese.
  const hasLang = !!tidbit && triviaBilingual && tidbit.langs.includes(triviaLang)
  const wantLang = hasLang ? triviaLang : 'ja'

  useEffect(() => {
    fetchTidbits(wantLang)
  }, [wantLang])

  const bilingualReady = hasLang && loadedLang === triviaLang && !!tidbit?.translation

  const html = useMemo(() => {
    if (!tidbit) return ''
    if (bilingualReady && tidbit.translation) {
      return wrapHtml(buildBilingualBody(tidbit.paragraphs, tidbit.translation.paragraphs), isDark)
    }
    return wrapHtml(buildSingleBody(tidbit.paragraphs), isDark)
  }, [tidbit, bilingualReady, isDark])

  if (!tidbit) {
    return null
  }

  const iconColor = colors[isDark ? 'dark' : 'light'].icon
  const onShare = () => {
    const url = `https://m.ame.ninja/${tidbit.slug}`
    Share.share({ message: `${tidbit.title}\n${url}`, url })
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: '',
          headerRight: () => (
            <View className="flex-row items-center gap-5">
              <Pressable onPress={onShare} hitSlop={8}>
                <MaterialIcons name="share" size={22} color={iconColor} />
              </Pressable>
              <TriviaSettingsButton />
            </View>
          ),
        }}
      />
      <View className="flex-1 bg-white dark:bg-slate-950">
        <Text className="bg-white dark:bg-slate-950 text-xl font-semibold px-4 pt-4 dark:text-white">
          {tidbit.title}
        </Text>
        <View className="flex-row items-center gap-2 px-4 pt-2 pb-2 bg-white dark:bg-slate-950">
          <Text className="text-xs text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950 px-2 py-0.5 rounded">
            {categoryLabels[tidbit.category] ?? tidbit.category}
          </Text>
          <Text className="text-sm text-gray-500 dark:text-gray-400">
            {dayjs(tidbit.date).format('YYYY/MM/DD')}
          </Text>
        </View>

        <View style={{ flex: 1 }}>
          {html && (
            <WebView
              className="bg-white dark:bg-slate-950"
              originWhitelist={['*']}
              source={{ html, baseUrl: 'https://m.ame.ninja' }}
              textZoom={100}
            />
          )}
        </View>
        {tidbit.source && (
          <Pressable
            className="px-4 py-3 bg-white dark:bg-slate-950 active:bg-slate-100 dark:active:bg-slate-800"
            onPress={() => WebBrowser.openBrowserAsync(tidbit.source!)}
          >
            <Text className="text-sm text-blue-600 dark:text-blue-400">参考リンクを開く</Text>
          </Pressable>
        )}
      </View>
    </>
  )
}
