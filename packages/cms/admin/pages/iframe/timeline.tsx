import { PageContainer } from '@keystone-6/core/admin-ui/components'
import { Heading } from '@keystone-ui/core'
import React from 'react'

export default function CustomPage() {
  return (
    <PageContainer header={<Heading type="h3">大事記</Heading>}>
      <div style={{ display: 'flex', width: '100%', height: '100%' }}>
        <iframe
          src="https://lab-storytelling.twreporter.org/timeline"
          width="100%"
          height="100%"
          style={{ flexGrow: 1, border: 'none' }}
        />
      </div>
    </PageContainer>
  )
}
