import React from 'react' // eslint-disable-line
// manifest.json is generated after `make build-webpack-bundles`
import manifest from '../webpack-bundles/manifest.json' assert { type: 'json' }
import { containerId } from './constants.js'

/**
 *
 * @export
 * @returns {string} embedded code
 */
function buildEmbedCode() {
  return `
    <!-- @story-telling-reporter/three-hong-kong-project embed code -->
    <div id="${containerId}">
    </div>
    <script type="text/javascript" defer crossorigin src="${manifest?.main}"></script>
  `
}

console.log(buildEmbedCode())
