import { useEffect, useState } from 'react'
import SplitPane from 'react-split-pane'
import { ENAssetDrawer } from '../ENAssetDrawer/ENAssetDrawer'
import { ENCanvas } from '../ENCanvas/ENCanvas'
// import { ENFiles } from '../ENFiles/ENFiles'
import { ENGraph } from '../ENGraph/ENGraph'
// import { ENLayers } from '../ENLayers/ENLayers'
import { ENParams } from '../ENParams/ENParams'
import { ENProjectGuard } from '../ENProjectGuard/ENProjectGuard'
import { ENSceneOutline } from '../ENSceneOutline/ENSceneOutline'
import { ENTimeline } from '../ENTimeline/ENTimeline'

export function UIMain() {
  let [ready, setReady] = useState(false)

  useEffect(() => {
    setReady(true)
  }, [])

  return (
    ready && (
      <div className='w-full h-full bg-gray-500 '>
        <UIMainContent></UIMainContent>
      </div>
    )
  )
}

function UIMainContent() {
  return (
    <>
      <div
        className='relative w-full text-xs '
        style={{ height: 'calc(100% - 48px - 30px)' }}
      >
        <div className='w-full'>
          <LeftRight
            //
            NS={'canvas-control'}
            left={() => (
              <UpDown
                NS={'asset-layercanvas'}
                getDefaultSize={() => {
                  return window.innerHeight - 300
                }}
                up={(sizeTD) => (
                  <>
                    <LeftRight
                      getDefaultSize={() => 280}
                      NS={'layers-canvas'}
                      left={() => (
                        <ENProjectGuard>
                          <ENSceneOutline height={sizeTD}></ENSceneOutline>
                        </ENProjectGuard>
                      )}
                      right={() => (
                        <ENProjectGuard>
                          <ENCanvas></ENCanvas>
                        </ENProjectGuard>
                      )}
                    ></LeftRight>
                  </>
                )}
                down={(size) => (
                  <div
                    className='w-full bg-white'
                    style={{ height: size + 'px' }}
                  >
                    <ENAssetDrawer size={size}></ENAssetDrawer>
                  </div>
                )}
              ></UpDown>
            )}
            //
            //
            //
            right={() => (
              <div>
                <UpDown
                  NS={'param-graph'}
                  getDefaultSize={() => {
                    return 300
                  }}
                  up={() => (
                    <ENProjectGuard>
                      <ENParams></ENParams>
                    </ENProjectGuard>
                  )}
                  down={() => (
                    <ENProjectGuard>
                      <ENGraph></ENGraph>
                    </ENProjectGuard>
                  )}
                ></UpDown>
              </div>
            )}
          ></LeftRight>
        </div>
      </div>
      <ENProjectGuard>
        <ENTimeline></ENTimeline>
      </ENProjectGuard>
    </>
  )
}

function LeftRight({
  NS = 'left-right',
  getDefaultSize = () => window.innerWidth - 500,
  left,
  right,
}) {
  let [size, setSize] = useState(1)
  let [onoff, setOnOff] = useState(true)
  useEffect(() => {
    setSize(getDefaultSize())
    let reset = ({ detail: isReset }) => {
      //
      if (isReset) {
        localStorage.setItem(NS, getDefaultSize())
      }
      setOnOff(Math.random())
    }
    // window.addEventListener('resize', hh)
    window.addEventListener('reset-size', reset)

    return () => {
      // window.removeEventListener('resize', hh)
      window.removeEventListener('reset-size', reset)
    }
  }, [])
  return (
    <>
      {
        <SplitPane
          split='vertical'
          size={parseInt(localStorage.getItem(NS), 10) || getDefaultSize()}
          defaultSize={
            parseInt(localStorage.getItem(NS), 10) || getDefaultSize()
          }
          onChange={(size) => localStorage.setItem(NS, size)}
        >
          <>{left(size)}</>
          <>{right(size)}</>
        </SplitPane>
      }
    </>
  )
}

function UpDown({
  NS = 'updown1',
  getDefaultSize = () => window.innerHeight - 24 - 24 - 280,
  up = <>up</>,
  down = <>down</>,
}) {
  let [size, setSize] = useState(1)
  let [onoff, setOnOff] = useState(true)

  useEffect(() => {
    let ttt = setInterval(() => {
      setSize(parseInt(localStorage.getItem(NS), 10) || getDefaultSize())
    }, 100)
    return () => {
      clearInterval(ttt)
    }
  }, [NS, getDefaultSize])

  //
  useEffect(() => {
    let reset = ({ detail: isReset }) => {
      //
      if (isReset) {
        localStorage.setItem(NS, getDefaultSize())
      }

      //
      setOnOff(Math.random())
    }
    // window.addEventListener('resize', hh)
    window.addEventListener('reset-size', reset)

    return () => {
      // window.removeEventListener('resize', hh)
      window.removeEventListener('reset-size', reset)
    }
  }, [])
  return (
    <>
      {
        <SplitPane
          split='horizontal'
          size={parseInt(localStorage.getItem(NS), 10) || getDefaultSize()}
          defaultSize={
            parseInt(localStorage.getItem(NS), 10) || getDefaultSize()
          }
          onChange={(size) => {
            localStorage.setItem(NS, size)
            setSize(size)
          }}
        >
          <>{up(size)}</>
          <>{down(size)}</>
        </SplitPane>
      }
    </>
  )
}
