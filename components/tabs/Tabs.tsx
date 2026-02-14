import { View, Text, ScrollView, Pressable } from 'react-native'
import { clsx } from '@/lib/utils'

export const Tabs: React.FC<{
  tabs: string[]
  tabIndex: number
  onChange: (index: number) => void
}> = ({ tabs, tabIndex, onChange }) => {
  return (
    <View className="w-full gap-x-2 gap-y-2 flex flex-row flex-wrap">
      {tabs.map((tab, index) => {
        const active = index == tabIndex
        return (
          <Pressable
            key={tab}
            onPress={() => onChange(index)}
            className={clsx('px-4 py-2 rounded-md', active ? 'bg-green-500' : 'bg-gray-100 dark:bg-slate-800')}
          >
            <Text className={clsx(active ? 'text-white' : 'dark:text-white')}>{tab}</Text>
          </Pressable>
        )
      })}
    </View>
  )
}
