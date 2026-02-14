import React from 'react'

export interface Item {
  label: string
  handler: () => void
}

export const NouMenu: React.FC<{ trigger: string; items: Item[] }> = () => null
