import React, { useEffect, useState } from 'react'
import { FieldProps } from '@keystone-6/core/types'
import { Button } from '@keystone-ui/button'
import { FieldLabel, FieldContainer } from '@keystone-ui/fields'
import { controller } from '@keystone-6/core/fields/types/virtual/views'
import { TextArea } from '@keystone-ui/fields'

export const Field = ({ value }: FieldProps<typeof controller>) => {
  const defaultText = 'Copy to Clipboard'
  const copiedText = 'Copied!'

  const [buttonText, setButtonText] = useState(defaultText)
  const [demoHref, setDemoHerf] = useState('')

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(value)
    setButtonText(copiedText)
    setTimeout(() => setButtonText(defaultText), 2000)
  }

  useEffect(() => {
    const { pathname, origin } = window.location
    setDemoHerf(origin + '/demo' + pathname)
  }, [])

  return (
    <FieldContainer>
      <FieldLabel>Embedded Code</FieldLabel>
      <TextArea readOnly value={value} />
      <Button onClick={copyToClipboard} style={{ marginRight: '10px' }}>
        {buttonText}
      </Button>
      {demoHref ? (
        <a href={demoHref} target="_blank" style={{ textDecoration: 'none' }}>
          <Button>Demo</Button>
        </a>
      ) : null}
    </FieldContainer>
  )
}
