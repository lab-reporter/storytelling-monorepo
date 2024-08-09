import React, { useCallback, useState, useEffect, useRef } from 'react'
import debounce from 'lodash/debounce'
import gsap from 'gsap'
import styled from '../styled-components'
import {
  ACESFilmicToneMapping,
  AnimationClip,
  GridHelper,
  PCFSoftShadowMap,
  PerspectiveCamera,
  Quaternion,
  QuaternionKeyframeTrack,
  Scene,
  Vector3,
  VectorKeyframeTrack,
  WebGLRenderer,
} from 'three'
import { CameraRig, FreeMovementControls } from 'three-story-controls'
import { CaptionInput } from './caption-input'
import { AlignmentEnum, CameraData, POI, ThreePOI, WidthEnum } from './type'
import { LoadingProgress, GTLFModelObject } from './loading-progress'
import { GLTF } from '../loader'
import { ScrollableThreeModel } from './scrollable-model'
import {
  ZoomInButton as _ZoomInButton,
  ZoomOutButton as _ZoomOutButton,
  OpenPreviewButton as _OpenPreviewButton,
  ClosePreviewButton as _ClosePreviewButton,
  ExpandButton as _ExpandButton,
  AddButton as _AddButton,
  DeleteButton as _DeleteButton,
  FocusButton as _FocusButton,
  SwitchPrevButton as _SwitchPrevButton,
  SwitchNextButton as _SwitchNextButton,
  HideButton as _HideButton,
  EditButton as _EditButton,
} from './styled'

const _ = {
  debounce,
}

function createClip(pois: ThreePOI[]) {
  if (pois.length > 0) {
    const times = []
    const positionValues: number[] = []
    const quaternionValues: number[] = []
    const tmpPosition = new Vector3()
    const tmpQuaternion = new Quaternion()
    const framesPerPoi = 10

    let tweenStartTime = 0

    for (let i = 0; i < pois.length - 1; i++) {
      const p1 = pois[i]
      const p2 = pois[i + 1]

      const values = {
        px: p1.position.x,
        py: p1.position.y,
        pz: p1.position.z,
        qx: p1.quaternion.x,
        qy: p1.quaternion.y,
        qz: p1.quaternion.z,
        qw: p1.quaternion.w,
        slerpAmount: 0,
      }

      const target = {
        px: p2.position.x,
        py: p2.position.y,
        pz: p2.position.z,
        qx: p2.quaternion.x,
        qy: p2.quaternion.y,
        qz: p2.quaternion.z,
        qw: p2.quaternion.w,
        slerpAmount: 1,
        duration: p2.duration,
        ease: p2.ease,
      }

      const tween = gsap.to(values, target)

      for (let j = 0; j < framesPerPoi; j++) {
        const lerpAmount = p2.duration * (j / framesPerPoi)
        times.push(tweenStartTime + lerpAmount)
        tween.seek(lerpAmount)
        tmpQuaternion.slerpQuaternions(
          p1.quaternion,
          p2.quaternion,
          values.slerpAmount
        )
        tmpPosition.set(values.px, values.py, values.pz)
        tmpQuaternion.toArray(quaternionValues, quaternionValues.length)
        tmpPosition.toArray(positionValues, positionValues.length)
      }
      tweenStartTime += p2.duration
    }
    // add last point
    const last = pois[pois.length - 1]
    last.quaternion.toArray(quaternionValues, quaternionValues.length)
    last.position.toArray(positionValues, positionValues.length)
    times.push(tweenStartTime)
    const animationClip = new AnimationClip(undefined, tweenStartTime, [
      new VectorKeyframeTrack('Translation.position', times, positionValues),
      new QuaternionKeyframeTrack(
        'Rotation.quaternion',
        times,
        quaternionValues
      ),
    ])
    return animationClip
  }
}

type ThreeObj = {
  controls: FreeMovementControls
  cameraRig: CameraRig
  renderer: WebGLRenderer
  camera: PerspectiveCamera
  scene: Scene
}

type CameraHelperProps = {
  modelObjs: GTLFModelObject[]
  pois?: POI[]
  onChange?: (arg: CameraData) => void
}

/**
 *  Transfer POI data structure to ThreePOI data structure.
 */
function transferPOIsToThreePOIs(pois: POI[]): ThreePOI[] {
  return pois.map(({ position, quaternion, ...rest }) => {
    const poi = {
      position: new Vector3(...position),
      quaternion: new Quaternion(...quaternion),
      ...rest,
    }
    return poi
  })
}

