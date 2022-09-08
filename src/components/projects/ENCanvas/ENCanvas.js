import { EffectNodeRuntime } from '@/effectnode/component/EffectNodeRuntime'
import { ConnectCameraControls } from '@/helpers/ConnectCameraControls'
import { ConnectKeyboard } from '@/helpers/ConnectKeyboard'
import { ConnectSimulation } from '@/helpers/ConnectSimulation'
import { FloorFlat } from '@/helpers/FloorFlat'
import { FloorObject } from '@/helpers/FloorObject'
import { Player } from '@/helpers/Player'
import { useGLBEditor } from '@/helpers/useGLBEditor'
import { Environment, OrbitControls } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'

export function ENCanvas() {
  let activeGLBRawObject = useGLBEditor((s) => s.activeGLBRawObject)
  let activeGLBRuntimeObject = useGLBEditor((s) => s.activeGLBRuntimeObject)
  let editorNavigationMode = useGLBEditor((s) => s.editorNavigationMode)
  return (
    <div className='w-full h-full bg-white'>
      <Canvas className='w-full h-full'>
        {/* <color attach={'background'} args={['#cceeff']}></color> */}

        {activeGLBRawObject?.scene && (
          <>
            {/*  */}
            {/*  */}
            <primitive
              key={activeGLBRuntimeObject.scene.uuid + 'display'}
              object={activeGLBRuntimeObject.scene}
            ></primitive>
            {/*  */}
            {/*  */}
            <EffectNodeRuntime
              key={activeGLBRuntimeObject.scene.uuid + 'runtime'}
              glbObject={activeGLBRuntimeObject}
              glbRaw={activeGLBRawObject}
            ></EffectNodeRuntime>
          </>
        )}

        {editorNavigationMode === 'floor' && (
          <>
            <Environment preset='apartment' frames={1}></Environment>
            <gridHelper args={[500, 500]}></gridHelper>
            <ConnectKeyboard></ConnectKeyboard>
            <ConnectCameraControls></ConnectCameraControls>
            <ConnectSimulation></ConnectSimulation>
            <Player></Player>
            <FloorFlat
              key={activeGLBRawObject.uuid + 'floorflat'}
              name={activeGLBRawObject.uuid}
            ></FloorFlat>
          </>
        )}

        {editorNavigationMode === 'meta' && activeGLBRawObject.scene && (
          <>
            <ConnectKeyboard></ConnectKeyboard>
            <ConnectCameraControls></ConnectCameraControls>
            <ConnectSimulation></ConnectSimulation>
            <Player></Player>
            <FloorObject
              key={activeGLBRawObject.uuid + 'floorobj'}
              object={activeGLBRawObject.scene}
            ></FloorObject>
            <Environment background preset='apartment' frames={1}></Environment>
          </>
        )}

        {editorNavigationMode === 'orbit' && (
          <>
            <OrbitControls></OrbitControls>
            <Environment background preset='apartment' frames={1}></Environment>
          </>
        )}
      </Canvas>
    </div>
  )
}

//
//
//
//
//
//
//
