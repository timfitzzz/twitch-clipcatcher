/* eslint-ignore @typescript-eslint/no-unused-vars */

// import React, { useEffect, useState } from 'react'
import { useEffect } from 'react';
import { useMemo } from 'react';
import { singletonHook } from 'react-singleton-hook'
import {
  ApiClient
} from 'twitch/lib';
import { useContextSelector } from 'use-context-selector';
import { AuthContext } from '../contexts/AuthContext';
import { useAppDispatch, useAppSelector } from '../hooks/reduxHooks';
import { getUserInfo } from '../redux/actions';
import { selectAppUser, selectUserLoading } from '../redux/selectors';

const init = null

const useApiClientImpl = () => {

  // console.log('rerendering useapiclient')

  const authProvider = useContextSelector(AuthContext, (c) => c.authProvider)
  const user = useContextSelector(AuthContext, (c) => c.user)
  const isAuthenticated = useContextSelector(AuthContext, (c) => c.isAuthenticated)
  const userInfo = useAppSelector(selectAppUser)
  const loadingUser = useAppSelector(state => selectUserLoading(state.settings))
  const dispatch = useAppDispatch() 
  // const [apiClient, setApiClient] = useState<ApiClient | null>(null);

  const apiClient = useMemo(() => {
    if (authProvider) {
      return new ApiClient({ authProvider })
    } else {
      return null
    }
  }, [authProvider])


  useEffect(() => {
    if (isAuthenticated && isAuthenticated() && user && user.profile.preferred_username && !userInfo && apiClient && !loadingUser) {
      dispatch(getUserInfo({ userName: user.profile.preferred_username, apiClient: apiClient}))
    }
  }, [userInfo, loadingUser, apiClient, dispatch, user, isAuthenticated])

  return apiClient

}

export const useApiClient = singletonHook(init, useApiClientImpl)

export default useApiClient