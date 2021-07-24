import React, { useMemo, useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import styled, { StyleSheetManager } from 'styled-components'
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks'
import { selectPlayerPoppedout } from '../../redux/selectors'
import { playerPoppedIn } from '../../redux/settings'

const PlayerPaneContainer = styled(({children, className}: {children: React.ReactElement, className?: string}) => {

  let poppedOut = useAppSelector(state => selectPlayerPoppedout({ settings: state.settings }))
  let [playerWindow, setPlayerWindow] = useState<Window | null>(null)
  let dispatch = useAppDispatch()
  let windowContainer = useMemo(() => {
    let element = document.createElement('div');
    element.style.display = "content";
    return element
  },[])
  let renderedPlayer = useMemo(() => children, [children])

  useEffect(() => {
    if (poppedOut) {
     setPlayerWindow(window.open('','','width=1280,height=720,left=200,top=200,scrollbars=no,toolbar=no,titlebar=no,location=no,status=no,menubar=no'))
    } else {
      if (playerWindow) {
        playerWindow.close()
        setPlayerWindow(null)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- eslint thinks playerWindow needs to be in here, but it causes a render loop
  }, [poppedOut])

  useEffect(() => {
    if (playerWindow) {
      playerWindow.document.title = 'ClipsTime!'
      playerWindow.document.documentElement.style.display = 'content'
      playerWindow.document.body.style.display = 'content'
      playerWindow.document.body.appendChild(windowContainer)
      playerWindow.onbeforeunload = () => { dispatch(playerPoppedIn()); return undefined }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- eslint thinks windowContainer needs to be in here, but it causes a render loop
  },[playerWindow])

  return poppedOut && playerWindow ? createPortal((
    <div className={className + ' popped-out'} style={{WebkitFontSmoothing: 'antialiased', MozOsxFontSmoothing: 'grayscale', position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, overflow: 'hidden'}}>
      <StyleSheetManager target={playerWindow.document.body}>
        {renderedPlayer}
      </StyleSheetManager>
    </div>), windowContainer) : (
    <div className={className}>
      {renderedPlayer}
    </div>
  )
})`
  height: 100%;
  width: 100%;
  display: content;

`

export default PlayerPaneContainer