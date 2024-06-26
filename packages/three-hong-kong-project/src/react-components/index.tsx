import React, { useCallback, useState, useEffect, useRef, useMemo } from 'react'
import styled from '../styled-components'
import throttle from 'lodash/throttle'
import debounce from 'lodash/debounce'
import {
  ACESFilmicToneMapping,
  AnimationMixer,
  Camera,
  Clock,
  Object3D,
  PCFSoftShadowMap,
  PerspectiveCamera,
  Quaternion,
  Raycaster,
  Scene,
  Vector2,
  Vector3,
  WebGLRenderer,
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
import { useInView } from 'react-intersection-observer'
import {
  CloseBt as _CloseBt,
  HintCover as _HintCover,
  Bt,
  StartBt,
} from './styled'

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
      hasAnimations: false,
    },
  },
  {
    url: `${urlPrefix}/models/lee-hon-kong-kai-font.glb`,
    userData: {
      name: Object3DName.LEE_HON_KONG_KAI,
      castShadow: true,
      intersectable: false,
      hasAnimations: false,
    },
  },
  {
    url: `${urlPrefix}/models/lee-hon-tung-kai-font.glb`,
    userData: {
      name: Object3DName.LEE_HON_TUNG_KAI,
      castShadow: true,
      intersectable: false,
      hasAnimations: false,
    },
  },
  {
    url: `${urlPrefix}/models/blow-up-font.glb`,
    userData: {
      name: Object3DName.BLOW_UP,
      castShadow: true,
      intersectable: false,
      hasAnimations: false,
    },
  },
  {
    url: `${urlPrefix}/models/prison-font.glb`,
    userData: {
      name: Object3DName.PRISON,
      castShadow: true,
      intersectable: false,
      hasAnimations: false,
    },
  },
  {
    url: `${urlPrefix}/models/lee-hon-kong-kai-point.glb`,
    userData: {
      name: Object3DName.LEE_HON_KONG_KAI_POINT,
      castShadow: false,
      intersectable: true,
      hasAnimations: true,
    },
  },
  {
    url: `${urlPrefix}/models/lee-hon-tung-kai-point.glb`,
    userData: {
      name: Object3DName.LEE_HON_TUNG_KAI_POINT,
      castShadow: false,
      intersectable: true,
      hasAnimations: true,
    },
  },
  {
    url: `${urlPrefix}/models/blow-up-point.glb`,
    userData: {
      name: Object3DName.BLOW_UP_POINT,
      castShadow: false,
      intersectable: true,
      hasAnimations: true,
    },
  },
  {
    url: `${urlPrefix}/models/prison-point.glb`,
    userData: {
      name: Object3DName.PRISON_POINT,
      castShadow: false,
      intersectable: true,
      hasAnimations: true,
    },
  },
  {
    url: `${urlPrefix}/models/lights.glb`,
    userData: {
      name: 'lights',
      castShadow: false,
      intersectable: false,
      hasAnimations: false,
    },
  },
]

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

  /**
   *  AnimationMixers
   */
  const mixers: AnimationMixer[] = []

  if (Array.isArray(gltfs)) {
    gltfs.forEach((gltf) => {
      gltf.scene.traverse(function (object) {
        object.castShadow = gltf.scene.userData.castShadow
        object.receiveShadow = true
      })
      scene.add(gltf.scene)

      if (gltf.scene.userData.hasAnimations) {
        const mixer = new AnimationMixer(gltf.scene)
        gltf.animations.forEach((clip) => {
          mixer.clipAction(clip).play()
        })
        mixers.push(mixer)
      }
    })
  }

  /**
   *  Camera
   */
  const camera = new PerspectiveCamera(40, width / height, 1, 500)

  /**
   *  Controls
   */
  // Initialize StoryPointControls with poi data
  const rig = new CameraRig(camera as Camera, scene)
  const storyPointsControls = new StoryPointsControls(rig, pois, {
    useKeyboard: false,
  })
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
    mixers,
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

const HintCover = styled(_HintCover)`
  position: absolute;
  z-index: 1;
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

const CloseBt = styled(_CloseBt)`
  position: absolute;
  top: 100px;
  right: 30px;
  z-index: 1;
