import { colors } from '@/lib/colors'
import { DropdownMenu, DropdownMenuItem, Host, Icon, IconButton, Text } from '@expo/ui/jetpack-compose'
import type { Item } from './NouMenu'
import { useColorScheme } from 'nativewind'
import { useState } from 'react'

export const NouMenu: React.FC<{ trigger: string; items: Item[] }> = ({ items }) => {
  const { colorScheme } = useColorScheme()
  const isDark = colorScheme === 'dark'
  const currentColors = isDark ? colors.dark : colors.light
  const [expanded, setExpanded] = useState(false)

  const menuItems = items.map((item, index) => (
    <DropdownMenuItem
      key={index}
      elementColors={{ textColor: currentColors.text }}
      onClick={() => {
        setExpanded(false)
        item.handler()
      }}
    >
      <DropdownMenuItem.Text>
        <Text color={currentColors.text}>{item.label}</Text>
      </DropdownMenuItem.Text>
    </DropdownMenuItem>
  ))

  return (
    <Host matchContents>
      <DropdownMenu color={currentColors.bg} expanded={expanded} onDismissRequest={() => setExpanded(false)}>
        <DropdownMenu.Items>{menuItems}</DropdownMenu.Items>
        <DropdownMenu.Trigger>
          <IconButton
            colors={{ containerColor: 'transparent', contentColor: currentColors.icon }}
            onClick={() => setExpanded(true)}
          >
            <Icon source={require('@/assets/icons/more_vert.xml')} tint={currentColors.icon} size={24} />
          </IconButton>
        </DropdownMenu.Trigger>
      </DropdownMenu>
    </Host>
  )
}
