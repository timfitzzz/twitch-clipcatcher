import styled, { StyledComponent } from 'styled-components'
import TopBarIcon from './TopBarIcon'
import { LogOut } from '@styled-icons/feather/LogOut'
import { Twitch } from '@styled-icons/feather'
import { Help } from '@styled-icons/material/Help'
import { useAppSelector } from '../../hooks/reduxHooks'
import { selectAppUser } from '../../redux/selectors'
import { useContextSelector } from 'use-context-selector'
import { AuthContext } from '../../contexts/AuthContext'

export interface LogInButtonProps extends Parameters<typeof TopBarIcon> {
  UserIcon: StyledComponent<"image", any>,
  onClick: () => void
}

export const IfYouAreLoggedInYouCanLogOut = styled(TopBarIcon).attrs(p => { return { 
  ...p, 
  DefaultIcon: p.DefaultIcon,
  HoverIcon: LogOut, 
  toggledOn: false 
}})<{DefaultIcon: StyledComponent<'img', any>}>``

export const IfYouAreLoggedOutYouCanLogIn = styled(TopBarIcon).attrs(p => { return {
  className: p.className,
  DefaultIcon: Twitch,
  HoverIcon: Twitch,
  toggledOn: false,
  onClick: p.onClick
}})``

export const DefaultHelpIcon = styled(Help).attrs(p => ({...p, viewBox: '2 2 20 20'}))``
export const HoverHelpIcon = styled(Help).attrs(p => ({...p, viewBox: '2 2 20 20'}))``

export const YouCanGetHelpIfYouNeed = styled(TopBarIcon).attrs(p => { return {
  className: p.className,
  DefaultIcon: DefaultHelpIcon,
  HoverIcon: HoverHelpIcon,
  toggledOn: p.toggledOn,
  onClick: p.onClick
}})`

  .svgIcon {
    padding: 2px;
  }

  .hoverIcon {
    fill: ${p => p.theme.colors.info.main};
  }

  &:hover {
    border-color: ${p => p.theme.colors.info.main};
    .hoverIcon {
      fill: white;
      background-color: ${p => p.theme.colors.info.main};
      border-radius: 50%;
    } 
  }

  .toggledOn {
    z-index: 900;
    .hoverIcon {
      fill: ${p => p.theme.colors.info.main};
      background-color: white;
      opacity: 1;
    }
    .defaultIcon {
      opacity: 0;
    }

  }

`

export const UserIcon = styled.img``

export const AuthButton = styled(({className}: { className?: string }) => {

  let user = useAppSelector(selectAppUser)
  let logIn = useContextSelector(AuthContext, ctx => ctx.signinRedirect)
  let logOut = useContextSelector(AuthContext, ctx => ctx.logout)

  // const UserIcon = useMemo(() => user && typeof user.profilePicUrl !== 'undefined' ? styled.img.attrs(p => ({ ...p, src: user?.profilePicUrl }))`
  // ` : undefined, [user])


  return (
    <div className={className}>
      { typeof user != 'undefined' && typeof logOut != 'undefined' ? (
        <IfYouAreLoggedInYouCanLogOut defaultIconSrc={user?.profilePicUrl} onClick={logOut}/>
      ): (
        <IfYouAreLoggedOutYouCanLogIn onClick={logIn}/>
      )}
    </div>
  )

})`
  display: contents;
`

export const TopBarButtons = { IfYouAreLoggedInYouCanLogOut, IfYouAreLoggedOutYouCanLogIn, YouCanGetHelpIfYouNeed, AuthButton }
export default TopBarButtons