`

type PlainPoi = {
  position: number[]
  quaternion: number[]
  duration: number
  ease: string
}

export function HongKongFontProject() {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [gltfs, setGltfs] = useState<GLTF[]>([])
  const [selectedFont, setSelectedFont] = useState('')
  const [toInteractWithModel, setToInteractWithModel] = useState(false)
  const [inViewRef, inView] = useInView({
    rootMargin: '-50% 0% -50% 0%',
  })
  const [plainPois, setPlainPois] = useState<PlainPoi[]>(
    cameraData.desktop.pois
  )
  const clock = new Clock()

  // Use `useCallback` so we don't recreate the function on each render
  const setRefs = useCallback(
    (node: HTMLDivElement) => {
      // Ref's from useRef needs to have the node assigned to `current`
      containerRef.current = node

      // Callback refs, like the one from `useInView`, is a function that takes the node as an argument
      inViewRef(node)
    },
    [inViewRef]
  )

  const pois: StoryPointMarker[] = useMemo(() => {
    // Create POIs with data exported from the CameraHelper tool
    // (see here for more: https://nytimes.github.io/three-story-controls/#camera-helper)
    // Note: Any method of listing camera position and quaternion will work for StoryPointControls
    return plainPois.map((poi) => {
      const storyPointMarker: StoryPointMarker = {
        position: new Vector3(...poi.position),
        quaternion: new Quaternion(...poi.quaternion),
        duration: poi.duration,
        ease: poi.ease,
      }
      return storyPointMarker
    })
  }, [plainPois])

  const canvasRef = useRef(null)
  const threeObj = useMemo(
    () => createThreeObj(gltfs, pois, canvasRef),
    [gltfs, canvasRef, pois]
  )

  // Handle 3D model animation
  useEffect(() => {
    console.log(
      '[react-three-hong-kong-project] is container in the viewport? ',
      inView ? 'yes' : 'no'
    )
    let requestId: number

    const tick = () => {
      if (threeObj !== null && inView) {
        const {
          scene,
          storyPointsControls,
          controls3dof,
          camera,
          renderer,
          mixers,
        } = threeObj

        // Update controls
        storyPointsControls.update()

        const delta = clock.getDelta()

        if (selectedFont === '') {
          controls3dof.update(delta)
        }

        mixers.forEach((mixer) => {
          mixer.update(delta)
        })

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
  }, [threeObj, selectedFont, inView])

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
    const handleResize = _.throttle(function () {
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

      // scroll to container
      if (containerRef.current && toInteractWithModel) {
        containerRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        })
      }

      // change plainPois if needed
      if (width >= 1440) {
        setPlainPois(cameraData.hd.pois)
      } else if (width >= 1024) {
        setPlainPois(cameraData.desktop.pois)
      } else if (width >= 768) {
        setPlainPois(cameraData.tablet.pois)
      }
    }, 100)

    window.addEventListener('resize', handleResize)
    handleResize()

    // Clean up
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [threeObj, toInteractWithModel])

  // handle model point clicked
  useEffect(() => {
    if (!threeObj) {
      return
    }

    const { camera, renderer } = threeObj

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
      clickMouse.x = (e.offsetX / window.innerWidth) * 2 - 1
      clickMouse.y = -(e.offsetY / window.innerHeight) * 2 + 1

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
    const canvas = renderer.domElement

    canvas.addEventListener('click', handleClick)

    return () => {
      canvas.removeEventListener('click', handleClick)
    }
  }, [threeObj, gltfs])

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
    <Container ref={setRefs}>
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
              }}
            >
              開始體驗
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

const defaultStyle = {
  width: '100%',
  position: 'absolute' as const,
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

export function HongKongFontProjectPlaceholder() {
  return (
    <Container>
      <HintCover>
        <p>
          你即將進入3D體驗，移動畫面可探索空間點擊物件可查看街景中字體的故事
        </p>
        <div>
          <StartBt $disabled={true}>開始閱讀</StartBt>
        </div>
      </HintCover>
    </Container>
  )
}
