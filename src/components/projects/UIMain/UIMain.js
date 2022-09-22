import { useGLBEditor } from '@/helpers/useGLBEditor'
import { useEffect, useState } from 'react'
import SplitPane from 'react-split-pane'
import { ENAssetDrawer } from '../ENAssetDrawer/ENAssetDrawer'
import { ENCanvas } from '../ENCanvas/ENCanvas'
// import { ENFiles } from '../ENFiles/ENFiles'
import { ENGraph, OverlayHtml } from '../ENGraph/ENGraph'
import { ENMaterialParams } from '../ENMaterialParams/ENMaterialParams'
// import { ENLayers } from '../ENLayers/ENLayers'
import { ENParams } from '../ENParams/ENParams'
import { ENProjectGuard } from '../ENProjectGuard/ENProjectGuard'
import { ENSceneOutline } from '../ENSceneOutline/ENSceneOutline'
import { PropTabs } from './PropTabs'
// import { ENTimeline } from '../ENTimeline/ENTimeline'

export function UIMain() {
  let [ready, setReady] = useState(false)

  useEffect(() => {
    setReady(true)

    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('reset-size', { detail: true }))
    }, 1000)
  }, [])

  return (
    ready && (
      <div className='w-full h-full bg-white '>
        <UIMainContent></UIMainContent>
      </div>
    )
  )
}

//

let tt = 0
let vv = 0

