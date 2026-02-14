import { Button, Pressable, Text, View } from 'react-native'
import { setAudioModeAsync, useAudioPlayer, useAudioPlayerStatus } from 'expo-audio'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import { Slider } from '@expo/ui/jetpack-compose'
import { IconForward, IconRewind } from '../icons/Icons'
import { useEffect } from 'react'
import { ui$ } from '@/states/ui'
import { settings$ } from '@/states/settings'
import { nhk$ } from '@/states/nhk'
import { colors } from '@/lib/colors'
import { useColorScheme } from 'nativewind'

function padLeft(v: number) {
  return v.toString().padStart(2, '0')
}

function formatSeconds(v: number) {
  const minutes = Math.trunc(v / 60)
  const seconds = Math.trunc(v % 60)
  return `${padLeft(minutes)}:${padLeft(seconds)}`
}

setAudioModeAsync({ shouldPlayInBackground: true })

export const NhkPlayer: React.FC<{ audio: string; onDone: () => void }> = ({ audio, onDone }) => {
  const player = useAudioPlayer(audio)
  const status = useAudioPlayerStatus(player)
  const { colorScheme } = useColorScheme()
  const isDark = colorScheme === 'dark'
  const currentColors = isDark ? colors.dark : colors.light

  useEffect(() => {
    if (settings$.nhkAutoPlaying.get()) {
      player.play()
      settings$.nhkAutoPlaying.set(false)
    }
  }, [])

  if (status.didJustFinish) {
    player.seekTo(0)
    player.pause()
    onDone()
  }

  return (
    <View className="bg-green-600 dark:bg-green-700 flex-row items-center justify-between">
      <View className="flex-row items-center">
        <MaterialIcons.Button
          color="white"
          backgroundColor="transparent"
          iconStyle={{ marginRight: 0 }}
          name={status.playing ? 'pause' : 'play-arrow'}
          size={36}
          onPress={() => (status.playing ? player.pause() : player.play())}
          underlayColor="rgba(255, 255, 255, 0.2)"
        />
        <Text className="ml-1 text-[13px] text-gray-100">
          {formatSeconds(status.currentTime)} / {formatSeconds(status.duration)}
        </Text>
      </View>
      <View className="flex-row items-center gap-4 pr-2">
        <Pressable onPress={() => player.seekTo(player.currentTime - 5)}>
          <IconRewind color="white" />
        </Pressable>
        <Pressable onPress={() => player.seekTo(player.currentTime + 10)}>
          <IconForward color="white" />
        </Pressable>
      </View>
    </View>
  )
}
