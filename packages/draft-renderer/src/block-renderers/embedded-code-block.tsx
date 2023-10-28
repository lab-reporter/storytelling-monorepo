import React, { useEffect, useMemo, useRef } from 'react'
import styled from 'styled-components'
import { mediaQuery } from '../utils/media-query'
import { parse } from 'node-html-parser'

export const Block = styled.div`
  position: relative;
  white-space: normal;
  /* styles for image link */
  img.img-responsive {
    margin: 0 auto;
    max-width: 100%;
    height: auto;
    display: block;
  }
`

export const Caption = styled.div`
  font-size: ${({ theme }) =>
    theme?.fontSizeLevel === 'large' ? '18px' : '14px'};
  line-height: 1.43;
  letter-spacing: 0.4px;
  color: #808080;
  padding: 15px 15px 0 15px;
`

type EmbeddedCodeBlockProps = {
  className?: string
  data: {
    caption?: string
    embeddedCode: string
  }
}

export const EmbeddedCodeBlock = ({
  className,
  data,
}: EmbeddedCodeBlockProps) => {
  const { caption, embeddedCode } = data
  const embedded = useRef(null)

  // `embeddedCode` is a string, which may includes
  // multiple script tags and other html tags.
  // Here we separate script tags and other html tags
  // by using the isomorphic html parser 'node-html-parser'
  // into scripts nodes and non-script nodes.
  //
  // For non-script nodes we simply put them into dangerouslySetInnerHtml.
  //
  // For scripts nodes we only append them on the client side. So we handle scripts
  // nodes when useEffect is called.
  // The reasons we don't insert script tags through dangerouslySetInnerHtml:
  // 1. Since react use setInnerHtml to append the htmlStirng received from
  //    dangerouslySetInnerHtml, scripts won't be triggered.
  // 2. Although the setInnerhtml way won't trigger script tags, those script tags
  //    will still show on the HTML provided from SSR. When the browser parse the
  //    html it will run those script and produce unexpected behavior.
  const nodes = useMemo(() => {
    const ele = parse(`<div id="draft-embed">${embeddedCode}</div>`)
    const scripts = ele.querySelectorAll('script')
    scripts.forEach((s) => {
      s.remove()
    })
    const nonScripts = ele.querySelectorAll('div#draft-embed > :not(script)')
    const nonScriptsHtml = nonScripts.reduce(
      (prev, next) => prev + next.toString(),
      ''
    )

    return { scripts, nonScripts, nonScriptsHtml }
  }, [embeddedCode])
  const { scripts, nonScriptsHtml } = nodes

  useEffect(() => {
    if (embedded.current) {
      const node: HTMLElement = embedded.current

      const fragment = document.createDocumentFragment()
      scripts.forEach((s) => {
        const scriptEle = document.createElement('script')
        const attrs = s.attributes
        for (const key in attrs) {
          scriptEle.setAttribute(key, attrs[key])
        }
        scriptEle.text = s.text || ''
        fragment.appendChild(scriptEle)
      })

      node.appendChild(fragment)
    }
  }, [scripts])

  return (
    <div className={className}>
      {
        // WORKAROUND:
        // The following `<input>` is to solve [issue 153](https://github.com/mirror-media/openwarehouse-k6/issues/153).
        // If the emebed code generates `<input>` or `<textarea>` and appends them onto DOM,
        // and then the generated `<input>` or `<textarea>` will hijack the users' cursors.
        // It will cause that users could not edit the DraftJS Editor anymore.
        // The following phony `<input>` is used to prevent the generated `<input>` or `<textare>` from
        // hijacking the users' cursors.
      }
      <input hidden disabled />
      <Block
        ref={embedded}
        dangerouslySetInnerHTML={{
          __html: nonScriptsHtml,
        }}
      />
      {caption && <Caption>{caption}</Caption>}
    </div>
  )
}

const ArticleBodyContainer = styled.div`
  max-width: 700px;
  margin: 0 auto 27px auto;

  ${mediaQuery.smallOnly} {
    width: calc(100vw - 30px);
    margin-left: auto;
    margin-right: auto;
  }
`

export function EmbeddedCodeInArticleBody({
  className = '',
  data,
}: EmbeddedCodeBlockProps) {
  return (
    <ArticleBodyContainer className={className}>
      <EmbeddedCodeBlock data={data} />
    </ArticleBodyContainer>
  )
}
