import { Button, FlatList, ScrollView, Text, View } from 'react-native'
import { useAudioPlayer } from 'expo-audio'
import { useEffect } from 'react'
import { nhk$ } from '@/states/nhk'
import { use$, useObserveEffect } from '@legendapp/state/react'
import { fetchNewsList } from '@/lib/nhk'
import { Link, Stack } from 'expo-router'
import { Image } from 'expo-image'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/ja'

dayjs.locale('ja')
dayjs.extend(relativeTime)

const blurhash =
  '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj['

export default function NhkScreen() {
  const list = use$(nhk$.list)

  useEffect(() => {
    fetchNewsList()
  }, [])

  return (
    <>
      <Stack.Screen
        options={{
          title: 'NHK Easy News',
        }}
      />
      <FlatList
        data={list}
        renderItem={({ item }) => (
          <Link className="mt-1" href={`/nhk/${item.id}`}>
            <View className="bg-white flex-row gap-2 pr-2">
              <View className="w-[128px]">
                <Image source={item.image} contentFit="cover" placeholder={{ blurhash }} style={{ height: 72 }} />
              </View>
              <View className="flex-1">
                <Text className="text-base flex-1" numberOfLines={2}>
                  {item.title}
                </Text>
                <Text className="text-sm mb-1 text-gray-500">{dayjs(item.publishedAt).fromNow()}</Text>
              </View>
            </View>
          </Link>
        )}
      />
    </>
  )
}
