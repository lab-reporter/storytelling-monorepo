import React, { useState, useEffect, useRef, useMemo } from 'react'
import styled, { css } from '../styled-components'
import throttle from 'lodash/throttle'
import debounce from 'lodash/debounce'
import {
  BoxGeometry,
  MeshStandardMaterial,
  Mesh,
  ACESFilmicToneMapping,
  DirectionalLight,
  PerspectiveCamera,
  Vector3,
  Object3D,
  Quaternion,
  Scene,
  WebGLRenderer,
  PCFSoftShadowMap,
} from 'three'
import { GLTF } from '../loader'
import {
  CameraRig,
  StoryPointsControls,
  StoryPointMarker,
} from 'three-story-controls'
import cameraData from './camera-data.json'
import _BlowUpFont from './blow-up'
import _LeeHonKongKaiFont from './lee-hon-kong-kai'
import _LeeHonTungKaiFont from './lee-hon-tung-kai'
import _PrisonFont from './prison'
import { LoadingProgress, GTLFModelObject } from './loading-progress'

const fadeInDuration = 500 // ms

const fontCss = css`
  position: absolute;
  left: 0;
  top: 0;
  transition: opacity ${fadeInDuration}ms linear;
`

const withOpacity = (Component: React.FC) => styled(Component)<{
  $opacity: number
}>`
  ${fontCss}
  opacity: ${(props) => props.$opacity};
`
const BlowUpFont = withOpacity(_BlowUpFont)
const LeeHonKongKaiFont = withOpacity(_LeeHonKongKaiFont)
const LeeHonTungKaiFont = withOpacity(_LeeHonTungKaiFont)
const PrisonFont = withOpacity(_PrisonFont)

const _ = {
  debounce,
  throttle,
}

enum FontName {
  BLOW_UP = '香港北魏',
  LEE_HON_KONG_KAI = '一體成型字',
  LEE_HON_TUNG_KAI = '勾通字',
  PRISON = '監獄體',
}

const modelObjs: GTLFModelObject[] = [
  {
    url: './models/major-scene.glb',
    name: 'MAJOR_SCENE',
  },
  {
    url: './models/lee-hon-kong-kai-font.glb',
    name: FontName.LEE_HON_KONG_KAI,
  },
  {
    url: './models/lee-hon-tung-kai-font.glb',
    name: FontName.LEE_HON_TUNG_KAI,
  },
  {
    url: './models/blow-up-font.glb',
    name: FontName.BLOW_UP,
  },
  {
    url: './models/prison-gothic-font.glb',
    name: FontName.PRISON,
  },
]

const mark3DPositions: { [key: string]: number[] } = {
  [FontName.BLOW_UP]: [-1.5, 4.5, 0],
  [FontName.LEE_HON_KONG_KAI]: [3, 5, 0],
  [FontName.LEE_HON_TUNG_KAI]: [0.8, 3.2, 0],
  [FontName.PRISON]: [-1.5, 3, 0],
}

const plainPois = cameraData.pois

