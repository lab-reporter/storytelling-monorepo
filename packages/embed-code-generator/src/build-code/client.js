import 'regenerator-runtime/runtime'
import { createRoot, hydrateRoot } from 'react-dom/client'

const pkgVersion = process.env.EMBED_CODE_GENERATOR_VERSION
  ? `@${process.env.EMBED_CODE_GENERATOR_VERSION}`
  : ''
const namespace = '@story-telling-reporter'

function hydrate(namespace, pkgName, Component) {
  const dataArr = window[namespace][pkgName]
  if (Array.isArray(dataArr)) {
    dataArr.forEach((data) => {
      const { uuid, ...dataOfComponent } = data
      const container = document.getElementById(uuid)
      hydrateRoot(container, <Component {...dataOfComponent} />)
    })

    // Clean up data to avoid repeated hydration.
    // Repeated hydration might cause unexpected error, such as:
    // there are two karaoke embedded codes in the same web page.
    // The first one embed code script has already hydrated these two embedded codes
    // on the DOM.
    // However, the second embed code script will hydrate them again since
    // `window[namespace][pkgName]` has data.
    // The second hydration will cause unexpected React errors.
    window[namespace][pkgName] = []
  }
}

function render(namespace, pkgName, Component) {
  const dataArr = window[namespace][pkgName]
  if (Array.isArray(dataArr)) {
    dataArr.forEach((data) => {
      const { uuid, ...dataOfComponent } = data
      const container = document.getElementById(uuid)
      const root = createRoot(container)
      root.render(<Component {...dataOfComponent} />)
    })

    // Clean up data to avoid repeated rendering.
    window[namespace][pkgName] = []
  }
}

if (window?.[namespace][`react-karaoke${pkgVersion}`]) {
  import(
    /* webpackChunkName: "react-karaoke" */ '@story-telling-reporter/react-karaoke'
  ).then(({ KidsKaraoke }) => {
    hydrate(namespace, `react-karaoke${pkgVersion}`, KidsKaraoke)
  })
}

if (window?.[namespace][`react-three-story-points${pkgVersion}`]) {
  import(
    /* webpackChunkName: "react-three-story-points" */ '@story-telling-reporter/react-three-story-points'
  ).then(({ default: ThreeStoryPoints }) => {
    render(namespace, `react-three-story-points${pkgVersion}`, ThreeStoryPoints)
  })
}

if (window?.[namespace][`react-dual-slides${pkgVersion}`]) {
  import(
    /* webpackChunkName: "react-dual-slides" */ '@story-telling-reporter/react-dual-slides'
  ).then(({ default: DualSlides }) => {
    hydrate(namespace, `react-dual-slides${pkgVersion}`, DualSlides)
  })
}

if (window?.[namespace][`react-scrollable-video${pkgVersion}`]) {
  import(
    /* webpackChunkName: "react-scrollable-video" */ '@story-telling-reporter/react-scrollable-video/lib/esm/scrollable-video/index'
  ).then(({ ScrollableVideo }) => {
    render(namespace, `react-scrollable-video${pkgVersion}`, ScrollableVideo)
  })
}
