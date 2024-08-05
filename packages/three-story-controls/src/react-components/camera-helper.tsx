import React, { useCallback, useMemo, useState, useEffect, useRef } from 'react'
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
import { AlignmentEnum, CameraData, POI, PlainPOI, WidthEnum } from './type'
import { LoadingProgress, GTLFModelObject } from './loading-progress'
import { GLTF } from '../loader'
import { ScrollableThreeModel } from './scrollable-model'
import {
  ZoomInButton as _ZoomInButton,
  ZoomOutButton as _ZoomOutButton,
} from './styled'

function createClip(pois: POI[]) {
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

type CameraHelperProps = {
  modelObjs: GTLFModelObject[]
  plainPois?: PlainPOI[]
  onChange?: (arg: CameraData) => void
}

/**
 *  Transfer PlainPOI data structure to POI data structure.
 */
function unserializePlainPOIs(plainPois: PlainPOI[]): POI[] {
  return plainPois.map(({ position, quaternion, ...rest }) => {
    const poi = {
      position: new Vector3(position[0], position[1], position[2]),
      quaternion: new Quaternion(
        quaternion[0],
        quaternion[1],
        quaternion[2],
        quaternion[3]
      ),
      ...rest,
    }
    return poi
  })
}

/**
 *  Transfer POI data structure to PlainPOI data structure.
 */
function serializePOIs(pois: POI[]): PlainPOI[] {
  return pois.map(({ position, quaternion, ...rest }) => {
    const plainPoi = {
      position: position.toArray(),
      quaternion: quaternion.toArray(),
      ...rest,
    }
    return plainPoi
  })
}

export function CameraHelper({
  modelObjs,
  plainPois,
  onChange,
}: CameraHelperProps) {
  const [gltfs, setGltfs] = useState<GLTF[]>([])
  const [pois, setPois] = useState<POI[]>(unserializePlainPOIs(plainPois || []))
  const [fullScreen, setFullScreen] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const scrollerRef = useRef<HTMLDivElement>(null)

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

  const threeObj = useMemo(
    () =>
      createThreeObj({
        gltfs,
        canvasRef,
      }),
    [gltfs, canvasRef]
  )

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
  }, [threeObj, pois])

  const createPoi = () => {
    if (threeObj && canvasRef.current) {
      const { cameraRig, renderer, camera, scene } = threeObj

      // Call render before drawing image.
      // If we do not call `renderer.render`, and then
      // the canvas might not draw the image correctly.
      renderer.render(scene, camera)

      // Draw image
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      canvas.width = 640
      canvas.height = 480
      ctx?.drawImage(canvasRef.current, 0, 0, canvas.width, canvas.height)
      const image = canvas.toDataURL('image/png')

      const poi = {
        ...cameraRig.getWorldCoordinates(),
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
        },
      }
      return poi
    }
  }

  const areModelsLoaded = gltfs.length > 0

  return (
    <Container>
      {fullScreen && (
        <FullScreen ref={scrollerRef}>
          <ScrollableThreeModel
            cameraData={{
              pois: serializePOIs(pois),
              //@ts-ignore we do not need to pass argument to `toJSON` function
              animationClip: createClip(pois)?.toJSON(),
            }}
            scrollerRef={scrollerRef}
            modelObjs={modelObjs}
          />
          <ZoomOutButton
            $hide={!fullScreen}
            onClick={() => {
              setFullScreen(false)
            }}
          />
        </FullScreen>
      )}
      {!areModelsLoaded && (
        <div className="loading-progress">
          <LoadingProgress
            modelObjs={modelObjs}
            onModelsLoaded={onModelsLoaded}
          />
        </div>
      )}
      <canvas ref={canvasRef}></canvas>
      <Panel
        pois={pois}
        onPoisChange={(pois) => {
          setPois(pois)
          const animationClip = createClip(pois)
          onChange?.({
            pois: serializePOIs(pois),
            //@ts-ignore we do not need to pass argument to `toJSON` function
            animationClip: animationClip?.toJSON(),
          })
        }}
        onPoiVisit={(poi) => {
          if (threeObj) {
            const { cameraRig } = threeObj
            cameraRig.flyTo(
              poi.position,
              poi.quaternion,
              poi.duration,
              poi.ease
            )
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
            const animationClip = createClip(newPois)
            onChange?.({
              pois: serializePOIs(newPois),
              //@ts-ignore we do not need to pass argument to `toJSON` function
              animationClip: animationClip?.toJSON(),
            })
            setPois(newPois)
          }
        }}
      />
      <ZoomInButton
        $hide={fullScreen}
        onClick={() => {
          setFullScreen(!fullScreen)
        }}
      />
    </Container>
  )
}

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  position: relative;
  background-color: #f1f1f1;

  > .loading-progress {
    display: flex;
    justify-content: center;
    align-items: center;

    position: absolute;
    width: 100vw;
    height: 100vh;
  }

  > canvas {
    width: 100%;
    height: 100%;
  }
