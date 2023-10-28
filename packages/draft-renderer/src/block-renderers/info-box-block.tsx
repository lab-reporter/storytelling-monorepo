import {
  ContentBlock,
  ContentState,
  Editor,
  EditorState,
  RawDraftContentState,
  convertFromRaw,
} from 'draft-js'
import React from 'react'
import styled, { css } from 'styled-components'
import blockRenderMaps from '../block-render-maps/index'
import { ImageInInfoBox } from '../block-renderers/image-block'
import { ThemeColorEnum } from '../utils/index'
import { decorator } from '../entity-decorators/index'
import { mediaQuery } from '../utils/media-query'

enum InfoBoxTypeEnum {
  newsChargeStation = 'news-charge-station',
  headerBorder = 'header-border',
  boxBorder = 'box-border',
}

type InfoBoxBlockProps = {
  className?: string
  data: {
    type: InfoBoxTypeEnum
    rawContentState: RawDraftContentState
  }
}

const containerStyles = css`
  padding: 40px 40px 20px 40px;
  border-radius: 30px;
  position: relative;

  ${mediaQuery.smallOnly} {
    padding: 20px 20px 0px 20px;
  }
`

const NewsChargeStationContainer = styled.div`
  ${containerStyles}

  padding-top: 60px;
  background-color: #fffcf4;

  ${mediaQuery.smallOnly} {
    padding-top: 60px;
  }

  &::before {
    content: '';
    width: 300px;
    height: 80px;
    background-image: url(https://www.unpkg.com/@stroy-telling-reporter/draft-renderer/public/images/info-box-news-charge-station.svg);
    position: absolute;
    top: -40px;
    left: 50%;
    transform: translateX(-50%);
  }
`

const ClearFloat = styled.div`
  clear: both;
`

function NewsChargeStation({ children }: { children: React.ReactNode }) {
  return <NewsChargeStationContainer>{children}</NewsChargeStationContainer>
}

const HeaderBorderContainer = styled.div`
  ${({ theme }) => {
    let logoColor
    let bgColor
    switch (theme?.themeColor) {
      case ThemeColorEnum.YELLOW: {
        logoColor = 'red'
        bgColor = '#fff0d2'
        break
      }
      case ThemeColorEnum.RED: {
        logoColor = 'blue'
        bgColor = '#ffd2d2'
        break
      }
      case ThemeColorEnum.BLUE:
      default: {
        logoColor = 'yellow'
        bgColor = '#d2f5ff'
        break
      }
    }
    return `
      background-color: ${bgColor};
      &::before {
        background-image: url(https://www.unpkg.com/@stroy-telling-reporter/draft-renderer/public/images/info-box-blocksy-child-1-${logoColor}.png);
      }
      `
  }}

  ${containerStyles}

  &::before {
    content: '';
    width: 120px;
    height: 120px;
    background-size: contain;
    position: absolute;
    bottom: 10px;
    right: 10px;
  }
`

function HeaderBorder({ children }: { children: React.ReactNode }) {
  return <HeaderBorderContainer>{children}</HeaderBorderContainer>
}

const BoxBorderContainer = styled.div`
  ${containerStyles}
  background-color: #ebebeb;
  border: 3px solid #232323;
  overflow: hidden;

  ${({ theme }) => `
    &::before {
      background-image: url(https://www.unpkg.com/@stroy-telling-reporter/draft-renderer/public/images/info-box-blocksy-child-2-${
        theme?.themeColor || ThemeColorEnum.BLUE
      }.png);
    }`}

  &::before {
    content: '';
    width: 100px;
    height: 100px;
    background-size: contain;
    position: absolute;
    bottom: 0;
    right: 0;
  }
`

function BoxBorder({ children }: { children: React.ReactNode }) {
  return <BoxBorderContainer>{children}</BoxBorderContainer>
}

const ArticleBodyContainer = styled.div`
  max-width: 700px;
  margin: 60px auto;

  ${mediaQuery.smallOnly} {
    width: calc(100vw - 30px);
    margin-left: auto;
    margin-right: auto;
  }
`

const EditorContainer = styled.div`
  position: relative;
`

export function InfoBoxInArticleBody({ className, data }: InfoBoxBlockProps) {
  const { type, rawContentState } = data
  const contentState = convertFromRaw(rawContentState)
  const editorState = EditorState.createWithContent(contentState, decorator)
  let Component
  let blockRenderMap = blockRenderMaps.infoBox.default
  switch (type) {
    case InfoBoxTypeEnum.headerBorder: {
      Component = HeaderBorder
      blockRenderMap = blockRenderMaps.infoBox.headerBorder
      break
    }
    case InfoBoxTypeEnum.boxBorder: {
      Component = BoxBorder
      break
    }
    case InfoBoxTypeEnum.newsChargeStation:
    default: {
      Component = NewsChargeStation
      break
    }
  }
  return (
    <ArticleBodyContainer className={className}>
      <Component>
        <EditorContainer>
          <Editor
            blockRenderMap={blockRenderMap}
            blockRendererFn={blockRendererFn}
            editorState={editorState}
            readOnly
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            onChange={() => {}}
          />
          <ClearFloat />
        </EditorContainer>
      </Component>
    </ArticleBodyContainer>
  )
}

function AtomicBlock(props: {
  contentState: ContentState
  block: ContentBlock
}) {
  const entity = props.contentState.getEntity(props.block.getEntityAt(0))

  const entityType = entity.getType()
  const entityData = entity.getData()

  switch (entityType) {
    case 'IMAGE': {
      return ImageInInfoBox({ data: entityData })
    }
  }
  return null
}

function blockRendererFn(block: ContentBlock) {
  if (block.getType() === 'atomic') {
    return {
      component: AtomicBlock,
      editable: false,
    }
  }

  return null
}
