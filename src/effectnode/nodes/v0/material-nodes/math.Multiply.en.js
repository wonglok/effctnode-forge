import { getID } from '@/helpers/getID'
import { Color } from 'three'
import { UniformNode } from 'three144/examples/jsm/nodes/Nodes'

import {
  NodeMaterial,
  checker,
  mul,
  add,
  uv,
  vec2,
  timerLocal,
} from 'three144/examples/jsm/nodes/Nodes'

export async function nodeData({ defaultData, nodeID }) {
  return {
    ...defaultData,

    //
    //
    inputs: [
      //
      { _id: getID(), type: 'input', name: 'slot0', nodeID },
      { _id: getID(), type: 'input', name: 'slot1', nodeID },
    ],

    //
    //

    // at least 1
    outputs: [
      //
      { _id: getID(), type: 'output', name: 'result', nodeID },
    ],

    //
    uniforms: [],

    //
  }
}

//

//

export function effect({ node, mini, data, setComponent }) {
  let args = []

  let send = () => {
    return mul(...args)
  }

  node.in0.stream((v) => {
    console.log(v)
    args[0] = v

    if (args.length > 0) {
      node['out_result'].pulse(send())
    }
  })

  node.in1.stream((v) => {
    console.log(v)

    args[1] = v

    if (args.length > 0) {
      node['out_result'].pulse(send())
    }
  })

  //

  //
  // let applyToIt = (v) => {
  //   mini.ready.itself.then((it) => {
  //     it.material = v
  //   })
  // }
  //
  //

  // let physicalMaterialInstance = new MeshPhysicalMaterial()
  // let nodeMaterial = NodeMaterial.fromMaterial(physicalMaterialInstance)
  // applyToIt(nodeMaterial)
  // node.raw.inputs.forEach((it) => {
  //   node[`in_${it.name}`].stream((v) => {
  //     nodeMaterial[`${it.name}Node`] = v
  //   })
  // })
  //
  // node.in_color.stream((v) => {
  //   nodeMaterial.colorNode = v
  // })
  //
  // node.in_map.stream((v) => {
  //   nodeMaterial.mapNode = v
  // })
  //
  // node.in_normalMap.stream((v) => {
  //   nodeMaterial.normalMapNode = v
  // })
  //
  // console.log(data.raw)
}

//

//

//

//
