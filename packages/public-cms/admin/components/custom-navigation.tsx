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
  const ScrollableThreeModel = lists[lists.length - 1]

  return (
    <NavigationContainer authenticatedItem={authenticatedItem}>
      <NavItem href="/">Dashboard</NavItem>
      <NavItem href="/iframe/landing">介紹</NavItem>
      <NavItem href="https://medium.com/twreporter/d1931cde3133">
        使用說明
      </NavItem>
      <ListNavItems lists={lists.slice(0, lists.length - 1)} />
      <NavItem href="/iframe/timeline">大事記</NavItem>
      <NavItem href="/iframe/dual-channel">左右互搏</NavItem>
      <NavItem href="/iframe/scrollable-image">橫著滾吧</NavItem>
      <NavItem href="/iframe/zoom-in">大圖點我</NavItem>
      <ListNavItems lists={[ScrollableThreeModel]} />
    </NavigationContainer>
  )
}
