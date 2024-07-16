import React, { useState, useEffect, useRef } from 'react'
import styled from '../styled-components'
import {
  ConeGeometry,
  MeshPhongMaterial,
  Mesh,
  ACESFilmicToneMapping,
  // AnimationClip,
  Camera,
  GridHelper,
  PCFSoftShadowMap,
  PerspectiveCamera,
  Quaternion,
  // QuaternionKeyframeTrack,
  Scene,
  Vector3,
  // VectorKeyframeTrack,
  WebGLRenderer,
} from 'three'
import { CameraRig, FreeMovementControls } from 'three-story-controls'

type POI = {
  position: Vector3
  quaternion: Quaternion
  duration: number
  ease: string
  image?: string
}

//function createClip(pois: POI[]) {
//  if (pois.length > 0) {
//    const times = []
//    const positionValues = []
//    const quaternionValues = []
//    const tmpPosition = new Vector3()
//    const tmpQuaternion = new Quaternion()
//    const framesPerPoi = 10

//    let tweenStartTime = 0

//    // transform imported arrays to quaternions and vector3 when loading a camera file
//    if (!this.pois[0].quaternion.isQuaternion && !this.pois[0].position.isVector3) {
//      for (let i = 0; i < this.pois.length; i++) {
//        const p = this.pois[i]
//        p.quaternion = new Quaternion(p.quaternion[0], p.quaternion[1], p.quaternion[2], p.quaternion[3])
//        p.position = new Vector3(p.position[0], p.position[1], p.position[2])
//      }
//    }

//    for (let i = 0; i < this.pois.length - 1; i++) {
//      const p1 = this.pois[i]
//      const p2 = this.pois[i + 1]

//      const values = {
//        px: p1.position.x,
//        py: p1.position.y,
//        pz: p1.position.z,
//        qx: p1.quaternion.x,
//        qy: p1.quaternion.y,
//        qz: p1.quaternion.z,
//        qw: p1.quaternion.w,
//        slerpAmount: 0,
//      }

//      const target = {
//        px: p2.position.x,
//        py: p2.position.y,
//        pz: p2.position.z,
//        qx: p2.quaternion.x,
//        qy: p2.quaternion.y,
//        qz: p2.quaternion.z,
//        qw: p2.quaternion.w,
//        slerpAmount: 1,
//        duration: p2.duration,
//        ease: p2.ease,
//      }

//      const tween = gsap.to(values, target)

//      for (let j = 0; j < framesPerPoi; j++) {
//        const lerpAmount = p2.duration * (j / framesPerPoi)
//        times.push(tweenStartTime + lerpAmount)
//        tween.seek(lerpAmount)
//        if (this.useSlerp) {
//          tmpQuaternion.slerpQuaternions(p1.quaternion, p2.quaternion, values.slerpAmount)
//        } else {
//          tmpQuaternion.set(values.qx, values.qy, values.qz, values.qw)
//        }
//        tmpPosition.set(values.px, values.py, values.pz)
//        tmpQuaternion.toArray(quaternionValues, quaternionValues.length)
//        tmpPosition.toArray(positionValues, positionValues.length)
//      }
//      tweenStartTime += p2.duration
//    }
//    // add last point
//    const last = this.pois[this.pois.length - 1]
//    last.quaternion.toArray(quaternionValues, quaternionValues.length)
//    last.position.toArray(positionValues, positionValues.length)
//    times.push(tweenStartTime)
//    this.animationClip = new AnimationClip(null, tweenStartTime, [
//      new VectorKeyframeTrack('Translation.position', times, positionValues),
//      new QuaternionKeyframeTrack('Rotation.quaternion', times, quaternionValues),
//    ])
//    this.rig.setAnimationClip(this.animationClip)
//  }
//}

type CameraHelperProps = {
  scene?: Scene
}

type ThreeObj = {
  camera: Camera
  cameraRig: CameraRig
  controls: FreeMovementControls
  renderer: WebGLRenderer
  scene: Scene
}

