import { Button, Pressable, Text, View } from 'react-native'
import { setAudioModeAsync, useAudioPlayer, useAudioPlayerStatus } from 'expo-audio'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import { Slider } from '@expo/ui/jetpack-compose'
import { IconForward, IconRewind } from '../icons/Icons'
import { useEffect } from 'react'
import { ui$ } from '@/states/ui'
import { nhk$ } from '@/states/nhk'

const colors: any = {}

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

  useEffect(() => {
    if (ui$.nhkAutoPlaying.get()) {
      player.play()
      ui$.nhkAutoPlaying.set(false)
    }
  }, [])

  if (status.didJustFinish) {
    player.seekTo(0)
    player.pause()
    onDone()
  }

  return (
    <View className="bg-green-500 flex-row items-center justify-between">
      <View className="flex-row items-center">
        <MaterialIcons.Button
          color={colors.icon}
          backgroundColor="transparent"
          iconStyle={{ marginRight: 0 }}
          name={status.playing ? 'pause' : 'play-arrow'}
          size={36}
          onPress={() => (status.playing ? player.pause() : player.play())}
          underlayColor={colors.underlay}
        />
        <Text className="ml-1 text-[13px] text-gray-100">
          {formatSeconds(status.currentTime)} / {formatSeconds(status.duration)}
        </Text>
      </View>
      <View className="flex-row items-center gap-4 pr-2">
        <Pressable onPress={() => player.seekTo(player.currentTime - 5)}>
          <IconRewind className="" />
        </Pressable>
        <Pressable onPress={() => player.seekTo(player.currentTime + 10)}>
          <IconForward />
        </Pressable>
      </View>
    </View>
  )
}
