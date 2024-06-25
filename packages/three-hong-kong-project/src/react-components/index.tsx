import React, { useCallback, useState, useEffect, useRef, useMemo } from 'react'
import styled from '../styled-components'
import throttle from 'lodash/throttle'
import debounce from 'lodash/debounce'
import {
  ACESFilmicToneMapping,
  PerspectiveCamera,
  Raycaster,
  Vector2,
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
  ThreeDOFControls,
} from 'three-story-controls'
import cameraData from './camera-data.json'
import BlowUpFont from './blow-up'
import LeeHonKongKaiFont from './lee-hon-kong-kai'
import LeeHonTungKaiFont from './lee-hon-tung-kai'
import PrisonFont from './prison'
import { LoadingProgress, GTLFModelObject } from './loading-progress'
import { Transition } from 'react-transition-group'
import { urlPrefix } from '../constants'

const duration = 500 // ms

const _ = {
  debounce,
  throttle,
}

enum Object3DName {
  BLOW_UP = '香港北魏',
  LEE_HON_KONG_KAI = '一體成型字',
  LEE_HON_TUNG_KAI = '勾通字',
  PRISON = '監獄體',
  BLOW_UP_POINT = 'blow-up-point',
  LEE_HON_KONG_KAI_POINT = 'lee-hon-kong-kai-point',
  LEE_HON_TUNG_KAI_POINT = 'lee-hon-tung-kai-point',
  PRISON_POINT = 'prison-point',
  MAJOR_SCENE = 'major-scene',
  LIGHTS = 'lights',
}

