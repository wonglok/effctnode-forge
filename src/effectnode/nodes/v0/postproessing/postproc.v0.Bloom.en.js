import { getID } from '@/helpers/getID'
import { Bloom } from '@react-three/postprocessing'
// import { createPortal } from '@react-three/fiber'
// import { useEffect, useState } from 'react'
// import { Object3D } from 'three140'
//

export async function nodeData({ defaultData, nodeID }) {
  return {
    ...defaultData,

    //
    //
    inputs: [
      //
      { _id: getID(), type: 'input', nodeID },
    ],

    // at least 1
    //
    outputs: [
      //
      { _id: getID(), type: 'output', nodeID },
    ],

    //
    material: [],

    //
    uniforms: [
      // {
      //   _id: getID(),
      //   nodeID,
      //   name: 'speed',
      //   type: 'float',
      //   value: 1,
      // },
      //
      // {
      //   _id: getID(),
      //   nodeID,
      //   name: 'colorA',
      //   type: 'color',
      //   value: '#00ff89',
      // },
      // {
      //   id: getID(),
      //   nodeID,
      //   name: 'shader',
      //   type: `glsl`,
      //   value: `
      //   `,
      // },
    ],

    //
    //
    shaders: [],

    //
  }
}

export function effect({ node, mini, data, setComponent }) {
  //

  let output = {
    _id: getID(),
    type: 'Bloom',
    props: {},
  }

  node.out0.pulse(output)
  //
}

//
