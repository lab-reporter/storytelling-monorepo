import React from 'react'
import {
  NavigationContainer,
  NavItem,
  ListNavItems,
} from '@keystone-6/core/admin-ui/components'
import type { NavigationProps } from '@keystone-6/core/admin-ui/components'

export function CustomNavigation({
  authenticatedItem,
  lists,
}: NavigationProps) {
  return (
    <NavigationContainer authenticatedItem={authenticatedItem}>
      <NavItem href="/">首頁</NavItem>
      <ListNavItems lists={lists} />
      <NavItem href="/iframe/zoom-in">大圖點我</NavItem>
      <NavItem href="/iframe/scrollable-image">橫著滾吧</NavItem>
      <NavItem href="/iframe/timeline">大事記</NavItem>
      <NavItem href="/iframe/dual-channel">左右互搏</NavItem>
    </NavigationContainer>
  )
}
