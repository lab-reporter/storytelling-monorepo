import { resourcesHostedAt } from './environment-variables'

const urlPrefix =
  {
    localhost: '.',
    github:
      'https://raw.githubusercontent.com/nickhsine/story-telling-monorepo/main/packages/three-hong-kong-project/dev',
    unpkg:
      'https://unpkg.com/@story-telling-reporter/react-three-hong-kong-project/dev',
    gcs: 'https://story-telling-storage.twreporter.org/projects/three-hong-kong-project',
  }[resourcesHostedAt] ?? '.'

export { urlPrefix }
