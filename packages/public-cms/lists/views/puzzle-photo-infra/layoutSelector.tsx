import React from 'react'
import { layoutOptions, layoutSettings } from './types'
import type { LayoutOption, LayoutProps } from './types'
import {
  LayoutPickerGrid,
  LayoutPickerButton,
  LayoutOptionButtonWrapper,
  LayoutOptionCell,
  CheckIcon,
} from './styles'

export function LayoutPicker({
  layout,
  onChange,
  onClose,
}: {
  layout: LayoutOption
  onChange: (props: LayoutProps) => void
  onClose: () => void
}) {
  return (
    <LayoutPickerGrid>
      {layoutOptions.map((optionId) => {
        if (!optionId) return null
        const setting = layoutSettings[optionId]
        return (
          <LayoutPickerButton
            key={optionId}
            type="button"
            aria-label={`Layout ${optionId}`}
            onClick={() => {
              onChange(setting.props)
              onClose()
            }}
          >
            <LayoutOptionPreview
              layout={optionId}
              selected={layout === optionId}
            />
          </LayoutPickerButton>
        )
      })}
    </LayoutPickerGrid>
  )
}

function LayoutOptionPreview({
  layout,
  selected,
}: {
  layout: Exclude<LayoutOption, undefined>
  selected: boolean
}) {
  const { pickerSetting: setting } = layoutSettings[layout]
  return (
    <>
      <LayoutOptionButtonWrapper
        selected={selected}
        cols={setting.cols}
        rows={setting.rows}
        inset={setting.inset}
      >
        {setting.cells.map((cell, index) => (
          <LayoutOptionCell
            key={`${layout}-${index}`}
            col={cell.col}
            row={cell.row}
          />
        ))}
      </LayoutOptionButtonWrapper>
      {selected && <CheckIcon />}
    </>
  )
}
