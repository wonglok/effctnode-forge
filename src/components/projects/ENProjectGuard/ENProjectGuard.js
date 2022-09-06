import { useGLBEditor } from '@/helpers/useGLBEditor'

export function ENProjectGuard({ children }) {
  let activeGLBRawObject = useGLBEditor((s) => s.activeGLBRawObject)
  let activeGLBRuntimeObject = useGLBEditor((s) => s.activeGLBRuntimeObject)
  return <>{activeGLBRawObject && activeGLBRuntimeObject && children}</>
}