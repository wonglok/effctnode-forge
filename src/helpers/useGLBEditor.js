import {
  provideProjects,
  saveProjects,
  verifyPermission,
} from '@/components/projects/FileSystem/FileSystem'
import { Object3D } from 'three'
import {
  Clock,
  Mesh,
  MeshStandardMaterial,
  SphereBufferGeometry,
} from 'three140'
import { GLTFExporter } from 'three140/examples/jsm/exporters/GLTFExporter'
import { DRACOLoader } from 'three140/examples/jsm/loaders/DRACOLoader'
import { GLTFLoader } from 'three140/examples/jsm/loaders/GLTFLoader'

//
import create from 'zustand'
//
import { getID } from './getID'

let generateInside = (set, get) => {
  return {
    //
    activeSceneSelection: false,
    setSelection: (v) => {
      set({ activeSceneSelection: v })
    },
    // //
    // needsSaveFnc: () => {
    //   //
    // },
    needsSaveMsg: '',
    editorNavigationMode: false,
    activeGLBHandle: false,
    activeGLBRawObject: false,
    activeGLBRuntimeObject: false,
    openFile: async (handle, mode = 'floor') => {
      let closeFile = get().closeFile
      let ans = await closeFile()
      if (ans !== 'ok') {
        return
      }

      //
      let file = await handle.getFile()
      let url = URL.createObjectURL(file)
      let loadGLB = get().loadGLB

      let activeGLBRawObject = await loadGLB(url)
      let activeGLBRuntimeObject = await loadGLB(url)

      //
      set({
        editorNavigationMode: mode,
        activeGLBHandle: handle,
        activeGLBRawObject,
        activeGLBRuntimeObject,
      })
    },

    closeFile: async () => {
      // if (await get().needsSaveFnc()) {
      //   set({ needsSaveMsg: 'please save your file beofre exit!' })

      //   return 'bad'
      // }
      // set({ needsSaveMsg: '' })

      //
      set({
        editorNavigationMode: false,
        activeSceneSelection: false,
        activeGLBHandle: false,
        activeGLBRawObject: false,
        activeGLBRuntimeObject: false,
      })

      return 'ok'
    },

    //
    reloadFiles: 0,
    projectFolders: [],
    currentFolder: false,

    permission: 'prompt',
    queryPermission: async (handle) => {
      let permission = await handle.queryPermission({ mode: 'readwrite' })
      set({ permission })
    },

    requestPermission: async (handle) => {
      let permission = await verifyPermission(handle, true)

      set({ permission })

      return permission
    },

    setCurrentFolder: (v) => {
      set({ currentFolder: v })
    },

    loadProjectFolder: async () => {
      let projects = await provideProjects()
      set({ projectFolders: projects })

      return projects
    },
    removeProjectFolderByID: async (uuid) => {
      let projects = await provideProjects()

      let idx = projects.findIndex((e) => e._id === uuid)
      projects.splice(idx, 1)

      set({ projectFolders: projects })
      await saveProjects(projects)
    },

    listFolderItem: async (handle) => {
      let arr = []

      for await (let item of handle.values()) {
        //
        if (item.name === '.DS_Store') {
          continue
        }

        arr.push({
          _id: handle.name + '/' + '-' + arr.length + item.name,
          handle: item,
        })
      }

      return arr
    },
    addProjectFolderHandle: async (handle) => {
      let projects = await provideProjects()
      projects.push({
        handle: handle,
        _id: getID(),
      })
      await saveProjects(projects)
    },

    uiClock: new Clock(false),
    lastTime: 0,
    resetTime: () => {
      set({ lastTime: 0 })
    },
    toggleRunning: () => {
      /** @type {Clock} */
      let uiClock = get().uiClock

      // console.log(uiClock.running)
      if (uiClock.running) {
        uiClock.stop()
        set({ lastTime: uiClock.getElapsedTime() })
      } else {
        uiClock.start()
        uiClock.elapsedTime = get().lastTime
      }
      set({ uiClock })
    },
    updateClockTime: (v) => {
      /** @type {Clock} */
      let uiClock = get().uiClock

      if (v <= 0) {
        v = 0
      }

      // console.log(uiClock.running)
      uiClock.elapsedTime = v
      set({ uiClock })
    },

    createWorkspaceFolder: async () => {
      let currentFolder = get().currentFolder

      if (!currentFolder?.handle) {
        return
      }

      let generative = await currentFolder?.handle.getDirectoryHandle(
        'generative',
        {
          create: true,
        }
      )
      let handle = await generative.getFileHandle('hello.en.glb', {
        create: true,
      })

      //
      await writeFile(
        handle,
        //
        await get().createEmptyGLBFileBuffer()
      )

      await currentFolder?.handle.getDirectoryHandle('export', {
        create: true,
      })

      let resources = await currentFolder?.handle.getDirectoryHandle(
        'resources',
        {
          create: true,
        }
      )

      await resources.getDirectoryHandle('glb', { create: true })
      await resources.getDirectoryHandle('hdr', { create: true })
      await resources.getDirectoryHandle('textures', { create: true })
      await resources.getDirectoryHandle('materials', { create: true })

      //
      return
    },
    //
    createEmptyGLBFileBuffer: async () => {
      let o3 = new Object3D()
      let resource = new Object3D()
      resource.add(
        new Mesh(
          new SphereBufferGeometry(1, 32, 32),
          new MeshStandardMaterial({ color: 'green' })
        )
      )
      o3.add(resource)
      resource.userData = {
        myData: {
          yo: 1,
          b: ['yo', 'fun'],
        },
        bufferView: new ArrayBuffer(1024),
        gltfExtensions: {
          EXT_EffectNode_VFX: {},
        },
      }

      return get().exportGLB(o3, [])
    },

    loadGLB: async (url) => {
      let loader = new GLTFLoader()
      const dracoLoader = new DRACOLoader()
      dracoLoader.setDecoderPath('/draco/')
      loader.setDRACOLoader(dracoLoader)
      // loader.register((parser) => new GLTFEffectNodeLoader(parser))

      let glb = await loader.loadAsync(url)
      console.log(glb)
      return glb
    },
    exportGLB: (o3 = new Object3D(), animations = []) => {
      return new Promise((resolve) => {
        let exporter = new GLTFExporter()
        // exporter.register((writer) => new GLTFEffectNodeExport(writer))
        exporter.parse(
          o3,
          (res) => {
            resolve(res)
          },
          (err) => {
            console.log(err)
          },
          {
            includeCustomExtensions: true,
            animations,
            trs: false,
            onlyVisible: false,
            binary: true,
            // maxTextureSize: params.maxTextureSize,
          }
        )
        //
      })
    },
    saveFile: async ({ handle, runTimeScene, origScene }) => {
      let cloned = clone(runTimeScene)

      cloned.traverse((pp) => {
        if (pp.userData.effectNode) {
          origScene.traverse((oo) => {
            if (oo.userData.posMD5 === pp.userData.posMD5) {
              oo.userData.effectNode = JSON.parse(
                JSON.stringify(pp.userData.effectNode)
              )
            }
          })
        }
      })

      let buffer = await get().exportGLB(scene, [])
      // get().exportGLB(o3, [])
      // await writeFile(
      //   handle,
      //   buffer
      //   //
      //   // await get().createEmptyGLBFileBuffer()
      // )

      console.log('todo save file for glb')
      return
    },
  }
}

export const useGLBEditor = create((set, get) => {
  return generateInside(set, get)
})

//
async function writeFile(fileHandle, contents) {
  // Create a FileSystemWritableFileStream to write to.
  const writable = await fileHandle.createWritable()
  // Write the contents of the file to the stream.
  await writable.write(contents)
  // Close the file and write the contents to disk.
  await writable.close()
}
