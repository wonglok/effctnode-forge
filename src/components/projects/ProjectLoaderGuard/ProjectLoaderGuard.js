import { useGLBEditor } from '@/helpers/useGLBEditor'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

export function ProjectLoaderGuard({ children = () => {} }) {
  let router = useRouter()
  let projectID = router.query.projectID
  let setCurrentFolder = useGLBEditor((s) => s.setCurrentFolder)

  let [project, setProject] = useState('loading')
  let loadProjectFolder = useGLBEditor((s) => s.loadProjectFolder)
  let requestPermission = useGLBEditor((s) => s.requestPermission)
  let currentFolder = useGLBEditor((s) => s.currentFolder)
  let permission = useGLBEditor((s) => s.permission)

  useEffect(() => {
    if (!projectID) {
      return
    }
    loadProjectFolder()
      .then((e) => {
        return e.find((e) => e._id === projectID)
      })
      .then(async (s) => {
        //
        if (s) {
          await setCurrentFolder(s)
          setProject('found')
        } else {
          setProject('notfound')
        }
      })
  }, [loadProjectFolder, projectID, setCurrentFolder])

  return (
    <>
      {project === 'loading' && (
        <div className='flex items-center justify-center w-full h-full'>
          Loading...
        </div>
      )}
      {project === 'notfound' && (
        <div className='flex flex-col items-center justify-center w-full h-full'>
          <div className='mb-12 text-center'>Folder Not Found...</div>
          <div>
            <button
              onClick={async () => {
                router.push('/project')
              }}
              className='p-5 text-white bg-gray-500 rounded-xl'
            >
              Go Back Home
            </button>
          </div>
        </div>
      )}
      {project === 'found' && permission !== 'granted' && (
        <div className='flex items-center justify-center w-full h-full'>
          <button
            onClick={async () => {
              await requestPermission(currentFolder.handle)
            }}
            className='p-5 text-white bg-gray-500 rounded-xl'
          >
            Allow Reading Folder for: {currentFolder.handle.name}
          </button>
        </div>
      )}
      {project === 'found' && permission === 'granted' && children}
    </>
  )
}
//
