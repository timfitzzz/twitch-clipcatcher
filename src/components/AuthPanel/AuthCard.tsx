import React from 'react'
import styled from 'styled-components'
import { useContextSelector } from 'use-context-selector'

import { Card, Flex } from 'rendition'
import { AuthContext } from '../../contexts/AuthContext'
import TitleImage from './TitleImage'
import { useAppSelector } from '../../hooks/reduxHooks'
import {Settings} from '@styled-icons/feather/Settings'
import {HelpCircle} from '@styled-icons/feather/HelpCircle'

const ButtonCard = styled(Card).attrs(p => ({
  ...p,
  small: true
}))`
  > div {
    > div {
      display: flex;
    }
    display: flex;
  }
  display: flex;
  flex-direction: column;
  margin-right: 0px;
  margin-left: 4px;
  padding: 8px;

  &:last-of-type {
    margin-right: 8px;
  }
  
`

const FirstButtonCard = styled(Card).attrs(p => ({
  ...p,
  small: true
}))`
> div {
  > div {
    display: flex;
  }
  display: flex;
}
display: flex;
flex-direction: column;
margin-right: 0px;
margin-left: auto;
padding: 8px;
`

const SettingsIcon = styled(Settings)`
  width: 40px
`

const HelpCircleIcon = styled(HelpCircle)`
  width: 40px;
`

const AuthBarContainer = styled(Flex).attrs(p => ({
  flexDirection: 'row'
}))`
  margin-top: 8px;
`

const TitleLogo = styled(TitleImage)`
  height: 40px;
  margin-top: auto;
  margin-bottom: auto;
  padding-left: 8px;
`

const TwitchUserIcon = styled.img`
  width: 40px;
`

const AuthCard = () => {

  let isAuthenticated = useContextSelector(AuthContext, (c) => c.isAuthenticated)
  let user = useAppSelector(state => state.settings.user)

  return <AuthBarContainer>
            <TitleLogo/>
            <FirstButtonCard>
              <SettingsIcon/>
            </FirstButtonCard>
            <ButtonCard>
              <HelpCircleIcon/>
            </ButtonCard>
            <ButtonCard>
              { isAuthenticated && isAuthenticated() && user && user.userName && user.profilePicUrl ? (
                <TwitchUserIcon src={user.profilePicUrl}/>
              ) : (
                <span>not logged in</span>
              )}
          </ButtonCard>
         </AuthBarContainer>

}

export default AuthCard