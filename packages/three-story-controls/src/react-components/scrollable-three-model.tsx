import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import debounce from 'lodash/debounce'
import styled from '../styled-components'
import {
  ACESFilmicToneMapping,
  AnimationClip,
  Color,
  PCFSoftShadowMap,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
} from 'three'
import { CameraData, GTLFModelObject, POI, GLTF } from './type'
import { CameraRig, ThreeDOFControls } from 'three-story-controls'
import { DraftRenderer } from '../draft-renderer/index'
import { LoadingProgress } from './loading-progress'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'
import { gsap } from 'gsap/dist/gsap'
import { mediaQuery } from '../utils/media-query'
import { useGSAP } from '@gsap/react'

// lodash
const _ = {
  debounce,
}

gsap.registerPlugin(ScrollTrigger)

function Sections({
  pois,
  durationPer100vh,
  windowObject,
}: {
  pois: POI[]
  durationPer100vh: number
  windowObject: {
    innerHeight: number
  }
}) {
  let accumlatedDuration = 0
  const jsx = pois.map((poi, idx) => {
    const caption = poi.caption

    // No content to render
    if (caption.rawContentState.blocks.length === 0) {
      return null
    }

    const duration = idx === 0 ? 0 : poi.duration // the first poi's duration should be 0 since it should be rendered in the very beginning.
    accumlatedDuration = accumlatedDuration + duration
    const _top = Math.round((accumlatedDuration / durationPer100vh) * 100) / 100
    const top = `${_top * windowObject.innerHeight}px`

    // @TODO make `darkMode` as a param
    const darkMode = true
    return (
      <Section
        className="section"
        data-section-narrow-width={caption.width !== 'wide'}
        data-section-dark-mode={darkMode}
        data-section-alignment={caption.alignment ?? 'left'}
        key={`section-${idx}`}
        style={{
          top,
        }}
      >
        <DraftRenderer
          darkMode={darkMode}
          rawContentState={caption.rawContentState}
        />
      </Section>
    )
  })
  return <>{jsx}</>
}

const Section = styled.div`
  position: absolute;
  padding: 24px 16px;

  &[data-section-dark-mode='false'] {
    background-color: rgba(255, 255, 255, 0.5);
  }

  &[data-section-dark-mode='true'] {
    background-color: rgba(0, 0, 0, 0.5);
  }

  ${mediaQuery.mobileOnly} {
    // horizontally center
    left: 0;
    right: 0;
    margin-left: auto;
    margin-right: auto;

    &[data-section-narrow-width='true'] {
      width: 75vw;
    }

    &[data-section-narrow-width='false'] {
      width: 100vw;
      max-width: 720px;
    }
  }

  ${mediaQuery.tabletAbove} {
    &[data-section-narrow-width='true'] {
      width: 320px;
    }

    &[data-section-narrow-width='false'] {
      width: 46vw;
      max-width: 720px;
    }

    &[data-section-alignment='left'] {
      left: 4vw;
    }
    &[data-section-alignment='right'] {
      right: 4vw;
    }
    &[data-section-alignment='center'] {
      // horizontally center
      left: 0;
      right: 0;
      margin-left: auto;
      margin-right: auto;
    }
  }
`

type ThreeObj = {
  controls: ThreeDOFControls
  cameraRig: CameraRig
  renderer: WebGLRenderer
  camera: PerspectiveCamera
  scene: Scene
}

export type ScrollableThreeModelProps = CameraData & {
  debugMode?: boolean
  modelObjs: GTLFModelObject[]
  scrollerRef?: React.RefObject<HTMLElement>
  durationPer100vh?: number
}

