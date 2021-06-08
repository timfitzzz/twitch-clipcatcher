import React from 'react'
import styled from 'styled-components'
import { useContextSelector } from 'use-context-selector'

import { Card } from 'rendition'
import { TwitchContext } from '../../contexts/TwitchContext'

const TwitchLoginCard = styled(Card).attrs(p => ({
  ...p,
  small: true
}))`

`

const AuthCard = () => {

  let isAuthenticated = useContextSelector(TwitchContext, (c) => c.isAuthenticated)
  let user = useContextSelector(TwitchContext, (c) => c.user)

  return <TwitchLoginCard>
          { isAuthenticated && isAuthenticated() ? (
            user && user.profile.preferred_username
          ) : (
            <span>not logged in</span>
          )}
         </TwitchLoginCard>
}

export default AuthCard