import { useEffect, useState } from 'react'
import { StaticAuthProvider } from 'twitch/lib'
import { OIDCUserData } from '../../types'
import AuthService from './authService'

const authService = new AuthService()

const useTwitchAuth = () => {

  let [user, setUser] = useState<OIDCUserData | null>(null)
  let [authProvider, setAuthProvider] = useState<StaticAuthProvider|null>(null)

  const { clientId, getUser, signinRedirectCallback, logout, signoutRedirectCallback, isAuthenticated, signinRedirect, signinSilentCallback, createSigninRequest } = authService

  const isAuth = isAuthenticated()

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
    }
  },[user, clientId])

  return {
    authProvider,
    user,
    signinRedirectCallback,
    logout,
    signoutRedirectCallback,
    isAuthenticated,
    signinRedirect,
    signinSilentCallback,
    createSigninRequest
  }

}

export default useTwitchAuth