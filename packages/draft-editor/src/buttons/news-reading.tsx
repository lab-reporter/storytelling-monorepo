import React, { useState } from 'react'
import axios from 'axios'
// @ts-ignore pkg does not have definition
import errors from '@twreporter/errors'
import { AtomicBlockUtils, EditorState } from 'draft-js'
import { AlertDialog, Drawer, DrawerController } from '@keystone-ui/modals'
import { TextInput, TextArea } from '@keystone-ui/fields'

type NewsReadingGroup = {
  items: {
    name: string
    embebCode: string
  }[]
} | null

async function fetchNewsReadingGroup(
  itemId: string
): Promise<NewsReadingGroup> {
  const query = `
query GetNewsReadingGroup($itemId: ID!){
  newsReadingGroup(where: {id: $itemId}) {
    items {
      name
      embedCode
    }
  }
}
  `
  let res
  try {
    res = await axios.post('/api/graphql', {
      query,
      variables: {
        itemId,
      },
    })
  } catch (err) {
    const annotatedErr = errors.helpers.annotateAxiosError(err)
    throw annotatedErr
  }

  if (res.data?.errors) {
    const annotatingError = errors.helpers.wrap(
      new Error('Errors occured while executing `GetNewsReadingGroup` query'),
      'GraphQLError',
      '`errors` returned in the GQL query response',
      { errors: res.data.errors }
    )
    throw annotatingError
  }

  return res.data?.data?.newsReadingGroup
}

type OnConfirmArgument = {
  newsReadingGroupId: string
  newsReadingGroup: NewsReadingGroup
}

export function NewsReadingInput({
  isOpen,
  onConfirm,
  onCancel,
  inputValue,
}: {
  isOpen: boolean
  onConfirm: (arg0: OnConfirmArgument) => void
  onCancel: () => void
  inputValue: string
}) {
  const [inputValueState, setInputValueState] = useState(inputValue)
  const [warning, setWarning] = useState('')
  const confirmInput = async () => {
    try {
      const newsReadingGroup = await fetchNewsReadingGroup(inputValueState)
      if (newsReadingGroup === null || newsReadingGroup?.items?.length === 0) {
        throw new Error(`input ${inputValueState} has no data.`)
      }
      onConfirm({
        newsReadingGroupId: inputValueState,
        newsReadingGroup,
      })
    } catch (err) {
      if (err instanceof Error) {
        setWarning(errors.helpers.printAll(err))
        return
      }
      setWarning(err as string)
    }
  }

  let warningJsx = null
  if (warning) {
    warningJsx = (
      <AlertDialog
        isOpen={warning !== ''}
        title={`Something went wrong`}
        actions={{
          confirm: {
            action: () => {
              setWarning('')
            },
            label: 'Done',
          },
        }}
      >
        <TextArea readOnly>{warning}</TextArea>
      </AlertDialog>
    )
  }

  return (
    <>
      {warningJsx}
      <DrawerController isOpen={isOpen}>
        <Drawer
          title="讀報主題"
          actions={{
            cancel: {
              label: 'Cancel',
              action: onCancel,
            },
            confirm: {
              label: 'Confirm',
              action: confirmInput,
            },
          }}
        >
          <TextInput
            onChange={(e) => {
              setInputValueState(e.target.value)
            }}
            placeholder="News-readings-groups Item ID"
            type="text"
            value={inputValueState}
            style={{ marginBottom: '10px', marginTop: '30px' }}
          />
        </Drawer>
      </DrawerController>
    </>
  )
}

type NewsReadingButtonProps = {
  className?: string
  editorState: EditorState
  onChange: (editorState: EditorState) => void
}

export function NewsReadingButton(props: NewsReadingButtonProps) {
  const { onChange, className, editorState } = props

  const [isInputOpen, setIsInputOpen] = useState(false)

  const promptForInput = () => {
    setIsInputOpen(true)
  }

  const onInputChange = (inputValue: OnConfirmArgument) => {
    const contentState = editorState.getCurrentContent()
    const contentStateWithEntity = contentState.createEntity(
      'NEWS_READING',
      'IMMUTABLE',
      {
        newsReadingGroupId: inputValue.newsReadingGroupId,
        readings: inputValue?.newsReadingGroup?.items || [],
      }
    )
    const entityKey = contentStateWithEntity.getLastCreatedEntityKey()
    const newEditorState = EditorState.set(editorState, {
      currentContent: contentStateWithEntity,
    })

    // The third parameter here is a space string, not an empty string
    // If you set an empty string, you will get an error: Unknown DraftEntity key: null
    onChange(AtomicBlockUtils.insertAtomicBlock(newEditorState, entityKey, ' '))

    setIsInputOpen(false)
  }

  const onInputCancel = () => {
    setIsInputOpen(false)
  }

  return (
    <React.Fragment>
      {isInputOpen && (
        <NewsReadingInput
          isOpen={isInputOpen}
          onConfirm={onInputChange}
          onCancel={onInputCancel}
          inputValue=""
        />
      )}
      <div
        onClick={() => {
          promptForInput()
        }}
        className={className}
      >
        <i className="far"></i>
        <span>讀報</span>
      </div>
    </React.Fragment>
  )
}