const modelObjs: GTLFModelObject[] = [
  {
    url: `${urlPrefix}/models/major-scene.glb`,
    userData: {
      name: 'major-scene',
      castShadow: true,
      intersectable: false,
    },
  },
  {
    url: `${urlPrefix}/models/lee-hon-kong-kai-font.glb`,
    userData: {
      name: Object3DName.LEE_HON_KONG_KAI,
      castShadow: true,
      intersectable: false,
    },
  },
  {
    url: `${urlPrefix}/models/lee-hon-tung-kai-font.glb`,
    userData: {
      name: Object3DName.LEE_HON_TUNG_KAI,
      castShadow: true,
      intersectable: false,
    },
  },
  {
    url: `${urlPrefix}/models/blow-up-font.glb`,
    userData: {
      name: Object3DName.BLOW_UP,
      castShadow: true,
      intersectable: false,
    },
  },
  {
    url: `${urlPrefix}/models/prison-font.glb`,
    userData: {
      name: Object3DName.PRISON,
      castShadow: true,
      intersectable: false,
    },
  },
  {
    url: `${urlPrefix}/models/lee-hon-kong-kai-point.glb`,
    userData: {
      name: Object3DName.LEE_HON_KONG_KAI_POINT,
      castShadow: false,
      intersectable: true,
    },
  },
  {
    url: `${urlPrefix}/models/lee-hon-tung-kai-point.glb`,
    userData: {
      name: Object3DName.LEE_HON_TUNG_KAI_POINT,
      castShadow: false,
      intersectable: true,
    },
  },
  {
    url: `${urlPrefix}/models/blow-up-point.glb`,
    userData: {
      name: Object3DName.BLOW_UP_POINT,
      castShadow: false,
      intersectable: true,
    },
  },
  {
    url: `${urlPrefix}/models/prison-point.glb`,
    userData: {
      name: Object3DName.PRISON_POINT,
      castShadow: false,
      intersectable: true,
    },
  },
  {
    url: `${urlPrefix}/models/lights.glb`,
    userData: {
      name: 'lights',
      castShadow: false,
      intersectable: false,
    },
  },
]

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
      gltf.scene.traverse(function (object) {
        object.castShadow = gltf.userData.castShadow
        object.receiveShadow = true
      })
      scene.add(gltf.scene)
    })
  }

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
  const storyPointsControls = new StoryPointsControls(rig, pois)
  storyPointsControls.enable()
  storyPointsControls.goToPOI(0)

  const controls3dof = new ThreeDOFControls(rig, {
    panFactor: Math.PI / 20,
    tiltFactor: Math.PI / 4,
    //truckFactor: 10,
    //pedestalFactor: 10,
  })
  controls3dof.enable()

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
    storyPointsControls,
    controls3dof,
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
  flex-direction: column;
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
  const [selectedFont, setSelectedFont] = useState('')
  const [toInteractWithModel, setToInteractWithModel] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

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
        const { scene, storyPointsControls, controls3dof, camera, renderer } =
          threeObj

        // Update controls
        storyPointsControls.update()

        if (selectedFont === '' && !isMobile) {
          controls3dof.update(Date.now())
        }

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
  }, [threeObj, selectedFont, isMobile])

  // Handle `StoryPointsControls` `update` event
  useEffect(() => {
    if (threeObj !== null) {
      threeObj.scene.children.forEach((object) => {
        if (
          object.type === 'Group' &&
          object.userData.name !== selectedFont &&
          object.userData.name !== 'lights'
        ) {
          object.visible = false
        }
      })
      switch (selectedFont) {
        case Object3DName.BLOW_UP: {
          return threeObj?.storyPointsControls.goToPOI(1)
        }
        case Object3DName.LEE_HON_KONG_KAI: {
          return threeObj?.storyPointsControls.goToPOI(2)
        }
        case Object3DName.LEE_HON_TUNG_KAI: {
          return threeObj?.storyPointsControls.goToPOI(3)
        }
        case Object3DName.PRISON: {
          return threeObj?.storyPointsControls.goToPOI(4)
        }
        case '':
        default: {
          threeObj.scene.children.forEach((object) => {
            if (object.type === 'Group') {
              object.visible = true
            }
          })
          threeObj?.storyPointsControls.goToPOI(0)
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

      threeObj.storyPointsControls.addEventListener('update', updateHandler)

      // Clean up
      return () => {
        threeObj.storyPointsControls.removeEventListener(
          'update',
          updateHandler
        )
      }
    }
  }, [threeObj])

  // Handle canvas size change
  useEffect(() => {
    const updateThreeObj = _.throttle(function () {
      if (!threeObj) {
        return
      }
      const { camera, renderer } = threeObj
      const width = document.documentElement.clientWidth
      const height = document.documentElement.clientHeight

      // Update camera
      camera.aspect = width / height
      camera.updateProjectionMatrix()

      // Update renderer
      renderer.setSize(width, height)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

      if (width < 768) {
        setIsMobile(true)
      } else {
        setIsMobile(false)
      }
    }, 100)

    window.addEventListener('resize', updateThreeObj)
    updateThreeObj()

    // Clean up
    return () => {
      window.removeEventListener('resize', updateThreeObj)
    }
  }, [threeObj])

  useEffect(() => {
    if (!threeObj) {
      return
    }

    const { camera } = threeObj

    const intersect = (pos: Vector2) => {
      raycaster.setFromCamera(pos, camera)
      const objects = gltfs
        .filter((gltf) => gltf.scene.userData.intersectable)
        .map((gltf) => gltf.scene)
      return raycaster.intersectObjects(objects)
    }

    const raycaster = new Raycaster()
    const clickMouse = new Vector2()

    const handleClick = (e: MouseEvent) => {
      clickMouse.x = (e.clientX / window.innerWidth) * 2 - 1
      clickMouse.y = -(e.clientY / window.innerHeight) * 2 + 1

      const found = intersect(clickMouse)

      if (found.length > 0) {
        const rootGroup = getRootParent(found[0].object)
        const name = rootGroup.userData.name
        switch (name) {
          case Object3DName.BLOW_UP_POINT: {
            setSelectedFont(Object3DName.BLOW_UP)
            break
          }
          case Object3DName.LEE_HON_KONG_KAI_POINT: {
            setSelectedFont(Object3DName.LEE_HON_KONG_KAI)
            break
          }
          case Object3DName.LEE_HON_TUNG_KAI_POINT: {
            setSelectedFont(Object3DName.LEE_HON_TUNG_KAI)
            break
          }
          case Object3DName.PRISON_POINT: {
            setSelectedFont(Object3DName.PRISON)
            break
          }
        }
      }
    }

    window.addEventListener('click', handleClick)

    return () => {
      window.removeEventListener('click', handleClick)
    }
  }, [threeObj, gltfs, isMobile])

  const fontLayout = (
    <>
      <FadedFont in={selectedFont === Object3DName.BLOW_UP}>
        <BlowUpFont />
      </FadedFont>
      <FadedFont in={selectedFont === Object3DName.LEE_HON_KONG_KAI}>
        <LeeHonKongKaiFont />
      </FadedFont>
      <FadedFont in={selectedFont === Object3DName.LEE_HON_TUNG_KAI}>
        <LeeHonTungKaiFont />
      </FadedFont>
      <FadedFont in={selectedFont === Object3DName.PRISON}>
        <PrisonFont />
      </FadedFont>
    </>
  )

  const onModelsLoaded = useCallback((_modelObjs: GTLFModelObject[]) => {
    const gltfs = _modelObjs
      .map((obj) => {
        const data = obj.data
        if (data) {
          data.scene.userData = obj.userData
        }
        return data
      })
      .filter((data) => data !== null) as GLTF[]
    setGltfs(gltfs)
  }, [])

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

                if (!isMobile) {
                  document.body.style.overflow = 'hidden'
                }
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
      <canvas ref={canvasRef}></canvas>
      {fontLayout}
    </Container>
  )
}

function getRootParent(object: Object3D) {
  while (object.parent && object.parent.type !== 'Scene') {
    object = object.parent
  }
  return object
}

const defaultStyle: React.CSSProperties = {
  width: '100%',
  position: 'absolute',
  left: 0,
  top: 0,
  transition: `opacity ${duration}ms ease-in-out`,
  opacity: 0,
}

const transitionStyles = {
  entering: { opacity: 1 },
  entered: { opacity: 1 },
  exiting: { opacity: 0 },
  exited: { opacity: 0 },
  unmounted: {},
}

function FadedFont({
  in: inProp,
  children,
}: {
  in: boolean
  children: React.ReactNode
}) {
  const nodeRef = useRef(null)
  return (
    <Transition nodeRef={nodeRef} in={inProp} timeout={duration} unmountOnExit>
      {(state) => (
        <div
          ref={nodeRef}
          style={{
            ...defaultStyle,
            ...transitionStyles[state],
            transition: inProp ? `opacity ${duration}ms ease-in-out` : '',
          }}
        >
          {children}
        </div>
      )}
    </Transition>
  )
}
