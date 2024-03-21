import { createRoot, hydrateRoot } from 'react-dom/client'

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

export { hydrate, render }