//
function UIMainContent() {
  let setRightPaneWidth = useGLBEditor((s) => s.setRightPaneWidth)
  let rightPanelWidth = useGLBEditor((s) => s.rightPanelWidth)
  let setDrawerSize = useGLBEditor((s) => s.setDrawerSize)
  let drawerSize = useGLBEditor((s) => s.drawerSize)

  //
  return (
    <>
      <div
        // - 48px - 30px
        className='relative w-full text-xs  bordergray-500  '
        style={{ height: 'calc(100% )' }}
      >
        <div className='w-full'>
          <LeftRight
            NS={'canvas-control'}
            left={(leftSize) => (
              <UpDown
                NS={'asset-layercanvas'}
                getDefaultSize={() => {
                  return window.innerHeight - 175
                }}
                up={(sizeTD) => (
                  <>
                    <LeftRight
                      getDefaultSize={() => 300}
                      NS={'layers-canvas'}
                      left={() => (
                        <ENProjectGuard>
                          <UpDown
                            getDefaultSize={() => {
                              return (window.innerHeight - 175) / 2
                            }}
                            NS={'ENSceneOutline-up-down'}
                            up={(varHeight) => {
                              return (
                                <div
                                  className='w-full'
                                  style={{ height: varHeight + 'px' }}
                                >
                                  <div
                                    style={{ height: '35' + 'px' }}
                                    className='flex items-center justify-center bg-gray-300'
                                  >
                                    <div>Scene Outline</div>
                                    {/*  */}
                                  </div>
                                  <ENSceneOutline
                                    height={varHeight - 35}
                                  ></ENSceneOutline>
                                </div>
                              )
                            }}
                            //
                            down={(varHeight) => {
                              return (
                                <div
                                  className='w-full'
                                  style={{ height: sizeTD - varHeight + 'px' }}
                                >
                                  <div
                                    style={{ height: '35' + 'px' }}
                                    className='flex items-center justify-center bg-gray-300'
                                  >
                                    <div>Material Library</div>
                                  </div>
                                  <div
                                    className='w-full'
                                    style={{
                                      height: sizeTD - varHeight - 35 + 'px',
                                    }}
                                  >
                                    <div>1</div>
                                  </div>
                                </div>
                              )
                            }}
                          ></UpDown>
                        </ENProjectGuard>
                      )}
                      right={(size) => (
                        <UpDown
                          NS={'param-graph'}
                          getDefaultSize={() => {
                            return (window.innerHeight - 175) / 2
                          }}
                          up={(size) => (
                            <div
                              className='relative w-full h-full'
                              style={{
                                width:
                                  window.innerWidth -
                                  (rightPanelWidth + size) +
                                  'px',
                              }}
                            >
                              {/* material.agape.json */}
                              <ENProjectGuard>
                                <ENCanvas key='encanvas'></ENCanvas>
                              </ENProjectGuard>
                              <OverlayHtml></OverlayHtml>
                            </div>
                          )}
                          down={(down) => (
                            <div
                              className='w-full'
                              style={{
                                height:
                                  window.innerHeight - drawerSize - down + 'px',
                              }}
                            >
                              <ENProjectGuard
                                //
                                loading={
                                  <div className='flex items-center justify-center w-full h-full bg-gray-300'>
                                    <div className='p-2 px-4 bg-gray-100 rounded-full'>
                                      Loading...
                                    </div>
                                  </div>
                                }
                                //
                                placeholder={
                                  <div className='flex items-center justify-center w-full h-full bg-gray-300 from-slate-500 to-slate-300 bg-gradient-to-b'>
                                    <div className='p-2 px-4 bg-gray-100 rounded-full'>
                                      Please Select a GLB File Below to Begin
                                      Editing 👇🏼
                                    </div>
                                  </div>
                                }
                              >
                                <ENGraph></ENGraph>
                              </ENProjectGuard>
                            </div>
                          )}
                        ></UpDown>
                      )}
                    ></LeftRight>
                  </>
                )}
                down={(size) => {
                  setDrawerSize(window.innerHeight - size)

                  return (
                    <div
                      className='w-full bg-white'
                      style={{ height: size + 'px' }}
                    >
                      <ENAssetDrawer size={size}></ENAssetDrawer>
                    </div>
                  )
                }}
              ></UpDown>
            )}
            //
            //
            right={(size) => {
              //
              setRightPaneWidth(window.innerWidth - size)

              return (
                <div style={{ height: '100%' }}>
                  <ENProjectGuard>
                    <PropTabs
                      tabs={[
                        {
                          name: 'mat',
                          label: 'Material Properties',
                          compo: (
                            <ENMaterialParams
                              key={'matparams'}
                            ></ENMaterialParams>
                          ),
                        },
                        {
                          name: 'node',
                          label: 'Advanced Node Properties',
                          compo: <ENParams key={'nodeparams'}></ENParams>,
                        },
                      ]}
                    ></PropTabs>
                  </ENProjectGuard>

                  {/*
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
                  ></UpDown> */}
                </div>
              )
            }}
          ></LeftRight>
        </div>
      </div>
      {/* <ENProjectGuard
        placeholder={
          <div className='w-full h-full border-t border-gray-300'></div>
        }
      >
        <ENTimeline></ENTimeline>
      </ENProjectGuard> */}
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
    window.dispatchEvent(new Event('reset-size', { detail: true }))
  }, [size])
  useEffect(() => {
    let ttt = setInterval(() => {
      setSize(parseInt(localStorage.getItem(NS), 10) || getDefaultSize())
    }, 100)
    return () => {
      clearInterval(ttt)
    }
  }, [NS, getDefaultSize])
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
          onChange={(size) => {
            clearTimeout(tt)
            tt = setTimeout(() => {
              localStorage.setItem(NS, size)
              setSize(size)
            }, 100)
          }}
        >
          <>{left(size)}</>
          <>{right(size)}</>
        </SplitPane>
      }
    </>
  )
}

export function UpDown({
  NS = 'updown1',
  getDefaultSize = () => window.innerHeight - 24 - 24 - 280,
  up = () => <>up</>,
  down = () => <>down</>,
}) {
  let [size, setSize] = useState(1)
  let [onoff, setOnOff] = useState(true)
  useEffect(() => {
    window.dispatchEvent(new Event('reset-size', { detail: true }))
  }, [size])
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
            clearTimeout(vv)
            vv = setTimeout(() => {
              localStorage.setItem(NS, size)
              setSize(size)
            }, 100)
          }}
        >
          <>{up(size)}</>
          <>{down(size)}</>
        </SplitPane>
      }
    </>
  )
}
