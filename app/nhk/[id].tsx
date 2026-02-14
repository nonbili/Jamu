import { NhkPlayer } from '@/components/nhk/NhkPlayer'
import { fetchNewsArticle } from '@/lib/nhk'
import { nhk$ } from '@/states/nhk'
import { useValue } from '@legendapp/state/react'
import dayjs from 'dayjs'
import { Stack, useLocalSearchParams, useRouter } from 'expo-router'
import { useEffect, useMemo, useState } from 'react'
import { Text, View, Share } from 'react-native'
import { WebView } from 'react-native-webview'
import { Button, ContextMenu, Switch } from '@expo/ui/jetpack-compose'
import { colors } from '@/lib/colors'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import { ui$ } from '@/states/ui'
import { settings$ } from '@/states/settings'
import { useColorScheme } from 'nativewind'

function patchNewsBody(body: string, isDark: boolean) {
  return /* HTML */ `
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <style>
          rt {
            margin-bottom: 4px;
          }
          img {
            max-width: 100%;
          }
          body {
            line-height: 2.8;
            font-size: 18px;
            background-color: ${isDark ? '#020617' : '#ffffff'};
            color: ${isDark ? '#f8fafc' : '#020617'};
          }
          a {
            color: ${isDark ? '#60a5fa' : '#2563eb'};
          }
        </style>
      </head>
      <body>
        ${body}
      </body>
    </html>
  `
}
export default function NhkIdScreen() {
  const params = useLocalSearchParams()
  const { list, autoPlay } = useValue(nhk$)
  const { colorScheme } = useColorScheme()
  const isDark = colorScheme === 'dark'
  const currentColors = isDark ? colors.dark : colors.light
  const router = useRouter()

  const { news, index, html } = useMemo(() => {
    const index = list.findIndex((x) => x.id == params.id)
    const news = list[index]
    const html = news ? patchNewsBody(news.html, isDark) : ''
    return { news, index, html }
  }, [list, params.id, isDark])

  if (!news) {
    return null
  }

  const onNext = () => {
    if (autoPlay && index < list.length - 1) {
      const item = list[index + 1]
      settings$.nhkAutoPlaying.set(true)
      setTimeout(() => {
        router.replace(`/nhk/${item.id}`)
      })
    }
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: '',
          headerRight: () => (
            <View className="-mr-3">
              <ContextMenu color={currentColors.bg}>
                <ContextMenu.Items>
                  <Button
                    elementColors={{
                      containerColor: currentColors.bg,
                      contentColor: currentColors.text,
                    }}
                    onPress={() => Share.share({ message: news.webUrl })}
                  >
                    Share
                  </Button>
                </ContextMenu.Items>
                <ContextMenu.Trigger>
                  <Button
                    elementColors={{
                      containerColor: 'transparent',
                      contentColor: currentColors.icon,
                    }}
                    leadingIcon="filled.MoreVert"
                  >
                    {''}
                  </Button>
                </ContextMenu.Trigger>
              </ContextMenu>
            </View>
          ),
        }}
      />
      <View className="flex-1 bg-white dark:bg-slate-950">
        <Text className="bg-white dark:bg-slate-950 text-xl font-semibold px-2 pt-4 dark:text-white">{news.title}</Text>
        <Text className="bg-white dark:bg-slate-950 text-sm text-gray-500 px-2 pt-2 pb-2 dark:text-gray-400">
          {dayjs(news.publishedAt).format('MM/DD HH:mm')}
        </Text>
        <View style={{ flex: 1 }}>
          {html && (
            <WebView
              className="text-lg bg-white dark:bg-slate-950"
              originWhitelist={['*']}
              source={{ html, baseUrl: 'https://nhkeasier.com' }}
              textZoom={100}
            />
          )}
        </View>
        {news.audio && <NhkPlayer audio={news.audio} onDone={onNext} />}
      </View>
    </>
  )
}
