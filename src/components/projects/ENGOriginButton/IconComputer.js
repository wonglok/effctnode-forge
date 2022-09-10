import { Box, Text, useGLTF } from '@react-three/drei'
import { Suspense } from 'react'

export function IconComputer({ onClick = () => {} }) {
  return (
    // <Suspense fallback={null}>
    <ImplementationOfBtn onClick={onClick}></ImplementationOfBtn>
    // </Suspense>
  )
}

export function ImplementationOfBtn({ onClick }) {
  // let glb = useGLTF(`/effectnode/mac-draco.glb`)
  return (
    <group
      scale={1}
      onPointerEnter={() => {
        document.body.style.cursor = 'pointer'
      }}
      onPointerLeave={() => {
        document.body.style.cursor = ''
      }}
      onPointerDown={onClick}
    >
      <Text
        color={'#000000'}
        fontSize={0.7}
        maxWidth={200}
        lineHeight={1}
        textAlign={'center'}
        font='/font/Cronos-Pro-Light_12448.ttf'
        anchorX='center'
        anchorY='middle'
        outlineWidth={0.1}
        outlineColor='#ffffff'
        rotation-x={Math.PI * -0.25}
        position={[0, 3.5, 0]}
      >
        Click to Add Node Module
      </Text>

      <Box args={[5, 0.2, 1]} position={[0, 0.2, 0]}>
        <meshStandardMaterial color={'blue'} metalness={1} roughness={0} />
      </Box>

      <Box args={[1, 0.2, 5]} position={[0, 0.2, 0]}>
        <meshStandardMaterial color={'blue'} metalness={1} roughness={0} />
      </Box>
      <Box args={[6, 0.2, 6]} position={[0, 0.0, 0]}>
        <meshStandardMaterial color={'white'} metalness={1} roughness={0.1} />
      </Box>

      {/* <primitive object={glb.scene}></primitive> */}
    </group>
  )
}

//
