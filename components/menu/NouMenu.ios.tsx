import { colors } from '@/lib/colors'
import { Button, ContextMenu, Host } from '@expo/ui/swift-ui'
import { frame } from '@expo/ui/swift-ui/modifiers'
import type { Item } from './NouMenu'
import { useColorScheme } from 'nativewind'

export const NouMenu: React.FC<{ trigger: string; items: Item[] }> = ({ trigger, items }) => {
  const { colorScheme } = useColorScheme()
  const isDark = colorScheme === 'dark'
  const currentColors = isDark ? colors.dark : colors.light

  const menuItems = items.map((item, index) => (
    <Button key={index} color={currentColors.text} onPress={item.handler}>
      {item.label}
    </Button>
  ))

  return (
    <Host matchContents>
      <ContextMenu activationMethod="singlePress">
        <ContextMenu.Items>{menuItems}</ContextMenu.Items>
        <ContextMenu.Trigger>
          <Button
            variant="borderless"
            color={currentColors.icon}
            systemImage={trigger as any}
            modifiers={[frame({ width: 44, height: 44 })]}
          />
        </ContextMenu.Trigger>
      </ContextMenu>
    </Host>
  )
}
