import React, { useState } from 'react'
import styled from 'styled-components'

const DropdownOptionList = styled.ul`
  margin: 0;
  position: relative;
  padding: 4px 0;
  max-height: 240px;
  background: #ffffff;
  &::before {
    content: '';
    position: absolute;
    top: 0;
    right: 16px;
    left: 16px;
    height: 1px;
    background-color: #e0e0e0;
  }
`

const DropdownOption = styled.li`
  color: #000928;
  padding: 8px 16px;
  &:hover {
    color: #fff;
    background-color: #04295e;
  }
`

const Container = styled.div`
  width: 100%;
  overflow: hidden;

  font-size: 18px;
  font-weight: 400;
  line-height: 1.5;
`

const InputBlock = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 8px 16px;
  align-items: center;
`

const Input = styled.input`
  background: #ffffff;
  font-size: 18px;
  padding: 12px 0;
  outline: none;
  border: none;
`

const Label = styled.span`
  margin-left: 10px;
  font-size: 14px;
  cursor: pointer;
`

const Arrow = styled.span<{ $isListOpen: boolean }>`
  cursor: pointer;
  margin-left: auto;

  width: 20px;
  height: 20px;
  background-color: #27b5f7;
  border-radius: 50%;
  display: flex;

  &::after {
    content: '';
    margin-left: auto;
    margin-right: auto;
    margin-top: 7px;
    border-style: solid;
    border-width: 6px;
    border-color: #fff transparent transparent transparent;
    transition: transform 0.1s linear;
    transform: ${({ $isListOpen }) =>
      $isListOpen ? 'rotate(180deg)' : 'rotate(0deg)'};
    transform-origin: center 2.5px;
  }
`

type Option = {
  name: string
  value: string
}

type DropdownProps = {
  className?: string
  options: Option[]
  onChange: (option: Option) => void
  labelForMore?: string
}

const Dropdown: React.FC<DropdownProps> = function ({
  className,
  options,
  onChange,
  labelForMore = '',
}) {
  const [isListOpen, setIsListOpen] = useState(false)
  const [selectedOption, setSelectedOption] = useState(options?.[0])
  const toggleList = () => {
    if (options.length <= 1) {
      return
    }
    setIsListOpen(!isListOpen)
  }
  const selectOption = (option: Option) => {
    toggleList()
    onChange(option)
    setSelectedOption(option)
  }
  const optionItem = options.map((option, idx) => (
    <DropdownOption onClick={() => selectOption(option)} key={`option-${idx}`}>
      {option.name}
    </DropdownOption>
  ))

  return (
    <Container className={className}>
      <InputBlock onClick={toggleList}>
        {
          // WORKAROUND:
          // `disabled` attribute is used to prevent `<input>` from hijacking the user's cursors.
          // If `disabled`  is not provided, and then users will not be able to edit the content
          // in the DraftEditor.
        }
        <Input
          disabled
          readOnly
          placeholder="請選擇"
          value={selectedOption.name}
        />
        {options.length > 1 && (
          <>
            <Arrow $isListOpen={isListOpen} />
            {labelForMore && <Label>{labelForMore}</Label>}
          </>
        )}
      </InputBlock>
      {isListOpen && <DropdownOptionList>{optionItem}</DropdownOptionList>}
    </Container>
  )
}

export { Dropdown }
