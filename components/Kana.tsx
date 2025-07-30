import { Pressable, Text, View } from 'react-native'
import { speak, stop } from 'expo-speech'
import { Fragment, useState } from 'react'

export const speakJa = (texts: string[], onDone?: () => void) => {
  if (!texts.length) {
    onDone?.()
    return
  }
  speak(texts[0], { language: 'ja', onDone: () => speakJa(texts.slice(1), onDone) })
}

export const stopJa = stop

export const Kana: React.FC<{ value: string; className?: string }> = ({ value, className }) => {
  const kanas = value.split(' ')

  return (
    <View className="flex-row">
      {kanas.map((kana, index) => (
        <Fragment key={kana}>
          <Pressable onPress={() => speakJa([kana])}>
            <Text className={className || 'text-lg text-orange-700'}>{kana}</Text>
          </Pressable>
          {index < kanas.length - 1 && <Text className="mr-1">、</Text>}
        </Fragment>
      ))}
    </View>
  )
}
