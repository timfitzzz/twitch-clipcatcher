import React, { useMemo } from 'react'
import styled from 'styled-components'
import { Twitch } from '@styled-icons/feather/Twitch'
import { LogOut } from '@styled-icons/feather/LogOut'
import { ButtonCard } from './ButtonCards'
import { useContextSelector } from 'use-context-selector'
import { AuthContext } from '../../contexts/AuthContext'
import { useAppSelector } from '../../hooks/reduxHooks'

const TwitchUserIcon = styled.img`
  width: 35px;
  height: 35px;
  border-radius: 50%;
`

const TwitchLoginIcon = styled(Twitch)`
  margin-top: 4px;
  margin-left: 2.5px;
  width: 25px;
  height: 25px;
  opacity: 1;
`

const InactiveTwitchLoginIcon = styled(Twitch)`
position: relative;
display: inline-flex;
margin-top: 6px;
margin-left: 5.5px;
margin-bottom: auto;
margin-right: auto;
width: 25px;
height: 25px;
opacity: 1;

`

const AuthButtonCard = styled(ButtonCard)`
  border-color: black;
  border-width: 2px;
  border-color: ${p => p.theme.colors.quartenary.dark};
  border-radius: 50%;
  margin: 4px;
  width: 39.5px;
  height: 39.5px;

  &:hover {
    border-color: white;
  }
`

const LogoutIndicatorLayer = styled(({className, onClick}: {className?: string, onClick?: () => void}) => {
  return (
    <div onClick={onClick} className={className}>
      <LogOut/>
    </div>)
})`
  position: absolute;
  width: 45px;
  height: 45px;
  box-sizing: border-box;
  border-radius: 50%;
  left: -5px;
  top: -5px;
  svg {
       
    position: relative;
    width: 32px;
    padding: 4px;
    margin-top: 2px;
    margin-left: 4px;
    transition: margin-left 0.1s, margin-top 0.1s;
  }
  background: linear-gradient(${p => p.theme.colors.warning.light}, ${p => p.theme.colors.warning.main});
  border: 0px solid ${p => p.theme.colors.warning.main};
  opacity: 0;
  &:hover {
    border: 2px solid ${p => p.theme.colors.warning.main};
    opacity: 1;
    transition: opacity 0.1s, border-width 0.1s;

    svg {
      margin-top: 0px;
      margin-left: 2px;

      transition: margin-left 0.1s, margin-top 0.1s;
    }
  }
  transition: opacity 0.1s, border-width 0.1s;
`

const LoginIndicatorLayer = styled(({className, onClick}: {className?: string, onClick?: () => void}) => {
  return (
    <div onClick={onClick} className={className}>
      <div id={'outer'}></div>
      <div id={'inner'}></div>
      <TwitchLoginIcon/>
    </div>)
})`
position: absolute;
width: 45px;
height: 45px;
box-sizing: border-box;
border-radius: 50%;
left: -4px;
top: -4px;
background-color: transparent;

#outer {
  background: linear-gradient(${p => p.theme.colors.info.light}, ${p => p.theme.colors.info.main});
  position: absolute;
  width: 45.5px;
  height: 45.5px;
  border-radius: 50%;
  left: -1px;
  top: -1px;
  opacity: 0;
}

#inner {
  background: transparent;
  position: absolute;
  border: 2px solid white;
  width: 35.5px;
  height: 35.5px;
  border-radius: 50%;
  left: 2px;
  top: 2px;
  z-index: 10;
  opacity: 0;
}

svg {
     
  position: relative;
  width: 36px;
  padding: 8px;
  margin-top: 2px;
  margin-left: -4px;
  color: white;
  opacity: 0;

  transition: margin-left 0.1s, margin-top 0.1s;
  z-index: 10;
}

&:hover {
  #inner {
    opacity: 1;
    transition: opacity 0.1s;
  }
  #outer {
    opacity: 1;
    transition: opacity 0.1s;
  }
  svg {
    opacity: 1;
  }

}
// border: 0px solid ${p => p.theme.colors.info.main};
// opacity: 0;
//   &:hover {
//   border: 3px solid ${p => p.theme.colors.info.main};
//   opacity: 1;
//   
//   > div {
//     top: 2px;
//     left: 2px;
//   }
//   svg {
//     margin-top: -2px;
//     margin-left: -6px;

//     transition: margin-left 0.1s, margin-top 0.1s;
//   }
// }
// transition: opacity 0.1s, border-width 0.1s;
`

export const AuthButton = () => {
  let isAuthenticated = useContextSelector(AuthContext, ctx => ctx.isAuthenticated)
  let logIn = useContextSelector(AuthContext, ctx => ctx.signinRedirect)
  let logout = useContextSelector(AuthContext, ctx => ctx.logout)
  let user = useAppSelector(state => state.settings.user)

  let loggedIn = useMemo(() => isAuthenticated ? isAuthenticated() : false, [isAuthenticated])

  return (
    <AuthButtonCard>
      { loggedIn && user && user.profilePicUrl ? (
        <TwitchUserIcon src={user.profilePicUrl}/>
      ) : (
        <InactiveTwitchLoginIcon onClick={logIn}/>
      )}
      { loggedIn ? (
          <LogoutIndicatorLayer onClick={logout}/>
      ) : ( 
          <LoginIndicatorLayer onClick={logIn}/>
      )}
    </AuthButtonCard>
  )
}

export default AuthButton