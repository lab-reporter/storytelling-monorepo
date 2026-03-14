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
      {layoutOptions.map((optionId) => (
        <LayoutPickerButton
          key={optionId}
          type="button"
          aria-label={`Layout ${optionId}`}
        >
          <LayoutOptionButton
            key={optionId}
            layout={optionId}
            selected={layout === optionId}
            onClick={(newLayoutProps) => {
              onChange(newLayoutProps)
              onClose()
            }}
          />
        </LayoutPickerButton>
      ))}
    </LayoutPickerGrid>
  )
}

function LayoutOptionButton({
  layout,
  selected,
  onClick,
}: {
  layout: LayoutOption
  selected: boolean
  onClick: (props: LayoutProps) => void
}) {
  const { pickerSetting: setting, props } = layoutSettings[layout]
  return (
    <>
      <LayoutOptionButtonWrapper
        selected={selected}
        cols={setting.cols}
        rows={setting.rows}
        inset={setting.inset}
        onClick={() => onClick(props)}
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
