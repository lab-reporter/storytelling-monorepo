/* eslint no-console: 0 */
import DualSlides from '@story-telling-reporter/react-dual-slides'
import React from 'react' // eslint-disable-line
import ReactDOMServer from 'react-dom/server'
import get from 'lodash/get.js'
import map from 'lodash/map'
import serialize from 'serialize-javascript'
import { ServerStyleSheet } from 'styled-components'
import { KidsKaraoke } from '@story-telling-reporter/react-karaoke'
import { v4 as uuidv4 } from 'uuid'

const _ = {
  get,
  map,
}

/**
 *  @typedef {Object} WebpackAssets
 *  @property {string[]} entrypoints - webpack bundles
 *  @property {string} version - webpack bundles version
 *
 */

/**
 *  @param {import('@story-telling-reporter/react-dual-slides').DualSlidesProps} data
 *  @param {WebpackAssets} webpackAssets
 *  @returns string
 */
export function buildDualSlidesEmbedCode(data, webpackAssets) {
  return buildEmbeddedCode('react-dual-slides', data, webpackAssets)
}

/**
 *  @param {import('@story-telling-reporter/react-three-story-points').ThreeStoryPointsProps} data
 *  @param {WebpackAssets} webpackAssets
 *  @returns string
 */
export function buildThreeStoryPointsEmbedCode(data, webpackAssets) {
  return buildEmbeddedCode('react-three-story-points', data, webpackAssets)
}

/**
 *  @param {import('@story-telling-reporter/react-karaoke').KaraokeProps} data
 *  @param {WebpackAssets} webpackAssets
 *  @returns string
 */
export function buildKaraokeEmbedCode(data, webpackAssets) {
  return buildEmbeddedCode('react-karaoke', data, webpackAssets)
}

/**
 *  @param {Object} data
 *  @param {WebpackAssets} webpackAssets
 *  @returns string
 */
export function buildScrollableVideoEmbedCode(data, webpackAssets) {
  return buildEmbeddedCode('react-scrollable-video', data, webpackAssets)
}

/**
 *
 * @export
 * @param {('react-karaoke'|
 * 'react-three-story-points' |
 * 'react-dual-slides' |
 * 'react-scrollable-video'} pkgName
 * @param {Object} data - Data for react component
 * @param {Object} webpackAssets - webpack bundles and chunks
 * @param {string[]} webpackAssets.entrypoints - webpack bundles
 * @param {string} webpackAssets.version - webpack bundles version
 * @returns {string} embedded code
 */
export function buildEmbeddedCode(pkgName, data, webpackAssets) {
  // use uuid to avoid duplication id
  const uuid = uuidv4()
  const dataWithUuid = {
    ...data,
    uuid,
  }

  const { entrypoints: bundles } = webpackAssets

  let Component = null
  let skipServerSideRendering = false
  switch (pkgName) {
    case 'react-karaoke':
      Component = KidsKaraoke
      break
    case 'react-dual-slides':
      Component = DualSlides
      break
    case 'react-three-story-points':
      skipServerSideRendering = true
      break
    case 'react-scrollable-video':
      skipServerSideRendering = true
      break
    default:
      throw new Error(`pkgName ${pkgName} is not supported`)
  }

  let jsx = `<div id="${uuid}"></div>`
  let styleTags = ''

  if (!skipServerSideRendering) {
    const sheet = new ServerStyleSheet()
    try {
      jsx = ReactDOMServer.renderToStaticMarkup(
        sheet.collectStyles(
          <div id={uuid}>
            <Component {...data} />
          </div>
        )
      )
      styleTags = sheet.getStyleTags()
    } finally {
      sheet.seal()
    }
  }

  return `
    ${styleTags}
    <script>
      (function() {
        var namespace = '@story-telling-reporter';
        var pkg = '${pkgName}@${webpackAssets.version}';
        if (typeof window != 'undefined') {
          if (!window.hasOwnProperty(namespace)) {
            window[namespace] = {};
          }
          if (window[namespace] && !window[namespace].hasOwnProperty(pkg)) {
            window[namespace][pkg] = [];
          }
          if (Array.isArray(window[namespace][pkg])) {
            var data = ${serialize(dataWithUuid)};
            window[namespace][pkg].push(data);
          }
        }
      })()
    </script>
    ${jsx}
    ${_.map(bundles, (bundle) => {
      return `<script type="text/javascript" defer crossorigin src="${bundle}"></script>`
    }).join('')}
  `
}
