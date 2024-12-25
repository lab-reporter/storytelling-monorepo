import React from 'react' // eslint-disable-line
import ReactDOMServer from 'react-dom/server'
import serialize from 'serialize-javascript'
import { ServerStyleSheet } from 'styled-components'
import { Karaoke } from '@story-telling-reporter/react-karaoke'
import { KidsSubtitledAudio } from '@story-telling-reporter/react-subtitled-audio'
import { buildBottomEntryPointStaticMarkup } from '@story-telling-reporter/react-scroll-to-audio'
import { v4 as uuidv4 } from 'uuid'
import { pkgNames } from './constants'

// manifest.json is generated after `make build` or `make dev`
import manifest from '../../dist/manifest.json'

/**
 *  @param {import('@story-telling-reporter/react-karaoke').KaraokeProps} data
 *  @returns string
 */
export function buildKaraokeEmbedCode(data) {
  return buildEmbedCode(data, pkgNames.karaoke, Karaoke)
}

/**
 *  @param {import('@story-telling-reporter/react-subtitled-audio').SubtitledAudioProps} data
 *  @returns string
 */
export function buildSubtitledAudioEmbedCode(data) {
  return buildEmbedCode(data, pkgNames.subtitledAudio, KidsSubtitledAudio)
}

/**
 *  @param {Object} data
 *  @returns string
 */
export function buildScrollableImageEmbedCode(data) {
  return buildEmbedCode(data, pkgNames.scrollableImage, null)
}

/**
 *  @param {Object} data
 *  @returns string
 */
export function buildScrollableVideoEmbedCode(data) {
  return buildEmbedCode(data, pkgNames.scrollableVideo, null)
}

/**
 *  @param {Object} data
 *  @param {string} [data.id]
 *  @param {boolean} [bottomEntryPointOnly=false]
 *  @returns string
 */
export function buildScrollToAudioEmbedCode(
  data,
  bottomEntryPointOnly = false
) {
  if (bottomEntryPointOnly) {
    return buildBottomEntryPointStaticMarkup({ id: data?.id })
  }
  return buildEmbedCode(data, pkgNames.scrollToAudio, null)
}

/**
 *  @param {import('@story-telling-reporter/react-three-story-controls').ScrollableThreeModelProps} data
 *  @returns string
 */
export function buildScrollableThreeModelEmbedCode(data) {
  return buildEmbedCode(data, pkgNames.scrollableThreeModel, null)
}

/**
 *
 * @export
 * @param {Object} data - Data for react component
 * @param {string} pkgName - values specified in `pkgNames`
 * @param {Function|null} Component
 * @returns {string} embedded code
 */
export function buildEmbedCode(data, pkgName, Component) {
  // use uuid to avoid duplication id
  const uuid = uuidv4()
  const dataWithUuid = {
    ...data,
    uuid,
  }

  let jsx = ''
  let styleTags = ''

  if (Component) {
    const sheet = new ServerStyleSheet()
    try {
      jsx = ReactDOMServer.renderToStaticMarkup(
        sheet.collectStyles(<Component {...data} />)
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
        var namespace = '@story-telling-reporter/react-embed-code-generator@${
          manifest.version
        }';
        var pkg = '${pkgName}';
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
    <div id="${uuid}">
      ${jsx}
    </div>
    <script type="text/javascript" defer crossorigin src="${
      manifest?.[pkgName]
    }"></script>
  `
}
