import React, { useRef } from 'react' // eslint-disable-line
import styled from 'styled-components'
import { createRoot } from 'react-dom/client'
import { ScrollToAudio } from '../src/index'

const reactRootId = 'root'
const container = document.getElementById(reactRootId)
const root = createRoot(container)

// ── Layout ────────────────────────────────────────────────────────────────────

const PageWrapper = styled.div`
  max-width: 720px;
  margin: 0 auto;
  padding: 0 24px 120px;
  font-family: sans-serif;
`

const PageTitle = styled.h1`
  font-size: 20px;
  color: #333;
  padding: 32px 0 8px;
  border-bottom: 2px solid #333;
  margin-bottom: 48px;
`

const TestSection = styled.section`
  margin-bottom: 80px;
`

const TestTitle = styled.h2`
  font-size: 16px;
  font-weight: bold;
  color: #555;
  margin-bottom: 6px;
`

const TestDesc = styled.p`
  font-size: 14px;
  color: #888;
  margin: 0 0 24px;
`

// ── Helpers ───────────────────────────────────────────────────────────────────

const Band = styled.div`
  height: ${(p) => p.$height || '100vh'};
  background: ${(p) => p.$bg || '#f0f0f0'};
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #aaa;
  font-size: 14px;
  margin-bottom: 8px;
`

// ── Test 2: custom scroll container ──────────────────────────────────────────

const EditorShell = styled.div`
  position: relative;
  height: 70vh;
  overflow-y: scroll;
  background: #f8f8f8;
  border: 2px solid #ccc;
  border-radius: 8px;
`

const EditorToolbar = styled.div`
  position: sticky;
  top: 0;
  height: 40px;
  background: #4a4a4a;
  color: #fff;
  font-size: 13px;
  display: flex;
  align-items: center;
  padding: 0 16px;
  z-index: 10;
  border-radius: 6px 6px 0 0;
`

const EditorContent = styled.div`
  padding: 0 32px 40px;
`

function CustomScrollContainerTest() {
  const scrollerRef = useRef(null)

  return (
    <EditorShell ref={scrollerRef}>
      <EditorToolbar>
        模擬 editor-shell（此 div 為 scroll container）
      </EditorToolbar>
      <EditorContent>
        <Band $height="100vh" $bg="#ececec">
          ↓ 往下捲動
        </Band>

        <ScrollToAudio
          id="scroll-to-audio-custom-scroller"
          audioUrls={['./audio-1.mp3']}
          scrollerRef={scrollerRef}
        />

        <Band $height="150vh" $bg="#e4e4e4">
          audio 播放區間（mute button 應出現）
        </Band>

        <div id="scroll-to-audio-custom-scroller-bottom-entry-point" />

        <Band $height="80vh" $bg="#dcdcdc">
          ↑ 往上捲動可再觸發
        </Band>
      </EditorContent>
    </EditorShell>
  )
}

// ── App ───────────────────────────────────────────────────────────────────────

function App() {
  return (
    <PageWrapper>
      <PageTitle>scroll-to-audio</PageTitle>

      {/* Test 1: window scroll */}
      <TestSection>
        <TestTitle>綁定在 window 上</TestTitle>
        <TestDesc>
          未傳入 scrollerRef，scroll container 預設為 window。滾動頁面，mute
          button 應出現。
        </TestDesc>
        <Band $height="100vh" $bg="#fde8e8">
          ↓ 往下捲動
        </Band>
        <ScrollToAudio id="scroll-to-audio-1" audioUrls={['./audio-1.mp3']} />
        <Band $height="150vh" $bg="#fdd8d8">
          audio 播放區間（mute button 應出現）
        </Band>
        <div id="scroll-to-audio-1-bottom-entry-point" />
        <Band $height="80vh" $bg="#fcc8c8">
          ↑ 往上捲動可再觸發
        </Band>
      </TestSection>

      {/* Test 2: custom scroll container */}
      <TestSection>
        <TestTitle>綁定在特定 element 上</TestTitle>
        <TestDesc>
          透過 scrollerRef 將 scroll container 指定為下方的 div（模擬
          editor-shell.fullscreen）。在框框內往下捲動，mute button 應出現。
        </TestDesc>
        <CustomScrollContainerTest />
      </TestSection>
    </PageWrapper>
  )
}

root.render(<App />)