`

const FullScreen = styled.div`
  position: fixed;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: scroll;
  z-index: 1000;
  top: 0;
`

const ZoomOutButton = styled(_ZoomOutButton)<{ $hide: boolean }>`
  position: fixed;
  right: 20px;
  ${(props) => (props.$hide ? 'top: 200vh;' : 'top: 20px;')}
`

const ZoomInButton = styled(_ZoomInButton)<{ $hide: boolean }>`
  position: absolute;
  right: 20px;
  ${(props) => (props.$hide ? 'top: 200vh;' : 'top: 20px;')}
`

/**
 *  Create ThreeJS related objects, such as controls, scene, camera, renderer etc.
 *  Therefore, we could use those objects to manipulate the 3d models.
 */
function createThreeObj({
  gltfs,
  canvasRef,
}: {
  gltfs: GLTF[]
  canvasRef: React.RefObject<HTMLElement>
}) {
  if (!canvasRef.current) {
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
    domElement: canvasRef.current,
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
    canvas: canvasRef.current,
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
      <div key={idx}>
        <h3>{idx + 1}.</h3>
        <Poi>
          <PoiImg src={poi.image} />
          <PoiControls>
            <ControlBt
              onClick={() => {
                // delete the poi
                const newPois = [
                  ...pois.slice(0, idx),
                  ...pois.slice(idx + 1, pois.length),
                ]
                onPoisChange(newPois)
              }}
            >
              x
            </ControlBt>
            <ControlBt
              onClick={() => {
                // fly to the poi position
                onPoiVisit(poi)
              }}
            >
              →
            </ControlBt>
            <ControlBt
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
            >
              ↑
            </ControlBt>
            <ControlBt
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
            >
              ↓
            </ControlBt>
            <ControlBt
              onClick={() => {
                // edit the poi's content
                setEditPoiIdx(idx)

                onPoiEditStart()
              }}
            >
              ✎
            </ControlBt>
          </PoiControls>
        </Poi>
      </div>
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
      <ExpandBt onClick={() => setExpand(!expand)}>
        {expand ? '<' : '>'}
      </ExpandBt>
      <AddBt onClick={onPoiAdd}>+</AddBt>
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
`

const PoiImg = styled.img`
  width: 280px;
`

const PoiControls = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
  justify-content: center;
`

const ControlBt = styled.button`
  padding: 10px;
  width: 30px;
  height: 30px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
`

const ExpandBt = styled(ControlBt)`
  position: absolute;
  bottom: 100px;
  left: 360px;
  width: 40px;
  height: 40px;
  font-size: 30px;
`

const AddBt = styled(ControlBt)`
  position: absolute;
  bottom: 50px;
  left: 360px;
  width: 40px;
  height: 40px;
  font-size: 30px;
`
