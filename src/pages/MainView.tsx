import React from 'react'
import { useContextSelector } from 'use-context-selector'
import { Divider, Flex } from 'rendition'
import { AuthContext } from '../contexts/AuthContext'
import AuthCard from '../components/AuthPanel/AuthCard'
import Catcher from '../components/Catcher/Catcher'
import PlayerPane from '../components/PlayerPane/PlayerPane'
import styled from 'styled-components'
import LoggedOutConsolePanel from '../components/LoggedOutConsolePanel'
import { useAppDispatch, useAppSelector } from '../hooks/reduxHooks'
import memoize from 'proxy-memoize'
import { useState } from 'react'
import { leftColumnWidthAdjusted } from '../redux/settings'
import { useRef } from 'react'

const MainViewContainer = styled(Flex)`
  height: 100%;
  width: 100%;
`

const MainViewSideColumn = styled(Flex)`
  // width: 386px;
  // max-width: 386px;
  // min-width: 386px;
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
  width: 4px;
  cursor: col-resize;
  background-color: ${({theme}) => theme.colors.primary.light};
  &:media (min-width: 420px) {
    display: none;
  }
`

const MainView = () => {

  let isAuthenticated = useContextSelector(AuthContext, (c) => c.isAuthenticated ? c.isAuthenticated() : false)
  let savedleftColumnWidth = useAppSelector(memoize(({settings}) => settings.leftColumnWidth))
  let dispatch = useAppDispatch()
  let [ leftColumnWidth, setLeftColumnWidth ] = useState<number>(savedleftColumnWidth || 312)
  let [ draggingDivider, setDraggingDivider ] = useState<boolean>(false)
  let viewContainer = useRef<HTMLDivElement>(null)

  let handleDividerDragStart = () => {
    if (viewContainer && viewContainer.current) {
      setDraggingDivider(true)
    }
  }

  let handleDrag = (e: React.MouseEvent) => {
    if (draggingDivider) {
      if (e.clientX > 305) {
        setLeftColumnWidth(e.clientX)
      }
    }
  }

  let handleDividerDragEnd = (e: React.MouseEvent) => {
    if (viewContainer && viewContainer.current) {
      dispatch(leftColumnWidthAdjusted(leftColumnWidth))
      setDraggingDivider(false)
    }
  }

  

  return (
    <MainViewContainer flexDirection={"row"} ref={viewContainer} onMouseMove={draggingDivider ? handleDrag : undefined} onMouseUp={draggingDivider ? handleDividerDragEnd : undefined}>
      <MainViewSideColumn flexDirection={"column"} width={leftColumnWidth}>
        <AuthCard />
        <MainViewDivider />
        { isAuthenticated ? (
          <Catcher />
        ) : (
          <LoggedOutConsolePanel/>
        )}
      </MainViewSideColumn>
      <VerticalDraggableDivider handleDragStart={handleDividerDragStart}/>
      <PlayerPane/>
    </MainViewContainer>
  )
}

export default MainView