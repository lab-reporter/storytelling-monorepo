import styled, { css } from 'styled-components'

export const DraftEditorWrapper = styled.div`
  /* Rich-editor default setting (.RichEditor-root)*/
  background: #fff;
  border: 1px solid #ddd;
  font-family: 'Georgia', serif;
  font-size: 14px;
  padding: 15px;

  /* Custom setting */
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
    'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji',
    'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';
  width: 100%;
  height: 100%;
  background: rgb(255, 255, 255);
  border-radius: 6px;
  padding: 0 1rem 1rem;
`

export const DraftEditorControls = styled.div`
  padding-top: 1rem;
  width: 100%;
  background: rgb(255, 255, 255);
`

export const DraftEditorControlsWrapper = styled.div`
  width: 100%;
  position: relative;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  padding-right: 45px;
  gap: 2px;
`

export const TextEditorWrapper = styled.div`
  /* Rich-editor default setting (.RichEditor-editor)*/
  border-top: 1px solid #ddd;
  cursor: text;
  font-size: 16px;
  margin-top: 10px;
`

export const DraftEditorContainer = styled.div<{ isEnlarged: boolean }>`
  overflow-x: hidden;
  position: relative;
  margin-top: 4px;
  ${(props) =>
    props.isEnlarged
      ? css`
          position: fixed;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
          z-index: 30;
          padding-left: 3em;
          padding-right: 3em;
          background: rgba(0, 0, 0, 0.5);
        `
      : ''}
  ${DraftEditorWrapper} {
    ${(props) =>
      props.isEnlarged
        ? css`
            width: 100%;
            height: 100%;
            padding: 0 1rem 0;
            overflow: scroll;
          `
        : ''}
  }
  ${DraftEditorControls} {
    ${(props) =>
      props.isEnlarged
        ? css`
            position: sticky;
            top: 0;
            z-index: 12;
          `
        : ''}
  }
  ${DraftEditorControlsWrapper} {
    ${(props) =>
      props.isEnlarged
        ? css`
            overflow: auto;
            padding-bottom: 0;
          `
        : ''}
  }
  ${TextEditorWrapper} {
    ${(props) =>
      props.isEnlarged
        ? css`
            max-width: 100%;
            min-height: 100vh;
            padding-bottom: 0;
          `
        : ''}
  }
`

export const EnlargeButtonWrapper = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  margin: 0;
`
