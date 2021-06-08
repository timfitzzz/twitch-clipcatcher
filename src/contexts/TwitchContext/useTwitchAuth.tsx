import React, { useEffect, useMemo, useState } from 'react'
import { StaticAuthProvider, User } from 'twitch/lib'
import { OIDCUserData } from '../../types'
import AuthService from './authService'
import { defaultTwitchContext } from './twitchCtx'

const authService = new AuthService()

const useTwitchAuth = () => {

  let [user, setUser] = useState<OIDCUserData | null>(null)
  let [authProvider, setAuthProvider] = useState<StaticAuthProvider|null>(null)

  const { clientId, getUser, signinRedirectCallback, logout, signoutRedirectCallback, isAuthenticated, signinRedirect, signinSilentCallback, createSigninRequest } = authService

  useEffect(() => {
    if (isAuthenticated() && getUser) {
      // console.log('getting user')
      getUser().then((user: OIDCUserData) => setUser(user as OIDCUserData))
    }
  }, [isAuthenticated()])

  useEffect(() => {
    if (user) {
      // console.log(`setting auth provider with token: ` + user.access_token)
      setAuthProvider(new StaticAuthProvider(clientId, user.access_token))
    }
  },[user])

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