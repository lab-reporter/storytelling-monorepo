// PhotoGroupWrapper.tsx
import React from 'react'
import { PhotoGroup } from './PhotoGroup'
import { PhotoLayout } from './PhotoLayout'
import { LayoutProps } from './types'

export function PhotoGroupWrapper({
  config,
  children,
}: {
  config: LayoutProps
  children: React.ReactNode[]
}) {
  return (
    <PhotoGroup {...config}>
      {children?.map((c, i) => (
        <PhotoLayout key={i} {...config} index={i}>
          {c}
        </PhotoLayout>
      ))}
    </PhotoGroup>
  )
}
