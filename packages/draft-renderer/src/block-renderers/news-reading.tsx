import React, { useState, useMemo } from 'react'
import styled from 'styled-components'
import { Dropdown } from './dropdown'

const ArticleBodyContainer = styled.div`
  max-width: 600px;
  width: calc(280 / 320 * 100%);
  border: 1px solid #eaeaea;
  border-radius: 20px;
  margin-left: auto;
  margin-right: auto;
`

const Divider = styled.div`
  border: 1px solid #eaeaea;
  margin-bottom: 20px;
`

const IframeContainer = styled.div`
  padding: 20px;
`

type NewsReadingProps = {
  className?: string
  data: {
    readings: {
      name: string
      embedCode: string
    }[]
  }
}

const NewsReading = function ({ className, data }: NewsReadingProps) {
  const { readings } = data

  const options = useMemo(
    () =>
      readings.map((r) => {
        return {
          name: r.name,
          value: r.name,
        }
      }),
    [readings]
  )
  const [selectedOption, setSelectedOption] = useState(options[0])
  const selectedReading = readings.find((r) => r.name === selectedOption.value)

  if (readings.length === 0) {
    return null
  }

  return (
    <ArticleBodyContainer className={className}>
      <Dropdown
        options={options}
        onChange={(option) => setSelectedOption(option)}
        labelForMore="更多語言"
      />
      <Divider />
      {selectedReading?.embedCode && (
        <IframeContainer>
          <div
            dangerouslySetInnerHTML={{ __html: selectedReading.embedCode }}
          />
        </IframeContainer>
      )}
    </ArticleBodyContainer>
  )
}

export { NewsReading }
