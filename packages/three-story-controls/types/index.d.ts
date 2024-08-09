// index.d.ts

import { CameraData, POI } from '../src/react-components/type'
import { GTLFModelObject } from '../src/react-components/loading-progress'

// Type definitions for CameraHelperProps
export type CameraHelperProps = {
  modelObjs: GTLFModelObject[]
  pois?: POI[]
  onChange?: (arg: CameraData) => void
}

// Component definitions
export function CameraHelper({
  modelObjs,
  pois,
  onChange,
}: CameraHelperProps): JSX.Element
