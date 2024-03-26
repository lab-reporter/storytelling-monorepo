import React, { useState, useEffect } from 'react'
import { ContentState } from 'draft-js'
import { AlertDialog } from '@keystone-ui/modals'
import { TextInput } from '@keystone-ui/fields'
import { EditableWrapper } from './wrapper'
import { readOnlyLinkDecorator } from './read-only-link'

export const LinkEditor = (props: {
  isOpen: boolean
  urlValue: string
  onConfirm: (linkURL: string) => void
  onCancel: () => void
}) => {
  const { isOpen, urlValue, onConfirm, onCancel } = props
  const [url, setURL] = useState(urlValue)

  return (
    <AlertDialog
      title="編輯外部連結或內部錨點(ID)"
      isOpen={isOpen}
      actions={{
        cancel: {
          label: 'Cancel',
          action: () => onCancel(),
        },
        confirm: {
          label: 'Confirm',
          action: () => onConfirm(url),
        },
      }}
    >
      <TextInput
        placeholder="連結"
        type="text"
        value={url}
        onChange={(e) => setURL(e.target.value)}
      />
    </AlertDialog>
  )
}

const EditableLink = (props: {
  onEditStart: () => void
  onEditFinish: (arg0?: { entityKey?: string; entityData?: object }) => void
  contentState: ContentState
  entityKey: string
  children: React.ReactNode
}) => {
  const { children, contentState, entityKey } = props
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [url, setURL] = useState(
    contentState?.getEntity(entityKey)?.getData()?.url
  )

  useEffect(() => {
    setURL(contentState?.getEntity(entityKey).getData()?.url)
  })

  const onURLChange = (url: string) => {
    setIsModalOpen(false)
    setURL(url)
    props.onEditFinish({
      entityKey,
      entityData: {
        url: url,
      },
    })
  }

  return (
    <>
      {isModalOpen && (
        <LinkEditor
          isOpen={isModalOpen}
          urlValue={url}
          onConfirm={onURLChange}
          onCancel={() => {
            setIsModalOpen(false)
            props.onEditFinish()
          }}
        />
      )}
      <EditableWrapper
        component={
          <readOnlyLinkDecorator.component
            contentState={contentState}
            entityKey={entityKey}
          >
            {children}
          </readOnlyLinkDecorator.component>
        }
        onClick={(e) => {
          e.preventDefault()
          setIsModalOpen(true)
          props.onEditStart()
        }}
      />
    </>
  )
}

export const editableLinkDecorator = {
  strategy: readOnlyLinkDecorator.strategy,
  component: EditableLink,
}