function ScrollableThreeModel({
  pois,
  animationClip: animationClipJSON,
  debugMode,
  modelObjs,
  scrollerRef,
  durationPer100vh = 1,
}: ScrollableThreeModelProps) {
  const [windowObject, setWindowObject] = useState({
    innerWidth: 0,
    innerHeight: 0,
  })
  const scrollTriggerInstance = useRef<ScrollTrigger | null>(null)
  const scrollTriggerRef = useRef<HTMLDivElement>(null)
  const [gltfs, setGltfs] = useState<GLTF[]>([])
  const [threeObj, setThreeObj] = useState<ThreeObj | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const animationClip = useMemo(
    () => AnimationClip.parse(animationClipJSON),
    [animationClipJSON]
  )

  // We use duration to calculate sections' height.
  // If the last poi has content, the content might overflow the sections block.
  // Therefore, we extend the sections' height by a viewport height.
  const duration = animationClip?.duration + durationPer100vh

  const _sectionsHeight = Math.round((duration / durationPer100vh) * 100) / 100
  const sectionsHeight = `${_sectionsHeight * windowObject.innerHeight}px`

  const onModelsLoaded = useCallback((_modelObjs: GTLFModelObject[]) => {
    const gltfs = _modelObjs
      .map((obj) => {
        const data = obj.data
        if (data && obj.userData) {
          data.scene.userData = obj.userData
        }
        return data
      })
      .filter((data) => data !== null) as GLTF[]

    setGltfs(gltfs)
  }, [])

  const areModelsLoaded = gltfs.length !== 0

  // use gsap ScrollTrigger to check if
  // Sections are in the viewport or not,
  // and if the Sections are in the viewport,
  // use the scroll progress to manipulate the 3D model animation.
  useGSAP(
    () => {
      if (
        !scrollTriggerRef.current ||
        !threeObj ||
        windowObject.innerHeight === 0
      ) {
        return
      }

      if (scrollTriggerInstance.current) {
        // kill old instance to avoid getting stale dependencies
        scrollTriggerInstance.current.kill()
      }

      const { cameraRig } = threeObj

      scrollTriggerInstance.current = ScrollTrigger.create({
        markers: debugMode,
        trigger: scrollTriggerRef.current,
        start: 'top 50%',
        end: 'bottom 50%',
        scroller: scrollerRef?.current || window,
        onUpdate: ({ progress }: { progress: number }) => {
          // update the animation
          cameraRig.setAnimationPercentage(progress)
        },
      })

      return () => {
        if (scrollTriggerInstance.current) {
          scrollTriggerInstance.current.kill()
        }
      }
    },
    {
      scope: scrollTriggerRef,
      dependencies: [debugMode, windowObject, scrollerRef, threeObj],
    }
  )

  useEffect(() => {
    const threeObj = createThreeObj({
      gltfs,
      canvas: canvasRef.current,
      animationClip,
    })
    setThreeObj(threeObj)
  }, [gltfs, animationClip])

  // Handle 3D model rendering
  useEffect(() => {
    let requestId: number

    const render = (t: number) => {
      if (threeObj !== null) {
        const { controls, scene, camera, renderer } = threeObj

        controls.update(t)

        // Render
        renderer.render(scene, camera)

        // Call tick again on the next frame
        requestId = window.requestAnimationFrame(render)
      }
    }

    render(Date.now())

    // Clean up
    return () => {
      cancelAnimationFrame(requestId)
    }
  }, [threeObj])

  // Handle resize
  useEffect(() => {
    const handleResize = _.debounce(() => {
      if (window.innerWidth !== windowObject.innerWidth) {
        setWindowObject({
          innerWidth: window.innerWidth,
          innerHeight: window.innerHeight,
        })
      }

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
    }, 300)

    window.addEventListener('resize', handleResize)
    handleResize()

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [windowObject, threeObj])

  if (!areModelsLoaded) {
    return (
      <LoadingProgressContainer>
        <LoadingProgress
          modelObjs={modelObjs}
          onModelsLoaded={onModelsLoaded}
        />
      </LoadingProgressContainer>
    )
  }

  return (
    <Container>
      <CanvasContainer>
        <canvas ref={canvasRef}></canvas>
      </CanvasContainer>
      {windowObject.innerHeight !== 0 && Array.isArray(pois) && (
        <Content ref={scrollTriggerRef} style={{ height: sectionsHeight }}>
          <Sections
            pois={pois || []}
            durationPer100vh={durationPer100vh}
            windowObject={windowObject}
          />
        </Content>
      )}
    </Container>
  )
}

const LoadingProgressContainer = styled.div`
  width: 100vw;
  height: 100vh;

  display: flex;
  justify-content: center;
  align-items: center;

  background-color: #f1f1f1e5;
`

const Container = styled.div`
  position: relative;
  width: fit-content;
  height: fit-content;
`

const CanvasContainer = styled.div`
  width: 100vw;
  height: 100vh;
  position: sticky;
  top: 0;
  touch-action: none;
  z-index: -1;
`

const Content = styled.div`
  position: relative;
`

function createThreeObj({
  gltfs,
  canvas,
  animationClip,
}: {
  gltfs: GLTF[]
  canvas: HTMLCanvasElement | null
  animationClip: AnimationClip
}) {
  if (!canvas) {
    return null
  }

  const width = document.documentElement.clientWidth
  const height = document.documentElement.clientHeight

  /**
   *  Scene
   */
  const scene = new Scene()
  scene.background = new Color(0x1d1d1d)

  if (Array.isArray(gltfs)) {
    gltfs.forEach((gltf) => {
      gltf.scene.traverse(function (object) {
        object.castShadow = gltf.scene.userData.castShadow
        object.receiveShadow = gltf.scene.userData.receiveShadow
      })
      scene.add(gltf.scene)
    })
  }

  /**
   *  Camera
   */
  const camera = new PerspectiveCamera(45, width / height, 0.1, 10000)
  // camera.lookAt(0, 0, 0)

  /**
   *  CameraRig
   */
  const cameraRig = new CameraRig(camera, scene)
  cameraRig.setAnimationClip(animationClip)
  cameraRig.setAnimationTime(0)

  //
  /**
   * Renderer
   */
  const renderer = new WebGLRenderer({
    canvas: canvas,
  })

  renderer.toneMapping = ACESFilmicToneMapping
  renderer.toneMappingExposure = 1
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = PCFSoftShadowMap

  renderer.setSize(width, height)
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setClearColor(0x000000) // 第二個參數 0 表示透明度

  /**
   *  Controls
   */
  const controls = new ThreeDOFControls(cameraRig, {
    panFactor: Math.PI / 10,
    tiltFactor: Math.PI / 10,
    truckFactor: 0,
    pedestalFactor: 0,
  })
  controls.enable()

  return {
    controls,
    scene,
    renderer,
    camera,
    cameraRig,
  }
}

export { ScrollableThreeModel }
