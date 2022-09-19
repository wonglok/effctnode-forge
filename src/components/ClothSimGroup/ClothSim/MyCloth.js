import { extend } from '@react-three/fiber'
import { generateUUID } from 'three/src/math/MathUtils'
import {
  BufferAttribute,
  BufferGeometry,
  Clock,
  InstancedBufferGeometry,
  MeshPhysicalMaterial,
  // Mesh,
  // MeshStandardMaterial,
  // SphereBufferGeometry,
  Object3D,
  PlaneBufferGeometry,
  Points,
  ShaderMaterial,
} from 'three140'
import { CustomGPU } from './CustomGPU'
import fragmentShaderForce from './shader/fragmentShaderForce.frag'
import fragmentShaderVel from './shader/fragmentShaderVel.frag'
import fragmentShaderPos from './shader/fragmentShaderPos.frag'
import { Core } from '@/helpers/Core'
import md5 from 'md5'
import displayFragment from './shader/display.frag'
import displayVertex from './shader/display.vert'

export class MyCloth extends Object3D {
  constructor({ gl, mouse }) {
    super()
    // In each frame...

    this.core = Core.makeDisposableNode({ name: 'miniSimCloth' }).sub

    this.dispose = () => {
      this.core.clean()
    }

    this.gl = gl
    this.sizeX = 256
    this.sizeY = 256
    this.count = this.sizeX * this.sizeY
    this.gpu = new CustomGPU(this.sizeX, this.sizeY, this.gl)
    // Compute!
    this.core.onLoop(() => {
      this.gpu.compute()
    })

    // Create initial state float textures
    let meta0 = this.gpu.createTexture()
    let pos0 = this.gpu.createTexture()
    let vel0 = this.gpu.createTexture()
    let force0 = this.gpu.createTexture()

    let i = 0
    for (let y = 0; y < this.sizeY; y++) {
      for (let x = 0; x < this.sizeX; x++) {
        //
        meta0.image.data[i * 4 + 0] = x / this.sizeX
        meta0.image.data[i * 4 + 1] = y / this.sizeY
        meta0.image.data[i * 4 + 2] = 0.0
        meta0.image.data[i * 4 + 3] = 1
        i++
      }
    }
    meta0.needsUpdate = true

    i = 0.0
    for (let y = 0; y < this.sizeY; y++) {
      for (let x = 0; x < this.sizeX; x++) {
        //
        pos0.image.data[i * 4 + 0] = 0.0
        pos0.image.data[i * 4 + 1] = 0.0
        pos0.image.data[i * 4 + 2] = 0.0
        pos0.image.data[i * 4 + 3] = 0.0
        i++
      }
    }
    pos0.needsUpdate = true

    //

    //

    // and fill in here the texture data...

    let forceVar = this.gpu.addVariable(
      'textureForce',
      fragmentShaderForce,
      force0
    )

    let velVar = this.gpu.addVariable(
      'textureVelocity',
      fragmentShaderVel,
      pos0
    )

    let posVar = this.gpu.addVariable(
      'texturePosition',
      fragmentShaderPos,
      vel0
    )

    //
    //

    forceVar.material.uniforms.time = { value: 0 }
    velVar.material.uniforms.time = { value: 0 }
    posVar.material.uniforms.time = { value: 0 }

    forceVar.material.uniforms.delta = { value: 0 }
    velVar.material.uniforms.delta = { value: 0 }
    posVar.material.uniforms.delta = { value: 0 }

    forceVar.material.uniforms.meta0 = { value: meta0 }
    velVar.material.uniforms.meta0 = { value: meta0 }
    posVar.material.uniforms.meta0 = { value: meta0 }

    forceVar.material.uniforms.mouse = { value: mouse }
    velVar.material.uniforms.mouse = { value: mouse }
    posVar.material.uniforms.mouse = { value: mouse }

    //
    // Add variable dependencies
    this.gpu.setVariableDependencies(forceVar, [forceVar, velVar, posVar])
    this.gpu.setVariableDependencies(velVar, [forceVar, velVar, posVar])
    this.gpu.setVariableDependencies(posVar, [forceVar, velVar, posVar])

    // Check for completeness
    let error = this.gpu.init()
    if (error !== null) {
      console.error(error)
    }

    this.clock = new Clock()

    //
    this.getTexAPos = () => this.gpu.getCurrentRenderTarget(posVar).texture
    this.getTexAVel = () => this.gpu.getCurrentRenderTarget(velVar).texture
    this.getTexAForce = () => this.gpu.getCurrentRenderTarget(forceVar).texture

    //
    this.buff = new BufferGeometry()
    this.buff.setAttribute(
      'position',
      new BufferAttribute(new Float32Array(pos0.image.data), 4)
    )
    this.buff.setAttribute(
      'meta0',
      new BufferAttribute(new Float32Array(meta0.image.data), 4)
    )

    this.mat = new ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        delta: { value: 0 },
        pos0: { value: null },
        force0: { value: null },
        vel0: { value: null },
      },
      vertexShader: displayVertex,
      fragmentShader: displayFragment,
    })

    this.core.onLoop((dt) => {
      //
      let et = this.clock.getElapsedTime()
      if (dt >= 1 / 60) {
        dt = 1 / 60
      }

      //
      velVar.material.uniforms.time.value = et
      posVar.material.uniforms.time.value = et
      velVar.material.uniforms.delta.value = dt
      posVar.material.uniforms.delta.value = dt

      this.mat.uniforms.time.value = et
      this.mat.uniforms.delta.value = dt
      this.mat.uniforms.pos0.value = this.getTexAPos()
      this.mat.uniforms.vel0.value = this.getTexAPos()
      this.mat.uniforms.force0.value = this.getTexAForce()
    })

    this.pts = new Points(this.buff, this.mat)
    this.pts.frustumCulled = false
    this.add(this.pts)

    this.core.onClean(() => {
      this.pts.removeFromParent()
    })
  }
}

MyCloth.key = md5(
  generateUUID() +
    fragmentShaderVel +
    fragmentShaderPos +
    displayFragment +
    displayVertex
)
extend({ MyCloth })

//

//

//

//

//

//
