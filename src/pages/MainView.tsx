import React from 'react'
import { useContextSelector } from 'use-context-selector'
import { Divider, Flex } from 'rendition'
import { AuthContext } from '../contexts/AuthContext'
import AuthCard from '../components/AuthPanel/AuthCard'
import Catcher from '../components/Catcher/Catcher'
import PlayerPane from '../components/PlayerPane/PlayerPane'
import styled from 'styled-components'
import LoggedOutConsolePanel from '../components/LoggedOutConsolePanel'

const MainViewContainer = styled(Flex)`
  height: 100%;
  width: 100%;
`

const MainViewSideColumn = styled(Flex)`
  flex-grow: 1;
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

const MainView = () => {

  let isAuthenticated = useContextSelector(AuthContext, (c) => c.isAuthenticated ? c.isAuthenticated() : false)

  return (
    <MainViewContainer flexDirection={"row"}>
      <MainViewSideColumn flexDirection={"column"}>
        <AuthCard />
        <MainViewDivider />
        { isAuthenticated ? (
          <Catcher />
        ) : (
          <LoggedOutConsolePanel/>
        )}
      </MainViewSideColumn>
      <PlayerPane/>
    </MainViewContainer>
  )
}

export default MainView