export function CameraHelper({
  modelObjs,
  pois: _pois,
  onChange,
}: CameraHelperProps) {
  const [gltfs, setGltfs] = useState<GLTF[]>([])
  const [pois, setPois] = useState<POI[]>(_pois || [])
  const [fullScreen, setFullScreen] = useState(false)
  const [previewMode, setPreviewMode] = useState(false)
  const [threeObj, setThreeObj] = useState<ThreeObj | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const scrollerRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const onModelsLoaded = useCallback((_modelObjs: GTLFModelObject[]) => {
    const gltfs = _modelObjs
      .map((obj) => {
        const gltf = obj.data
        if (gltf && obj.userData) {
          gltf.scene.userData = obj.userData
        }
        return gltf
      })
      .filter((gltf) => gltf !== null) as GLTF[]

    setGltfs(gltfs)
  }, [])

  useEffect(() => {
    const threeObj = createThreeObj({
      gltfs,
      canvas: canvasRef.current,
      domElementForControls: containerRef.current,
    })
    setThreeObj(threeObj)
  }, [gltfs, previewMode, fullScreen])

  // update 3D model
  useEffect(() => {
    let requestId: number

    const render = (t: number) => {
      if (threeObj !== null) {
        const { scene, controls, camera, renderer } = threeObj

        // Update controls
        controls.update(t)

        // Render
        renderer.render(scene, camera)

        // Call render again on the next frame
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
      if (!threeObj) {
        return
      }

      const { camera, renderer } = threeObj
      let width = document.documentElement.clientWidth
      let height = document.documentElement.clientHeight

      if (!fullScreen && containerRef.current) {
        width = containerRef?.current?.clientWidth
        height = containerRef?.current?.clientHeight
      }

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
  }, [threeObj, fullScreen])

  const createPoi = (): POI | undefined => {
    if (threeObj && canvasRef.current) {
      const { cameraRig, renderer, camera, scene } = threeObj

      // Call render before drawing image.
      // If we do not call `renderer.render`, and then
      // the canvas might not draw the image correctly.
      renderer.render(scene, camera)

      // Draw image
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      canvas.width = 550
      canvas.height = 340
      ctx?.drawImage(canvasRef.current, 0, 0, canvas.width, canvas.height)
      const image = canvas.toDataURL('image/png')
      const coord = cameraRig.getWorldCoordinates()

      const poi = {
        position: coord.position.toArray(),
        quaternion: coord.quaternion.toArray(),
        duration: 1,
        ease: 'power1',
        image,
        caption: {
          rawContentState: {
            blocks: [],
            entityMap: {},
          },
          alignment: AlignmentEnum.LEFT,
          width: WidthEnum.NARROW,
          top: 1,
        },
      }
      return poi
    }
  }

  const areModelsLoaded = gltfs.length > 0

  if (previewMode) {
    return (
      <PreviewContainer ref={scrollerRef}>
        <ScrollableThreeModel
          cameraData={{
            pois,
            //@ts-ignore we do not need to pass argument to `toJSON` function
            animationClip: createClip(transferPOIsToThreePOIs(pois))?.toJSON(),
          }}
          scrollerRef={scrollerRef}
          modelObjs={modelObjs}
        />
        <ClosePreviewButton
          $hide={!previewMode}
          onClick={() => {
            setPreviewMode(false)
          }}
        />
      </PreviewContainer>
    )
  }

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
    <Container $fullScreen={fullScreen} ref={containerRef}>
      <canvas ref={canvasRef}></canvas>
      <Panel
        pois={pois}
        onPoisChange={(pois) => {
          setPois(pois)
          const animationClip = createClip(transferPOIsToThreePOIs(pois))
          onChange?.({
            pois,
            //@ts-ignore we do not need to pass argument to `toJSON` function
            animationClip: animationClip?.toJSON(),
          })
        }}
        onPoiVisit={(poi) => {
          if (threeObj) {
            const { cameraRig } = threeObj
            const position = new Vector3(...poi.position)
            const quaternion = new Quaternion(...poi.quaternion)
            cameraRig.flyTo(position, quaternion, poi.duration, poi.ease)
          }
        }}
        onPoiEditStart={() => {
          if (threeObj) {
            const { controls } = threeObj
            controls.disable()
          }
        }}
        onPoiEditFinish={() => {
          if (threeObj) {
            const { controls } = threeObj
            controls.enable()
          }
        }}
        onPoiAdd={() => {
          const poi = createPoi()
          if (poi) {
            const newPois = [...pois, poi]
            const animationClip = createClip(transferPOIsToThreePOIs(newPois))
            onChange?.({
              pois: newPois,
              //@ts-ignore we do not need to pass argument to `toJSON` function
              animationClip: animationClip?.toJSON(),
            })
            setPois(newPois)
          }
        }}
      />
      {Array.isArray(pois) && pois.length > 0 && (
        <OpenPreviewButton
          $hide={previewMode}
          onClick={() => {
            setPreviewMode(true)
          }}
        />
      )}
      {fullScreen ? (
        <ZoomOutButton onClick={() => setFullScreen(false)} />
      ) : (
        <ZoomInButton onClick={() => setFullScreen(true)} />
      )}
    </Container>
  )
}

const LoadingProgressContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  width: 100%;
  height: 100%;
  background-color: #f1f1f1e5;
`

const Container = styled.div<{ $fullScreen: boolean }>`
  background-color: #f1f1f1e5;

  ${({ $fullScreen }) => {
    return $fullScreen
      ? `
      width: 100vw;
      height: 100vh;
      position: fixed;
      top: 0px;
      left: 0px;
    `
      : `
      width: 100%;
      height: 100%;
      position: relative;
    `
  }}

  > canvas {
    width: 100%;
    height: 100%;
  }
`

const PreviewContainer = styled.div`
  position: fixed;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: scroll;
  top: 0;
`

const ClosePreviewButton = styled(_ClosePreviewButton)<{ $hide: boolean }>`
  position: fixed;
  right: 20px;
  ${(props) => (props.$hide ? 'top: 200vh;' : 'top: 20px;')}
`

const OpenPreviewButton = styled(_OpenPreviewButton)<{ $hide: boolean }>`
  position: absolute;
  right: 20px;
  ${(props) => (props.$hide ? 'top: 200vh;' : 'top: 90px;')}
`

const ZoomInButton = styled(_ZoomInButton)`
  position: absolute;
  right: 20px;
  top: 20px;
`

const ZoomOutButton = styled(_ZoomOutButton)`
  position: absolute;
  right: 20px;
  top: 20px;
`

/**
 *  Create ThreeJS related objects, such as controls, scene, camera, renderer etc.
 *  Therefore, we could use those objects to manipulate the 3d models.
 */
function createThreeObj({
  gltfs,
  canvas,
  domElementForControls,
}: {
  gltfs: GLTF[]
  canvas: HTMLCanvasElement | null
  domElementForControls: HTMLDivElement | null
}): ThreeObj | null {
  if (!canvas) {
    return null
  }

  const width = canvas.clientWidth
  const height = canvas.clientHeight

  /**
   *  Scene
   */
  const scene = new Scene()

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
  const camera = new PerspectiveCamera(75, width / height, 0.1, 2000)

  /**
   *  CameraRig
   */
  const cameraRig = new CameraRig(camera, scene)

  /**
   *  Controls
   */
  const controls = new FreeMovementControls(cameraRig, {
    domElement: domElementForControls || undefined,
    keyboardScaleFactor: 0.1,
    wheelScaleFactor: 0.01,
    pointerDampFactor: 0.1,
  })
  controls.enable()

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
   * GridHelper
   */
  const grid = new GridHelper(100, 50)
  grid.position.set(0, -5, 0)
  scene.add(grid)

  return {
    scene,
    renderer,
    camera,
    cameraRig,
    controls,
  }
}

function Panel({
  pois,
  onPoisChange,
  onPoiVisit,
  onPoiAdd,
  onPoiEditStart,
  onPoiEditFinish,
}: {
  pois: POI[]
  onPoisChange: (pois: POI[]) => void
  onPoiVisit: (poi: POI) => void
  onPoiAdd: () => void
  onPoiEditStart: () => void
  onPoiEditFinish: () => void
}) {
  const [expand, setExpand] = useState(true)
  const [editPoiIdx, setEditPoiIdx] = useState(-1)

  const poisJsx = pois.map((poi, idx) => {
    return (
      <Poi key={'poi_' + idx}>
        <PoiImg src={poi.image} />
        <PoiControls>
          <h3>{(idx + 1).toString().padStart(3, '0')}</h3>
          <DeleteButton
            onClick={() => {
              // delete the poi
              const newPois = [
                ...pois.slice(0, idx),
                ...pois.slice(idx + 1, pois.length),
              ]
              onPoisChange(newPois)
            }}
          />
          <SwitchPrevButton
            disabled={idx === 0 || pois.length === 1}
            onClick={() => {
              // switch the target poi with the previous one
              const previousPoi = pois.slice(idx - 1, idx)[0]
              if (previousPoi) {
                const currentPoi = pois.slice(idx, idx + 1)[0]
                const newPois = [
                  ...pois.slice(0, idx - 1),
                  currentPoi,
                  previousPoi,
                  ...pois.slice(idx + 1, pois.length),
                ]
                onPoisChange(newPois)
              }
            }}
          />
          <SwitchNextButton
            disabled={idx === pois.length - 1 || pois.length === 1}
            onClick={() => {
              // switch the target poi with the next one
              const nextPoi = pois.slice(idx + 1, idx + 2)[0]
              if (nextPoi) {
                const currentPoi = pois.slice(idx, idx + 1)[0]
                const newPois = [
                  ...pois.slice(0, idx),
                  nextPoi,
                  currentPoi,
                  ...pois.slice(idx + 2, pois.length),
                ]
                onPoisChange(newPois)
              }
            }}
          />
          <FocusButton
            onClick={() => {
              // fly to the poi position
              onPoiVisit(poi)
            }}
          />
          <EditButton
            focus={editPoiIdx === idx}
            onClick={() => {
              // edit the poi's content
              setEditPoiIdx(idx)

              onPoiEditStart()
            }}
          />
        </PoiControls>
      </Poi>
    )
  })

  const editJsx =
    editPoiIdx > -1 ? (
      <CaptionInput
        isOpen={true}
        onConfirm={(caption) => {
          const newPoi = Object.assign({}, pois[editPoiIdx], {
            caption,
          })

          if (caption.top) {
            newPoi.duration = caption.top
          }

          const newPois = [
            ...pois.slice(0, editPoiIdx),
            newPoi,
            ...pois.slice(editPoiIdx + 1, pois.length),
          ]
          onPoisChange(newPois)
          setEditPoiIdx(-1)
          onPoiEditFinish()
        }}
        onCancel={() => {
          setEditPoiIdx(-1)
          onPoiEditFinish()
        }}
        inputValue={pois[editPoiIdx].caption}
      />
    ) : null

  return (
    <PanelContainer $expand={expand}>
      <Pois>{poisJsx}</Pois>
      {expand ? (
        <HideButton onClick={() => setExpand(false)} />
      ) : (
        <ExpandButton onClick={() => setExpand(true)} />
      )}
      <AddButton onClick={onPoiAdd} />
      {editJsx}
    </PanelContainer>
  )
}

const PanelContainer = styled.div<{ $expand: boolean }>`
  width: 350px;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  background-color: rgba(255, 255, 255, 0.8);
  transform: ${(props) => (props.$expand ? '' : 'translateX(-100%)')};
  transition: transform 0.1s linear;
`

const Pois = styled.div`
  overflow: scroll;
  height: 100%;
  padding: 15px;
`

const Poi = styled.div`
  margin-bottom: 15px;
  display: flex;
  justify-content: space-between;

  border: solid 1px #000;
  border-radius: 6px;
  padding: 10px;

  h3 {
    font-size: 14px;
    font-weigth: bold;
    color: #000;
    margin: 0;
  }
`

const PoiImg = styled.img`
  max-width: 260px;
`

const PoiControls = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
  justify-content: flex-start;
`

const ExpandButton = styled(_ExpandButton)`
  position: absolute;
  bottom: 100px;
  left: 360px;
`

const HideButton = styled(_HideButton)`
  position: absolute;
  bottom: 100px;
  left: 360px;
`

const AddButton = styled(_AddButton)`
  position: absolute;
  bottom: 40px;
  left: 360px;
`

const EditButton = styled(_EditButton)`
  width: 25px;
  height: 25px;
`

const DeleteButton = styled(_DeleteButton)`
  width: 25px;
  height: 25px;
`

const FocusButton = styled(_FocusButton)`
  width: 25px;
  height: 25px;
`

const SwitchPrevButton = styled(_SwitchPrevButton)`
  width: 25px;
  height: 25px;
`

const SwitchNextButton = styled(_SwitchNextButton)`
  width: 25px;
  height: 25px;
`
