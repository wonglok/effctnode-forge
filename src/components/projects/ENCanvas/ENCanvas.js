import { EffectNodeRuntime } from '@/effectnode/component/EffectNodeRuntime'
import { ConnectCameraControls } from '@/helpers/ConnectCameraControls'
import { ConnectKeyboard } from '@/helpers/ConnectKeyboard'
import { ConnectSimulation } from '@/helpers/ConnectSimulation'
import { FloorFlat } from '@/helpers/FloorFlat'
import { FloorObject } from '@/helpers/FloorObject'
import { Player } from '@/helpers/Player'
import { useGLBEditor } from '@/helpers/useGLBEditor'
import {
  Box,
  Environment,
  OrbitControls,
  Select,
  TransformControls,
} from '@react-three/drei'
import { Canvas, useThree } from '@react-three/fiber'
// import { Bloom, EffectComposer, SSR } from '@react-three/postprocessing'
import { useEffect, useRef, useState } from 'react'
// import { UseObjectAsPlayer } from '../UseObjectAsPlayer/UseObjectAsPlayer'
import { ENTopBarr } from './ENTopBar'
import { PostProcCallers } from '@/effectnode/component/PostProcCallers'
import { EnvOutlet } from './EnvOutlet'
// import { useEffectNode } from '@/effectnode/store/useEffectNode'
import { AdaptTC } from './Transform/AdaptTC'
// import { sRGBEncoding } from 'three'
import { ConfigCanvas } from '@/helpers/ConfigCanvas'
import { useEffectNode } from '@/effectnode/store/useEffectNode'

//

export function ENCanvas() {
  //
  return (
    <div className='relative w-full h-full'>
      <Canvas {...ConfigCanvas} className='w-full h-full'>
        <Content></Content>
        <PostProcCallers></PostProcCallers>
      </Canvas>
      <ENTopBarr></ENTopBarr>
    </div>
  )
}

function Content() {
  let setScreenPass = useEffectNode((s) => s.setScreenPass)
  let activeGLBRawObject = useGLBEditor((s) => s.activeGLBRawObject)
  let activeGLBRuntimeObject = useGLBEditor((s) => s.activeGLBRuntimeObject)
  let editorNavigationMode = useGLBEditor((s) => s.editorNavigationMode)
  let setSelection = useGLBEditor((s) => s.setSelection)
  let activeSceneSelection = useGLBEditor((s) => s.activeSceneSelection)
  let setOrbit = useGLBEditor((s) => s.setOrbit)

  // let [screenPass, setScreenPass] = useState(null)
  let [_, reload] = useState(0)
  useEffect(() => {
    window.addEventListener('reload-node', () => {
      reload((s) => s + 1)
    })
  }, [])

  return (
    <group>
      {/* <color attach={'background'} args={['#cceeff']}></color> */}

      {/*  */}
      <AdaptTC
        onScreenPass={(v) => {
          setScreenPass(v)
        }}
        node={activeGLBRuntimeObject.scene}
      ></AdaptTC>

      {activeSceneSelection && (
        <boxHelper
          key={activeSceneSelection.uuid}
          args={[activeSceneSelection, 0xff0000]}
        ></boxHelper>
      )}

      {activeGLBRuntimeObject?.scene && (
        <>
          <Select
            onChange={(v) => {
              let first = v[0]
              if (first) {
                setSelection(first)
              }
            }}
          >
            {/*  */}
            <primitive
              key={activeGLBRuntimeObject.scene.uuid + 'display'}
              object={activeGLBRuntimeObject.scene}
            ></primitive>
            {/*  */}
          </Select>
          <EffectNodeRuntime
            glbObject={activeGLBRuntimeObject}
            glbRaw={activeGLBRawObject}
          ></EffectNodeRuntime>
          {/*  */}
          {/*  */}
        </>
      )}

      {editorNavigationMode === 'floor' && (
        <>
          <gridHelper args={[500, 500]}></gridHelper>
          <ConnectKeyboard></ConnectKeyboard>
          <ConnectCameraControls></ConnectCameraControls>
          <ConnectSimulation></ConnectSimulation>
          <Player></Player>
          <FloorFlat
            key={activeGLBRuntimeObject.uuid + 'floorflat'}
            name={activeGLBRuntimeObject.uuid}
          ></FloorFlat>
        </>
      )}

      {editorNavigationMode === 'meta' && activeGLBRuntimeObject.scene && (
        <>
          <ConnectKeyboard></ConnectKeyboard>
          <ConnectCameraControls></ConnectCameraControls>
          <ConnectSimulation></ConnectSimulation>
          <Player></Player>
          <FloorObject
            key={activeGLBRuntimeObject.uuid + 'floorobj'}
            object={activeGLBRuntimeObject.scene}
          ></FloorObject>
        </>
      )}

      {editorNavigationMode === 'orbit' && (
        <>
          <OrbitControls
            ref={(ref) => {
              setOrbit(ref)
            }}
          ></OrbitControls>
          {/* <CamTrack activeSceneSelection={activeSceneSelection}></CamTrack> */}
        </>
      )}

      <EnvOutlet></EnvOutlet>
    </group>
  )
}

// function CamTrack({ activeSceneSelection }) {
//   let orbit = useGLBEditor((s) => s.orbit)
//   let camera = useThree((s) => s.camera)
//   useEffect(() => {
//     if (activeSceneSelection && orbit) {
//       activeSceneSelection.getWorldPosition(orbit.target)
//       if (orbit.target.length() === 0) {
//         orbit.target.y = 1.5
//       }
//       camera.position.x = orbit.target.x
//       camera.position.y = orbit.target.y
//       camera.position.z = orbit.target.z + 1
//       orbit.update()
//     }
//   }, [orbit, activeSceneSelection, camera.position])
//   return null
// }

//
//
//
//
//
//
//
