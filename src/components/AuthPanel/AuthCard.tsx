import React from 'react'
import styled from 'styled-components'
import { Flex } from 'rendition'
import TitleImage from './TitleImage'
import { AuthButton } from './AuthButton'
import HelpButton from './HelpButton'

const AuthBarContainer = styled(Flex).attrs(p => ({
  flexDirection: 'row'
}))`

  padding-top: 8px;
  padding-bottom: 8px;
  background-color: ${p => p.theme.colors.quartenary.semilight};
`

export const TitleLogo = styled(TitleImage)`
  height: 40px;
  margin-top: auto;
  margin-bottom: auto;
  padding-left: 8px;
  path {
    stroke: ${p => p.theme.colors.secondary.main};
    stroke-width: 8px;
  }
`


const AuthCard = () => {

  return <AuthBarContainer>
            <TitleLogo/>
            <HelpButton/>
            <AuthButton/>
         </AuthBarContainer>

}

export default AuthCard