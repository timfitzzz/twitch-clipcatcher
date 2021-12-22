import styled from 'styled-components'
import { Flex } from 'rendition'
import TitleImage from './TitleImage'
import { AuthButton } from './AuthButton'
import HelpButton from './HelpButton'
import HeaderIcon from './HeaderIcon'

import { LogOut } from '@styled-icons/feather/LogOut'
import { useAppSelector } from '../../hooks/reduxHooks'
import { selectAppUser } from '../../redux/selectors'
import { useMemo } from 'react'


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

  let user = useAppSelector(selectAppUser)

  const UserIcon = useMemo(() => user && typeof user.profilePicUrl !== 'undefined' ? styled.img.attrs(p => ({ ...p, src: user?.profilePicUrl }))`` : undefined, [user])

  return <AuthBarContainer>
            <TitleLogo/>
            <HelpButton/>
            <HeaderIcon<typeof UserIcon, typeof LogOut> DefaultIcon={UserIcon} HoverIcon={LogOut} onClick={() => { return }}/>
            <AuthButton/>
         </AuthBarContainer>

}

export default AuthCard