export function CameraHelper({ scene }: CameraHelperProps) {
  const [threeObj, setThreeObj] = useState<ThreeObj | null>(null)
  const [pois, setPois] = useState<POI[]>([])
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const _scene = scene ?? new Scene()
    const threeObj = createThreeObj(_scene, canvasRef)
    console.log(threeObj)
    setThreeObj(threeObj)
  }, [scene])

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

        // Call tick again on the next frame
        requestId = window.requestAnimationFrame(render)
      }
    }

    render(Date.now())

    // Clean up
    return () => {
      cancelAnimationFrame(requestId)
    }
  }, [threeObj, pois])

  const addPoi = () => {
    if (threeObj) {
      const { cameraRig, renderer, camera, scene } = threeObj

      // Call render before drawing image.
      // If we do not call `renderer.render`, and then
      // the canvas might not draw the image correctly.
      renderer.render(scene, camera)

      // Draw image
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')!
      canvas.width = 640
      canvas.height = 480
      ctx.drawImage(canvasRef.current!, 0, 0, canvas.width, canvas.height)
      const image = canvas.toDataURL('image/png')

      const poi = {
        ...cameraRig.getWorldCoordinates(),
        duration: 1,
        ease: 'power1',
        image,
      }
      setPois([...pois, poi])
    }
  }

  return (
    <Container>
      <canvas id="three" ref={canvasRef}></canvas>
      <Panel
        pois={pois}
        onPoisChange={(pois) => {
          setPois(pois)
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
        onPoiAdd={addPoi}
      />
    </Container>
  )
}

const Container = styled.div`
  width: 100%;
  height: 100%;
  position: relative;

  > canvas {
    width: 100%;
    height: 100%;
  }
`

function createThreeObj(scene: Scene, canvasRef: React.RefObject<HTMLElement>) {
  if (!canvasRef.current) {
    return null
  }

  const width = document.documentElement.clientWidth
  const height = document.documentElement.clientHeight

  /**
   *  Camera
   */
  const camera = new PerspectiveCamera(75, width / height, 0.1, 2000)
  camera.position.set(10, 10, 10)
  // camera.lookAt(0, 0, 0)

  /**
   *  CameraRig
   */
  const cameraRig = new CameraRig(camera, scene)

  /**
   *  Controls
   */
  const controls = new FreeMovementControls(cameraRig, {
    domElement: canvasRef.current!,
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

  const coneGeo = new ConeGeometry(3, 10, 4)
  const mesh = new Mesh(coneGeo, new MeshPhongMaterial({ color: 0x000000 }))
  mesh.position.copy(new Vector3(0, 0, -30))
  scene.add(mesh)

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
}: {
  pois: POI[]
  onPoisChange: (pois: POI[]) => void
  onPoiVisit: (poi: POI) => void
  onPoiAdd: () => void
}) {
  const [expand, setExpand] = useState(true)

  const poisJsx = pois.map((poi, idx) => {
    return (
      <div key={idx}>
        <h3>{idx + 1}.</h3>
        <Poi>
          <PoiImg src={poi.image} />
          <PoiControls>
            <ControlBt
              onClick={() => {
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
                onPoiVisit(poi)
              }}
            >
              →
            </ControlBt>
            <ControlBt
              onClick={() => {
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
            <ControlBt>✎</ControlBt>
          </PoiControls>
        </Poi>
      </div>
    )
  })

  return (
    <PanelContainer $expand={expand}>
      <Pois>{poisJsx}</Pois>
      <ExpandBt onClick={() => setExpand(!expand)}>
        {expand ? '<' : '>'}
      </ExpandBt>
      <AddBt onClick={onPoiAdd}>+</AddBt>
    </PanelContainer>
  )
}

const PanelContainer = styled.div<{ $expand: boolean }>`
  width: 350px;
  height: 100%;
  position: fixed;
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
