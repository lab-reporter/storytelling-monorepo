import styled from 'styled-components'
import { cdnPrefix } from '../utils/buttons'

export const FieldContainerWithMaxWidth = styled.div`
  max-width: 700px;
`

export const PuzzlePhotoEditorContainer = styled.div`
  position: relative;
  z-index: 30;
  background-color: #fff;
`

export const LayoutPickerContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  height: 100%;
  width: 100%;
  justify-content: center;
  align-items: center;
  z-index: 100;
  background-color: #323232;
`

export const LayoutPickerCloseOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  cursor: pointer;
`

export const LayoutPickerGrid = styled.div`
  display: grid;
  gap: 20px;
  height: 90%;
  width: 90%;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  place-items: center;
`

export const LayoutPickerButton = styled.button`
  margin: 10px;
  border: none;
  height: 100%;
  aspect-ratio: 1 / 1;
  background: #f2f4f7;
  cursor: pointer;
  display: flex;
  padding: 10px;
  position: relative;
`

export const LayoutOptionButtonWrapper = styled.div<{
  selected: boolean
  cols: string
  rows: string
  inset?: number
}>`
  position: relative;
  width: 100%;
  height: 100%;
  // padding: 10%;
  display: grid;
  gap: 5px;
  grid-template-columns: ${(props) => props.cols};
  grid-template-rows: ${(props) => props.rows};
  box-sizing: border-box;
  padding: ${(props) => (props.inset ? `${props.inset}%` : 0)};
`

export const LayoutOptionCell = styled.div<{
  inset?: number
  col: string
  row: string
}>`
  grid-column: ${(props) => props.col};
  grid-row: ${(props) => props.row};
  background: #fff;
  border: 1px solid #e1e5ea;
  // border-radius: 3px;
`

export const EditorLayoutWrapper = styled.div<{
  cols: string
  rows: string
  inset?: number
  aspectRatio?: string
}>`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 60%;
  height: 90%;
  aspect-ratio: ${(props) => props.aspectRatio || '1 / 1'};
  display: grid;
  gap: 8px;
  grid-template-columns: ${(props) => props.cols};
  grid-template-rows: ${(props) => props.rows};
  padding: ${(props) => (props.inset ? `${props.inset}px` : 0)};
  background-color: #f2f4f7;
`

export const EditorLayoutCell = styled.div<{
  col: string
  row: string
}>`
  grid-column: ${(props) => props.col};
  grid-row: ${(props) => props.row};
  background-color: #8e8e8e;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 4px;
  overflow: hidden;
`

export const ConfigPanelOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.3);
  z-index: 1000;
`

export const ConfigPanel = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  width: 500px;
  height: 100vh;
  background-color: white;
  z-index: 1001;
  box-shadow: -4px 0 12px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  padding: 32px;
`

export const ConfigPanelTitle = styled.h2`
  margin: 0 0 24px 0;
  font-size: 20px;
  font-weight: bold;
`

export const ConfigPanelForm = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  flex: 1;
`

export const ConfigPanelFooter = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 24px;
`

export const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

export const Label = styled.label`
  font-size: 14px;
  font-weight: 500;
  color: #374151;
`

export const Input = styled.input`
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  &:focus {
    outline: none;
    border-color: #2563eb;
    ring: 2px solid #3b82f6;
  }
`

export const ActionButton = styled.button<{ primary?: boolean }>`
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  border: ${(props) => (props.primary ? 'none' : '1px solid #d1d5db')};
  background-color: ${(props) => (props.primary ? '#2563eb' : 'white')};
  color: ${(props) => (props.primary ? 'white' : '#374151')};
  &:hover {
    background-color: ${(props) => (props.primary ? '#1d4ed8' : '#f9fafb')};
  }
`

export const CellOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  & > * {
    pointer-events: auto;
  }
`

export const EditPhotoIconWrapper = styled.div`
  /* Centered by flex parent */
`

export const DeletePhotoIconWrapper = styled.div`
  position: absolute;
  bottom: 8px;
  left: 50%;
  transform: translateX(-50%);
`

export const CheckIcon = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  // border-radius: 8px;
  background-color: #000;
  background-image: url(${cdnPrefix + '/lexical/success-alt.svg'});
  background-repeat: no-repeat;
  background-position: center;
  background-size: 100%;
  filter: invert(100%);
  z-index: 2;
  margin: 0;
  padding: 0;
`