function createThreeObj(
  gltfs: GLTF[],
  pois: StoryPointMarker[],
  canvasRef: React.RefObject<HTMLElement>
) {
  if (!Array.isArray(gltfs) || gltfs.length === 0) {
    return null
  }

  const width = document.documentElement.clientWidth
  const height = document.documentElement.clientHeight

  /**
   *  Scene
   */
  const scene = new Scene()

  if (Array.isArray(gltfs)) {
    gltfs.forEach((gltf) => {
      gltf.scene.position.set(1, 1, 0)
      gltf.scene.scale.set(0.01, 0.01, 0.01)
      gltf.scene.traverse(function (object) {
        object.castShadow = true
        object.receiveShadow = true
      })
      scene.add(gltf.scene)
    })
  }

  const light = new DirectionalLight(0xffffff, 3)
  light.position.set(5, 8, 10)
  light.castShadow = true
  light.shadow.bias = -0.0001
  light.shadow.mapSize.width = 1024 * 2
  light.shadow.mapSize.height = 1024 * 2
  light.shadow.camera.near = 0.5 // default
  light.shadow.camera.far = 50 // default

  const d = 20
  light.shadow.camera.left = -d
  light.shadow.camera.right = d
  light.shadow.camera.top = d
  light.shadow.camera.bottom = -d
  scene.add(light)

  /**
   *  Camera
   */
  const camera = new PerspectiveCamera(40, width / height, 1, 500)
  //const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  const initPosition = pois[0].position
  camera.position.set(initPosition.x, initPosition.y, initPosition.z)

  /**
   *  Controls
   */
  // Initialize StoryPointControls with poi data
  const rig = new CameraRig(camera, scene)
  const controls = new StoryPointsControls(rig, pois)
  controls.enable()
  controls.goToPOI(0)

  //
  /**
   * Renderer
   */
  const renderer = new WebGLRenderer({
    canvas: canvasRef?.current || undefined,
    antialias: true,
    alpha: true,
  })

  renderer.toneMapping = ACESFilmicToneMapping
  renderer.toneMappingExposure = 1
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = PCFSoftShadowMap
  renderer.setSize(width, height)
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setClearColor(0x000000, 0) // 第二個參數 0 表示透明度

  return {
    scene,
    controls,
    renderer,
    camera,
  }
}

const Container = styled.div`
  position: relative;
  width: 100vw;
  height: 100vh;
  background: linear-gradient(180deg, #dee4e8 10%, #c3d7e6 57%, #96d0f9 100%);

  canvas {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
  }
`

const Mark = styled.div`
  position: absolute;
  width: 20px;
  height: 20px;
  background-color: pink;
`

const CloseBt = styled.div`
  position: absolute;
  width: 16px;
  height: 16px;
  cursor: pointer;
  z-index: 1;
  top: 30px;
  right: 30px;

  &::before,
  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 100%;
    height: 2px;
    background-color: #808080;
  }

  &::before {
    transform: translate(-50%, -50%) rotate(45deg);
  }

  &::after {
    transform: translate(-50%, -50%) rotate(-45deg);
  }
`

const HintCover = styled.div`
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
  z-index: 1;
  background-color: #f1f1f1e5;

  p {
    font-size: 16px;
    line-height: 28px;
    font-weight: 400;
    width: 300px;
    text-align: center;
    margin: 0;
    margin-bottom: 20px;
  }
`

const Bt = styled.div<{ $disabled?: boolean }>`
  width: fit-content;
  padding: 8px 16px;
  border-radius: 40px;
  font-size: 16px;
  line-height: 24px;
  color: #fff;
  cursor: ${(props) => (props.$disabled ? 'default' : 'pointer')};
`

const StartBt = styled(Bt)`
  margin-left: auto;
  margin-right: auto;
  background-color: ${(props) => (props.$disabled ? '#BBB' : '#404040')};
`

const LeaveBt = styled(Bt)`
  margin-top: auto;
  background-color: transparent;
  border: 1px solid #fff;
  position: absolute;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1;
`

