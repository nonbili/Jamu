import { colors } from '@/lib/colors'
import { Button, ContextMenu } from '@expo/ui/jetpack-compose'
import type { Item } from './NouMenu'
import { useColorScheme } from 'nativewind'

export const NouMenu: React.FC<{ trigger: string; items: Item[] }> = ({ trigger, items }) => {
  const { colorScheme } = useColorScheme()
  const isDark = colorScheme === 'dark'
  const currentColors = isDark ? colors.dark : colors.light

  const menuItems = items.map((item, index) => (
    <Button
      key={index}
      elementColors={{
        containerColor: currentColors.bg,
        contentColor: currentColors.text,
      }}
      onPress={item.handler}
    >
      {item.label}
    </Button>
  ))

  return (
    <ContextMenu color={currentColors.bg}>
      <ContextMenu.Items>{menuItems}</ContextMenu.Items>
      <ContextMenu.Trigger>
        <Button
          variant="borderless"
          style={{ width: 52, minWidth: 0 }}
          elementColors={{ containerColor: 'transparent', contentColor: currentColors.icon }}
          leadingIcon={trigger as any}
        >
          {''}
        </Button>
      </ContextMenu.Trigger>
    </ContextMenu>
  )
}
