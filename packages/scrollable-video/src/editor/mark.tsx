import React from 'react'
import { AlertDialog } from '@keystone-ui/modals'
import { CaptionInput, CaptionState } from './button.js'
import { DeleteMarkIcon, EditMarkIcon, MarkIcon } from './styled.js'
import { useState } from 'react'
import styled from '../styled-components.js'

const Container = styled.div`
  position: relative;

  svg {
    width: 40px;
  }

  svg:nth-child(2) {
    position: absolute;
    width: 40px;
    height: 40px;
    bottom: -20px;
    left: 0px;
  }
`

const modes = {
  default: 'default',
  tooltip: 'tooltip',
  edit: 'edit',
  delete: 'delete',
}

/**
 *  @callback OnCaptionMarkChange
 *  @param {CaptionState} captionState
 *  @returns {undefined}
 */

/**
 *  @param {Object} opts
 *  @param {string} [opts.className]
 *  @param {CaptionState} opts.captionState
 *  @param {OnCaptionMarkChange} opts.onChange
 */
export function CaptionMark({
  className,
  captionState,
  onChange,
}: {
  className?: string
  captionState: CaptionState
  onChange: (arg0: CaptionState | null) => void
}) {
  const [mode, setMode] = useState(modes.default)

  let iconsJsx = null

  switch (mode) {
    case modes.tooltip:
    case modes.delete:
    case modes.edit: {
      iconsJsx = (
        <>
          <EditMarkIcon
            onClick={() => {
              setMode(modes.edit)
            }}
          />
          <DeleteMarkIcon
            onClick={() => {
              setMode(modes.delete)
            }}
          />
        </>
      )
      break
    }

    case modes.default:
    default: {
      iconsJsx = (
        <MarkIcon
          onClick={() => {
            setMode(modes.tooltip)
          }}
        />
      )
      break
    }
  }

  const deleteAlertJsx = (
    // @ts-ignore `children` should be optional
    <AlertDialog
      title="確認刪除"
      isOpen={mode === modes.delete}
      actions={{
        cancel: {
          label: 'Cancel',
          action: () => {
            setMode(modes.default)
          },
        },
        confirm: {
          label: 'Confirm',
          action: () => {
            onChange(null)
            setMode(modes.default)
          },
        },
      }}
    ></AlertDialog>
  )

  return (
    <Container className={className}>
      <CaptionInput
        onConfirm={(captionState) => {
          onChange(captionState)
          setMode(modes.default)
        }}
        onCancel={() => {
          setMode(modes.default)
        }}
        isOpen={mode === modes.edit}
        inputValue={captionState}
      />
      {deleteAlertJsx}
      {iconsJsx}
    </Container>
  )
}
