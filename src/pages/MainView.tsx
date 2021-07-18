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

const VerticalDraggableDivider = styled(({className}: { className?: string}) => {

  let dispatch = useAppDispatch()
  let [dragging, setDragging] = useState<boolean>(false)

  const handleMouseDown = (e: React.MouseEvent) => {
    setDragging(true)
    console.log(e.clientX)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (dragging) {
      dispatch(leftColumnWidthAdjusted(e.clientX))
    }
  }

  const handleMouseUp = (e: React.MouseEvent) => {
    dispatch(leftColumnWidthAdjusted(e.clientX))
    setDragging(false)
    console.log(e.clientX)
  }



  return <div className={className} onMouseMove={handleMouseMove} onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} draggable></div>

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
  let leftColumnWidth = useAppSelector(memoize(({settings}) => settings.leftColumnWidth))

  return (
    <MainViewContainer flexDirection={"row"}>
      <MainViewSideColumn flexDirection={"column"} width={leftColumnWidth}>
        <AuthCard />
        <MainViewDivider />
        { isAuthenticated ? (
          <Catcher />
        ) : (
          <LoggedOutConsolePanel/>
        )}
      </MainViewSideColumn>
      <VerticalDraggableDivider/>
      <PlayerPane/>
    </MainViewContainer>
  )
}

export default MainView