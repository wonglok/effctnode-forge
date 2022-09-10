import { useEffectNode } from '@/effectnode/store/useEffectNode'
import { Environment } from '@react-three/drei'
import { useLoader, useThree } from '@react-three/fiber'
import { Suspense } from 'react'
import { EquirectangularReflectionMapping } from 'three140'
import { RGBELoader } from 'three140/examples/jsm/loaders/RGBELoader'

export function EnvOutlet() {
  let hdrLink = useEffectNode((s) => s.hdrLink)
  return (
    <group>
      {!hdrLink && (
        <Environment background preset='apartment' frames={1}></Environment>
      )}

      <Suspense fallback={null}>
        {hdrLink && <LoaderHDR url={hdrLink}></LoaderHDR>}
      </Suspense>
    </group>
  )
}

function LoaderHDR({ url }) {
  let textre = useLoader(RGBELoader, url)
  textre.mapping = EquirectangularReflectionMapping
  let scene = useThree((s) => s.scene)
  scene.environment = textre

  // scene.background = textre
  return null
}

//

//
