import React from 'react'
import { useContextSelector } from 'use-context-selector'
import { Divider, Flex } from 'rendition'
import { AuthContext } from '../contexts/AuthContext'
import AuthCard from '../components/AuthPanel/AuthCard'
import Catcher from '../components/Catcher/Catcher'
import PlayerPane from '../components/PlayerPane/PlayerPane'
import styled from 'styled-components'

const MainViewContainer = styled(Flex)`
  height: 100%;
  width: 100%;
`

const MainViewSideColumn = styled(Flex)`
  flex-grow: 1;
  width: 400px;
  max-width: 400px;
  min-width: 400px;
  height: 100%;
`

const MainView = () => {

  let isAuthenticated = useContextSelector(AuthContext, (c) => c.isAuthenticated)

  return (
    <MainViewContainer flexDirection={"row"}>
      <MainViewSideColumn flexDirection={"column"}>
        <AuthCard />
        <Divider />
        { isAuthenticated && isAuthenticated() ? (
          <Catcher />
        ) : (
          <span>not logged in</span>
        )}
      </MainViewSideColumn>
      <PlayerPane/>
    </MainViewContainer>
  )
}

export default MainView