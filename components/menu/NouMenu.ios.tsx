import { colors } from '@/lib/colors'
import { Button, ContextMenu, Host } from '@expo/ui/swift-ui'
import { frame, tint } from '@expo/ui/swift-ui/modifiers'
import type { Item } from './NouMenu'
import { useColorScheme } from 'nativewind'

export const NouMenu: React.FC<{ trigger: string; items: Item[] }> = ({ trigger, items }) => {
  const { colorScheme } = useColorScheme()
  const isDark = colorScheme === 'dark'
  const currentColors = isDark ? colors.dark : colors.light

  const menuItems = items.map((item, index) => (
    <Button key={index} label={item.label} onPress={item.handler} modifiers={[tint(currentColors.text)]} />
  ))

  return (
    <Host matchContents>
      <ContextMenu>
        <ContextMenu.Items>{menuItems}</ContextMenu.Items>
        <ContextMenu.Trigger>
          <Button systemImage={trigger as any} modifiers={[frame({ width: 44, height: 44 }), tint(currentColors.icon)]} />
        </ContextMenu.Trigger>
      </ContextMenu>
    </Host>
  )
}