export default function HongKongFontProject() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [gltfs, setGltfs] = useState<GLTF[]>([])
  const [markCoordinates, setMarkCooridnates] = useState<{
    [key: string]: { x: number; y: number }
  }>({})
  const [selectedFont, setSelectedFont] = useState('')
  const [toInteractWithModel, setToInteractWithModel] = useState(false)

  const pois: StoryPointMarker[] = useMemo(() => {
    // Create POIs with data exported from the CameraHelper tool
    // (see here for more: https://nytimes.github.io/three-story-controls/#camera-helper)
    // Note: Any method of listing camera position and quaternion will work for StoryPointControls
    return plainPois?.map((poi) => {
      const storyPointMarker: StoryPointMarker = {
        position: new Vector3(...poi.position),
        quaternion: new Quaternion(...poi.quaternion),
        duration: poi.duration,
        ease: poi.ease,
      }
      return storyPointMarker
    })
  }, [])

  const canvasRef = useRef(null)
  const threeObj = useMemo(
    () => createThreeObj(gltfs, pois, canvasRef),
    [gltfs, canvasRef, pois]
  )

  // Handle 3D model animation
  useEffect(() => {
    let requestId: number
    const tick = () => {
      if (threeObj !== null) {
        const { scene, controls, camera, renderer } = threeObj

        // Update controls
        controls.update()

        // Render
        renderer.render(scene, camera)

        // Call tick again on the next frame
        requestId = window.requestAnimationFrame(tick)
      }
    }

    tick()

    // Clean up
    return () => {
      cancelAnimationFrame(requestId)
    }
  }, [threeObj])

  // Handle `StoryPointsControls` `update` event
  useEffect(() => {
    if (threeObj !== null) {
      switch (selectedFont) {
        case FontName.BLOW_UP: {
          threeObj.scene.children.forEach((object) => {
            if (
              object.type === 'Group' &&
              object.userData.name !== FontName.BLOW_UP
            ) {
              object.visible = false
            }
          })
          return threeObj?.controls.goToPOI(1)
        }
        case FontName.LEE_HON_KONG_KAI: {
          threeObj.scene.children.forEach((object) => {
            if (
              object.type === 'Group' &&
              object.userData.name !== FontName.LEE_HON_KONG_KAI
            ) {
              object.visible = false
            }
          })
          return threeObj?.controls.goToPOI(2)
        }
        case FontName.LEE_HON_TUNG_KAI: {
          threeObj.scene.children.forEach((object) => {
            if (
              object.type === 'Group' &&
              object.userData.name !== FontName.LEE_HON_TUNG_KAI
            ) {
              object.visible = false
            }
          })
          return threeObj?.controls.goToPOI(3)
        }
        case FontName.PRISON: {
          threeObj.scene.children.forEach((object) => {
            if (
              object.type === 'Group' &&
              object.userData.name !== FontName.PRISON
            ) {
              object.visible = false
            }
          })
          return threeObj?.controls.goToPOI(4)
        }
        default: {
          return threeObj?.controls.goToPOI(0)
        }
      }
    }
  }, [threeObj, selectedFont])

  // Handle `StoryPointsControls` `update` event
  useEffect(() => {
    if (threeObj !== null) {
      const updateHandler = _.debounce((e) => {
        // Percentage of transition completed, between 0 and 1
        // currentIndex === 0 means the default position
        if (e.progress > 0.9 && e.upcomingIndex === 0) {
          // make all groups visible
          threeObj.scene.children.forEach((object) => {
            if (object.type === 'Group') {
              object.visible = true
            }
          })
        }
      }, 100)

      threeObj.controls.addEventListener('update', updateHandler)

      // Clean up
      return () => {
        threeObj.controls.removeEventListener('update', updateHandler)
      }
    }
  }, [threeObj])

  // Handle canvas size change
  useEffect(() => {
    const updateThreeObj = _.throttle(function () {
      if (!threeObj) {
        return
      }
      const { camera, renderer, scene } = threeObj
      const width = document.documentElement.clientWidth
      const height = document.documentElement.clientHeight

      // Update camera
      camera.aspect = width / height
      camera.updateProjectionMatrix()

      // Update renderer
      renderer.setSize(width, height)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

      const coordinates: { [key: string]: { x: number; y: number } } = {}

      for (const fontName in mark3DPositions) {
        const position = mark3DPositions[fontName]
        const geometry = new BoxGeometry()
        const material = new MeshStandardMaterial({
          color: 0x000000,
          transparent: true,
          opacity: 0,
        })
        const box = new Mesh(geometry, material)
        box.position.set(position[0], position[1], position[2])
        scene.add(box)
        const _coordinates = getCanvasCoordinates(box, camera, renderer)
        coordinates[fontName] = _coordinates
      }
      setMarkCooridnates(coordinates)
    }, 100)

    window.addEventListener('resize', updateThreeObj)
    updateThreeObj()

    // Clean up
    return () => {
      window.removeEventListener('resize', updateThreeObj)
    }
  }, [threeObj])

  const marks = []
  if (selectedFont === '') {
    for (const fontName in markCoordinates) {
      const { x, y } = markCoordinates[fontName]
      marks.push(
        <Mark
          key={fontName}
          style={{ left: x, top: y }}
          onClick={() => {
            setSelectedFont(fontName)
          }}
        />
      )
    }
  }

  const layout = (
    <>
      <BlowUpFont $opacity={selectedFont === FontName.BLOW_UP ? 1 : 0} />
      <LeeHonKongKaiFont
        $opacity={selectedFont === FontName.LEE_HON_KONG_KAI ? 1 : 0}
      />
      <LeeHonTungKaiFont
        $opacity={selectedFont === FontName.LEE_HON_TUNG_KAI ? 1 : 0}
      />
      <PrisonFont
        $opacity={selectedFont === FontName.LEE_HON_TUNG_KAI ? 1 : 0}
      />
    </>
  )

  const onModelsLoaded = (_modelObjs: GTLFModelObject[]) => {
    const gltfs = _modelObjs
      .map((obj) => {
        const data = obj.data
        if (data) {
          data.scene.userData.name = obj.name
        }
        return data
      })
      .filter((data) => data !== null) as GLTF[]
    setGltfs(gltfs)
  }

  const areModelsLoaded = gltfs.length !== 0

  return (
    <Container ref={containerRef}>
      {!toInteractWithModel && (
        <HintCover>
          <p>
            你即將進入3D體驗，移動畫面可探索空間點擊物件可查看街景中字體的故事
          </p>
          <div>
            {!areModelsLoaded && (
              <LoadingProgress
                modelObjs={modelObjs}
                onModelsLoaded={onModelsLoaded}
              />
            )}
            <StartBt
              $disabled={!areModelsLoaded}
              onClick={() => {
                if (!areModelsLoaded) {
                  return
                }

                if (containerRef.current) {
                  containerRef.current?.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start',
                  })
                }
                setToInteractWithModel(true)
                document.body.style.overflow = 'hidden'
              }}
            >
              開始閱讀
            </StartBt>
          </div>
        </HintCover>
      )}
      {toInteractWithModel && selectedFont === '' && (
        <LeaveBt
          onClick={() => {
            const currentScroll = window.scrollY
            const windowHeight = window.innerHeight
            const nextScrollPosition = currentScroll + windowHeight

            window.scrollTo({
              top: nextScrollPosition,
              behavior: 'smooth',
            })

            setToInteractWithModel(false)
            document.body.style.overflow = ''
          }}
        >
          繼續閱讀
        </LeaveBt>
      )}
      {selectedFont !== '' ? (
        <CloseBt
          onClick={() => {
            setSelectedFont('')
          }}
        />
      ) : null}
      {layout}
      <canvas ref={canvasRef}></canvas>
      {marks}
    </Container>
  )
}

// 將 3D 物件的位置轉換成 canvas 上的 x,y 絕對位置
function getCanvasCoordinates(
  object3D: Object3D,
  camera: PerspectiveCamera,
  renderer: WebGLRenderer
) {
  const vector = new Vector3()

  // 將 3D 物件的世界座標轉換成標準化設備座標 (NDC)
  object3D.updateMatrixWorld()
  vector.setFromMatrixPosition(object3D.matrixWorld)
  vector.project(camera)

  // 將標準化設備座標轉換成 2D canvas 座標
  const canvas = renderer.domElement
  const x = ((vector.x * 0.5 + 0.5) * canvas.width) / window.devicePixelRatio
  const y = ((vector.y * -0.5 + 0.5) * canvas.height) / window.devicePixelRatio

  return { x, y }
}
