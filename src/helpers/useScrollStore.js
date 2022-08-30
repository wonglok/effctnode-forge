import { MathUtils } from 'three'
import create from 'zustand'
export const useScrollStore = create((set, get) => {
  return {
    smooth: 0,
    diff: 0,
    setSmooth: (now, dt) => {
      let smooth = get().smooth

      let ll = MathUtils.damp(smooth, now, 0.05, dt * 1000)

      set({ smooth: ll, diff: ll - smooth })
    },
  }
})