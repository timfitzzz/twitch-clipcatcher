import React from 'react'
import styled from 'styled-components'
import { Flex } from 'rendition'
import TitleImage from './TitleImage'
// import {Settings} from '@styled-icons/feather/Settings'
import { AuthButton } from './AuthButton'
import HelpButton from './HelpButton'

// const SettingsIcon = styled(Settings)`
//   width: 40px
// `

const AuthBarContainer = styled(Flex).attrs(p => ({
  flexDirection: 'row'
}))`
  padding-top: 8px;
  padding-bottom: 8px;
  background-color: ${p => p.theme.colors.quartenary.semilight};
`

const TitleLogo = styled(TitleImage)`
  height: 40px;
  margin-top: auto;
  margin-bottom: auto;
  padding-left: 8px;
  path {
    stroke: ${p => p.theme.colors.secondary.main};
  }
`


const AuthCard = () => {

  return <AuthBarContainer>
            <TitleLogo/>
            {/* <FirstButtonCard>
              <SettingsIcon/>
            </FirstButtonCard> */}
            <HelpButton/>
            <AuthButton/>
         </AuthBarContainer>

}

export default AuthCard