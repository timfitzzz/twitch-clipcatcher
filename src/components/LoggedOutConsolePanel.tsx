import React from 'react'
import styled from 'styled-components'
import { Flex, Alert } from 'rendition'
import { useContextSelector } from 'use-context-selector'
import { AuthContext } from '../contexts/AuthContext'

const LoggedOutConsolePanelContainer = styled(Flex).attrs(p => ({
  flexDirection: 'column'
}))`
  margin: 8px;
`

const LinkySpan = styled.a`

`

export const LoggedOutConsolePanel = () => {

  const signinRedirect = useContextSelector(AuthContext, (c) => c.signinRedirect)

  return (
    <LoggedOutConsolePanelContainer flexDirection={'column'}>
      <Alert emphasized><LinkySpan href="#" role="button" onClick={signinRedirect}>Log in with Twitch</LinkySpan> to begin.</Alert>
    </LoggedOutConsolePanelContainer>
  )


}

export default LoggedOutConsolePanel
