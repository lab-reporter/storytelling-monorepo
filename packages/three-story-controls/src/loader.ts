import axios from 'axios'
import { GLTFLoader, GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'

/**
 * Load model
 */
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath(
  'https://unpkg.com/three@0.165.0/examples/jsm/libs/draco/'
)
const gltfLoader = new GLTFLoader()
gltfLoader.setDRACOLoader(dracoLoader)

export type { GLTF }

type HandleProgress = (args: ProgressEvent) => void

const getModelFileSize = async (modelUrl: string) => {
  const defaultTotal = 0

  try {
    console.log(
      `[react-three-story-controls]: load model content length. Model url is ${modelUrl}`
    )
    const res = await axios.head(modelUrl)
    if (res.headers['content-length']) {
      const total = parseInt(res.headers['content-length'], 10)
      return total
    }
  } catch (error) {
    console.log(
      '[react-three-story-controls]: error to get gltf model file size. Error:',
      error
    )
  }

  return defaultTotal
}

const loadGltfModel = async (
  modelUrl: string,
  handleProgress?: HandleProgress
) => {
  const defaultModel = null

  try {
    console.log(
      `[react-three-story-controls]: load model async. Model url is ${modelUrl}`
    )
    const gltf = await gltfLoader.loadAsync(modelUrl, (e) => {
      handleProgress?.(e)
    })
    return gltf
  } catch (error) {
    console.log(
      '[react-three-story-controls]: error to load gltf model. Error:',
      error
    )
  }
  return defaultModel
}

export { getModelFileSize, loadGltfModel }
