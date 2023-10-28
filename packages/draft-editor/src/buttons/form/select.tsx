import React from 'react'
import styled from 'styled-components'
import { Select as KeystoneSelect } from '@keystone-ui/fields'

const SelectBlock = styled.div`
  margin: 10px 0;
`

const Label = styled.label`
  display: block;
  margin: 10px 0;
  font-weight: 600;
`

type Option = {
  label: string
  value: string
}

type SelectProps = {
  title: string
  value: string
  options: Option[]
  onChange: (arg0: string) => void
}

export function Select({ title, value, options, onChange }: SelectProps) {
  return (
    <SelectBlock>
      <Label htmlFor={title}>{title}</Label>
      <KeystoneSelect
        value={options.find((option: Option) => option.value === value) || null}
        options={options}
        onChange={(option: Option) => {
          onChange(option.value)
        }}
      />
    </SelectBlock>
  )
}
