import { useEffect, useMemo, useState } from 'react'
import { StaticAuthProvider } from '@twurple/auth'
import { useAppDispatch } from '../../hooks/reduxHooks'
import { userLoggedOut } from '../../redux/settings'
import { OIDCUserData } from '../../types'
import AuthService from './authService'

const authService = new AuthService()

const useTwitchAuth = () => {

  let [user, setUser] = useState<OIDCUserData | null>(null)
  let [authProvider, setAuthProvider] = useState<StaticAuthProvider|null>(null)
  let dispatch = useAppDispatch()

  const { clientId, getUser, signinRedirectCallback, logout, signoutRedirectCallback, isAuthenticated, signinRedirect, signinSilentCallback, createSigninRequest } = authService

  const isAuth = isAuthenticated()

  const handleLogout = useMemo(() => () => {
    logout().then(result => {
      setUser(null)
      dispatch(userLoggedOut())
    })
  },[dispatch, logout])

  useEffect(() => {
    if (isAuth && getUser) {
      // console.log('getting user')
      getUser().then((user: OIDCUserData) => setUser(user as OIDCUserData))
    }
  }, [isAuth, getUser])

  useEffect(() => {
    if (user) {
      // console.log(`setting auth provider with token: ` + user.access_token)
      let newAuthProvider = new StaticAuthProvider(clientId, user.access_token)
      setAuthProvider(newAuthProvider)
    } else {
      setAuthProvider(null)
    }
  },[user, clientId])

  return {
    authProvider,
    user,
    signinRedirectCallback,
    logout: handleLogout,
    signoutRedirectCallback,
    isAuthenticated,
    signinRedirect,
    signinSilentCallback,
    createSigninRequest
  }

}

export default useTwitchAuth