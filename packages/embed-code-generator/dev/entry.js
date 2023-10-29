import { buildEmbeddedCode } from '../src/build-code/index.js'
import mocks from './mocks/index.js'
import React, { useRef, useState } from 'react' // eslint-disable-line
import styled from 'styled-components'
import webpackAssets from '../dist/webpack-assets.json'
import { createRoot } from 'react-dom/client'
//import ecgWebpackAssets from '@readr-media/react-embed-code-generator/dist/webpack-assets.json'
//import { buildEmbeddedCode as ecgBuildEmbeddedCode } from '@readr-media/react-embed-code-generator/lib/build-code/index.js'

//const ecg = {
//webpackAssets: ecgWebpackAssets,
//buildEmbeddedCode: ecgBuildEmbeddedCode,
//}

const reactRootId = 'root'
const container = document.getElementById(reactRootId)
const root = createRoot(container)

const FlexBox = styled.div`
  display: flex;
  margin: 20px;
  justify-content: space-around;
`

const Block = styled(FlexBox)``

const LeftBlock = styled(FlexBox)`
  flex-direction: column;
  width: 40vw;
`

const RightBlock = styled.div`
  width: 50vw;
`

const TextBlock = styled.textarea`
  font-size: 16px;
  max-height: 80vh;
  overflow: scroll;
  background-color: #fff;
  padding: 10px;
  border: 1px solid #000;
  border-radius: 5px;
  width: 100%;
  height: 100%;
`

const pkgOptions = [
  {
    id: 'react-karaoke',
    name: 'Karaoke',
    value: 'react-karaoke',
  },
  {
    id: 'react-dual-slides',
    name: 'Dual Slides',
    value: 'react-dual-slides',
  },
  {
    id: 'react-three-story-points',
    name: 'Three Story Points',
    value: 'react-three-story-points',
  },
]

const scriptUrlOptios = [
  {
    id: 'localhost',
    name: 'localhost',
    value: 'localhost',
  },
  {
    id: 'cdn',
    name: 'cdn（unkpkg.com）',
    value: 'cdn',
  },
]

function Panel() {
  const [selectedPkg, setSelectedPkg] = useState('')
  const [selectedScriptUrl, setSelectedScriptUrl] = useState('')
  const mockData = mocks?.[selectedPkg] || {}

  let embedCode = ''
  if (selectedPkg) {
    if (selectedScriptUrl === 'localhost') {
      embedCode = buildEmbeddedCode(selectedPkg, mockData, webpackAssets)
    } else if (selectedScriptUrl === 'cdn') {
      //embedCode = ecg.buildEmbeddedCode(
      //  // @ts-ignore
      //  selectedPkg,
      //  mockData,
      //  ecg.webpackAssets
      //)
    }
  }

  return (
    <Block>
      <LeftBlock>
        <div>
          <Dropdown
            title="請選擇要產生 embed code 的 component"
            options={pkgOptions}
            checkedValue={selectedPkg}
            onChange={(pkg) => {
              setSelectedPkg(pkg)
            }}
          />
        </div>
        <div>
          <Dropdown
            title="請選擇要使用的 script 位址"
            options={scriptUrlOptios}
            checkedValue={selectedScriptUrl}
            onChange={(url) => {
              setSelectedScriptUrl(url)
            }}
          />
        </div>
        <div>
          <h3>Component Props:</h3>
          <TextBlock readOnly value={JSON.stringify(mockData, null, 2)} />
        </div>
      </LeftBlock>
      <RightBlock>
        <h3>Embed Code:</h3>
        <TextBlock readOnly value={embedCode} />
      </RightBlock>
    </Block>
  )
}

root.render(<Panel />)

const Title = styled.h3`
  padding: 16px 0;
  line-height: 200%;
  font-size: 18px;
  font-weight: 400;
  line-height: 150%;
  box-sizing: border-box;
  font-family: 'Noto Sans CJK TC', sans-serif;
  width: 320px;
  margin: 0;
`
const DropdownOptionList = styled.ul`
  position: relative;
  margin: 0;
  padding: 4px 0;
  max-height: 240px;
  overflow-y: auto;
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
  width: 100%;
  cursor: pointer;
  padding: 8px 16px;
  color: #000928;
  text-align: left;
  &:hover {
    color: #fff;
    background-color: #04295e;
    cursor: pointer;
  }
`
const DropdownWrapper = styled.section`
  * {
    font-style: normal;
    font-weight: 400;
    font-size: 18px;
    line-height: 150%;
    box-sizing: border-box;
    font-family: 'Noto Sans CJK TC', sans-serif;
  }
  border-radius: 6px;
  border: 1px solid;
  padding: 1px;
  width: 320px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  margin: 0 0 24px;
`
const DropdownInput = styled.div`
  box-sizing: border-box;
  width: 100%;
  position: relative;
  cursor: pointer;
  font-size: 18px;
  padding: 1px;
  background: #ffffff;
  input {
    width: 100%;
    padding: 12px 48px 12px 16px;
    outline: none;
    border: none;
  }
  .arrow {
    position: absolute;
    top: 42%;
    right: 16px;
    width: 0;
    height: 0;
    border-style: solid;
    border-width: 10px 10px 0 10px;
    border-color: #04295e transparent transparent transparent;
  }
  ${(props) => props.isListOpen && `.arrow {transform: rotate(180deg);}`}
`

/**
 *  @param {Object} props
 *  @param {import('../typedef').Option[]} props.options
 *  @param {string} props.title
 *  @param {string} props.checkedValue
 *  @param {Function} props.onChange
 *  @return React.ReactElement
 */

function Dropdown({ title, ...props }) {
  const inputRef = useRef(null)
  const [isListOpen, setIsListOpen] = useState(false)
  const focusInput = () => {
    inputRef.current.focus()
    inputRef.current.style.borderColor = '#04295e'
  }
  const toggleList = () => {
    setIsListOpen((isListOpen) => !isListOpen)
    focusInput()
  }
  const chooseOption = (option) => {
    toggleList()
    props.onChange(option.value)
    inputRef.current.children[0].value = option.name
  }
  const optionItem = props.options.map((option) => (
    <DropdownOption
      onClick={() => chooseOption(option)}
      key={`option-${option.id}`}
    >
      {option.name}
    </DropdownOption>
  ))

  return (
    <React.Fragment>
      <Title>{title}</Title>
      <DropdownWrapper>
        <DropdownInput
          ref={inputRef}
          onClick={toggleList}
          isListOpen={isListOpen}
        >
          <input readOnly placeholder="請選擇" />
          <span className="arrow"></span>
        </DropdownInput>
        {isListOpen && <DropdownOptionList>{optionItem}</DropdownOptionList>}
      </DropdownWrapper>
    </React.Fragment>
  )
}
