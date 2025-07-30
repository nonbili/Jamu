import { Pressable, ScrollView, Text, View } from 'react-native'
import { Link, Stack } from 'expo-router'
import { gojuon } from '@/lib/gojuon'
import { colors } from '@/lib/colors'
import { speakJa, stopJa } from '@/components/Kana'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import { useEffect, useState } from 'react'

const texts = gojuon.map((row) => row.map((arr) => arr[0])).flat()

export default function GojuonScreen() {
  const [isKata, setIsKata] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)

  function startRead() {
    speakJa(texts)
    setIsPlaying(true)
  }

  function stopRead() {
    stopJa()
    setIsPlaying(false)
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: '五十音',
          headerRight: () => (
            <View className="flex-row items-center gap-3">
              <Pressable onPress={() => setIsKata(!isKata)}>
                <Text>{isKata ? '片仮名' : '平仮名'}</Text>
              </Pressable>
              <MaterialIcons.Button
                color={colors.icon}
                backgroundColor="transparent"
                iconStyle={{ marginRight: 0 }}
                name={isPlaying ? 'stop' : 'volume-up'}
                size={24}
                onPress={() => (isPlaying ? stopRead() : startRead())}
                underlayColor={colors.underlay}
              />
            </View>
          ),
        }}
      />
      <ScrollView className="my-1">
        {gojuon.map((row, index) => (
          <View className="mb-px flex-row gap-px justify-center" key={index}>
            {row.map(([hira, kata, roma], index) => (
              <Pressable onPress={() => speakJa([hira])} key={index}>
                <View className="bg-white w-[64px] h-[64px] items-center justify-center">
                  <Text className="text-sm text-gray-400">{roma}</Text>
                  <Text className="text-[28px]">{isKata ? kata : hira} </Text>
                </View>
              </Pressable>
            ))}
          </View>
        ))}
      </ScrollView>
    </>
  )
}
