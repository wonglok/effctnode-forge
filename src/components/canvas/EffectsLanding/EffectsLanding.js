import { useScrollStore } from '@/helpers/useScrollStore'
import {
  Bloom,
  ChromaticAberration,
  EffectComposer,
  HueSaturation,
  Noise,
  // Scanline,
  // ShockWave,
  // SMAA,
  // SSAO,
} from '@react-three/postprocessing'
// import { useControls } from 'leva'

export function EffectsLanding() {
  // let useSettings = useControls
  // if (process.env.NODE_ENV === 'production') {
  //   useSettings = (v) => v
  // }

  let useSettings = (v) => v

  const { hue, saturation } = useSettings({ hue: 0, saturation: 0 })
  const { offsetX, offsetY } = useSettings({ offsetX: 0.5, offsetY: 0.0 })

  let diff = 0.0025
  // const diff = useScrollStore((s) => s.diff)
  // console.log('offsetX, offsetY', offsetX, offsetY)
  // console.log('hue, saturation', hue, saturation)

  return (
    <group>
      <EffectComposer>
        <Noise opacity={1} premultiply={true}></Noise>
        <Bloom luminanceThreshold={0.1}></Bloom>
        <ChromaticAberration
          offset={[diff * offsetX, diff * offsetY]}
        ></ChromaticAberration>
        <HueSaturation hue={hue} saturation={saturation}></HueSaturation>
      </EffectComposer>
    </group>
  )
}

//
