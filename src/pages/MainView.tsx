import React from 'react'
import { useContextSelector } from 'use-context-selector'
import { Divider, Flex } from 'rendition'
import { AuthContext } from '../contexts/AuthContext'
import Catcher from '../components/Catcher/Catcher'
import PlayerPane from '../components/PlayerPane/PlayerPane'
import PlayerPaneContainer from '../components/PlayerPane/PlayerPaneContainer'
import styled from 'styled-components'
import LoggedOutConsolePanel from '../components/LoggedOutConsolePanel'
import { useAppDispatch, useAppSelector } from '../hooks/reduxHooks'
import { useState } from 'react'
import { leftColumnWidthAdjusted } from '../redux/settings'
import { useRef } from 'react'
import { selectLeftColumnWidth, selectPlayerPoppedout } from '../redux/selectors'
import PlayerPaneUndertray from '../components/PlayerPane/PlayerPaneUndertray'
import HelpOverlay from '../components/HelpOverlay'
import WeAreJustSoSoSorry from './MobileApology'
import TopBar from '../components/TopBar/TopBar'

const MainViewContainer = styled(Flex)`
  height: 100%;
  width: 100%;
`

const MainViewSideColumn = styled(Flex)`
  height: 100%;
`

const MainViewDivider = styled(Divider)`
  margin-top: 0px;
  border-color: ${p => p.theme.colors.quartenary.light};
  border-width: 2px;
  margin-bottom: 2px;
  
`

const VerticalDraggableDivider = styled(({handleDragStart, className}: { handleDragStart: (e: React.MouseEvent) => void, className?: string}) => {

  return <div className={className} onMouseDown={handleDragStart} draggable></div>

})`
  height: 100%;
  width: 8px;
  cursor: col-resize;
  background-color: ${({theme}) => theme.colors.primary.light};
  &:media (min-width: 420px) {
    display: none;
  }
`

const MainView = () => {

  let isAuthenticated = useContextSelector(AuthContext, (c) => c.isAuthenticated ? c.isAuthenticated() : false)
  let savedleftColumnWidth = useAppSelector(state => selectLeftColumnWidth(state.settings))
  let playerPoppedOut = useAppSelector(state => selectPlayerPoppedout(state.settings))
  let dispatch = useAppDispatch()

  let [ leftColumnWidth, setLeftColumnWidth ] = useState<number>(savedleftColumnWidth || 321)
  let [ draggingDivider, setDraggingDivider ] = useState<boolean>(false)
  let viewContainer = useRef<HTMLDivElement>(null)
  let hoverSupported = Modernizr.hovermq

  let handleDividerDragStart = (e: React.MouseEvent) => {
    if (viewContainer && viewContainer.current) {
      setDraggingDivider(true)
    }
  }

  let handleDrag = (e: React.MouseEvent) => {
    if (draggingDivider) {
      if (e.clientX >= 321) {
        setLeftColumnWidth(e.clientX)
      }
    }
  }

  let handleDividerDragEnd = (e: React.MouseEvent) => {
    if (viewContainer && viewContainer.current) {
      dispatch(leftColumnWidthAdjusted(e.clientX))
      setDraggingDivider(false)
    }
  }

  

  return (
    <MainViewContainer flexDirection={"row"} ref={viewContainer} onMouseMove={draggingDivider ? handleDrag : undefined} onMouseUp={draggingDivider ? handleDividerDragEnd : undefined}>
      { hoverSupported ? (
        <>
        <HelpOverlay/>
        <MainViewSideColumn flexDirection={"column"} width={leftColumnWidth} minWidth={leftColumnWidth}>
          <TopBar />
          <MainViewDivider />
          { isAuthenticated ? (
            <Catcher />
          ) : (
            <LoggedOutConsolePanel/>
          )}
        </MainViewSideColumn>
        <VerticalDraggableDivider handleDragStart={handleDividerDragStart}/>
        <PlayerPaneContainer >
          <PlayerPane key={'playerpane'} draggingDivider={draggingDivider} />
        </PlayerPaneContainer>
        { playerPoppedOut && <PlayerPaneUndertray/>}
        </>
      ) : (
        <WeAreJustSoSoSorry/>
      )}
      
    </MainViewContainer>
  )
}

export default MainView