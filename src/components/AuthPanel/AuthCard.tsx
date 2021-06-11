import React from 'react'
import styled from 'styled-components'
import { useContextSelector } from 'use-context-selector'

import { Card } from 'rendition'
import { AuthContext } from '../../contexts/AuthContext'

const TwitchLoginCard = styled(Card).attrs(p => ({
  ...p,
  small: true
}))`

`

const AuthCard = () => {

  let isAuthenticated = useContextSelector(AuthContext, (c) => c.isAuthenticated)
  let user = useContextSelector(AuthContext, (c) => c.user)

  return <TwitchLoginCard>
          { isAuthenticated && isAuthenticated() ? (
            user && user.profile.preferred_username
          ) : (
            <span>not logged in</span>
          )}
         </TwitchLoginCard>
}

export default AuthCard