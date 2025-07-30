import { NhkPlayer } from '@/components/nhk/NhkPlayer'
import { fetchNewsArticle } from '@/lib/nhk'
import { nhk$ } from '@/states/nhk'
import { use$ } from '@legendapp/state/react'
import dayjs from 'dayjs'
import { Stack, useLocalSearchParams, useRouter } from 'expo-router'
import { useEffect, useMemo, useState } from 'react'
import { Text, View, Share } from 'react-native'
import { WebView } from 'react-native-webview'
import { Button, ContextMenu, Switch } from '@expo/ui/jetpack-compose'
import { colors } from '@/lib/colors'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import { ui$ } from '@/states/ui'

function patchNewsBody(body: string) {
  return /* HTML */ `
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <style>
          rt {
            margin-bottom: 4px;
          }
        </style>
      </head>
      <body style="line-height:2.8; font-size:18px">
        ${body}
      </body>
    </html>
  `
}
export default function NhkIdScreen() {
  const params = useLocalSearchParams()
  const [html, setHtml] = useState('')
  const { list, autoPlay } = use$(nhk$)
  const settings = {}
  const router = useRouter()

  const { news, index } = useMemo(() => {
    const index = list.findIndex((x) => x.id == params.id)
    return { news: list[index], index }
  }, [list, params.id])

  useEffect(() => {
    ;(async () => {
      const body = await fetchNewsArticle(params.id as string)
      setHtml(patchNewsBody(body || ''))
    })()
  }, [])

  if (!news) {
    return null
  }

  const onNext = () => {
    if (autoPlay && index < list.length - 1) {
      const item = list[index + 1]
      ui$.nhkAutoPlaying.set(true)
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
              <ContextMenu color={colors.bg}>
                {/* @ts-expect-error ?? */}
                <ContextMenu.Items>
                  <Switch
                    value={autoPlay}
                    onValueChange={(checked) => nhk$.autoPlay.set(checked)}
                    label="Auto play next  "
                    variant="switch"
                  />
                  <Button
                    elementColors={{
                      containerColor: colors.bg,
                      contentColor: colors.text,
                    }}
                    onPress={() =>
                      Share.share({ message: `https://www3.nhk.or.jp/news/easy/${news.id}/${news.id}.html` })
                    }
                  >
                    Share
                  </Button>
                </ContextMenu.Items>
                <ContextMenu.Trigger>
                  <MaterialIcons.Button
                    color={colors.icon}
                    backgroundColor="transparent"
                    iconStyle={{ marginRight: 0 }}
                    name="more-vert"
                    size={24}
                    underlayColor={colors.underlay}
                  />
                </ContextMenu.Trigger>
              </ContextMenu>
            </View>
          ),
        }}
      />
      <View className="flex-1">
        <Text className="bg-white text-xl font-semibold px-2 pt-4">{news.title}</Text>
        <Text className="bg-white text-sm text-gray-500 px-2 pt-2 pb-2">
          {dayjs(news.publishedAt).format('MM/DD HH:mm')}
        </Text>
        <View style={{ flex: 1 }}>
          {html && <WebView className="text-lg" originWhitelist={['*']} source={{ html }} textZoom={100} />}
        </View>
        {news.voiceId && <NhkPlayer voiceId={news.voiceId} onDone={onNext} />}
      </View>
    </>
  )
}
