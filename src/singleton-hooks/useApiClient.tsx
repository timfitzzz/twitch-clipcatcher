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

const init = null

const useApiClientImpl = () => {

  // console.log('rerendering useapiclient')

  const authProvider = useContextSelector(AuthContext, (c) => c.authProvider)
  const user = useContextSelector(AuthContext, (c) => c.user)
  const userInfo = useAppSelector(state => state.settings.user)
  const loadingUser = useAppSelector(state => state.settings.userLoading)
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
    if (user && user.profile.preferred_username && !userInfo && apiClient && !loadingUser) {
      dispatch(getUserInfo({ userName: user.profile.preferred_username, apiClient: apiClient}))
    }
  }, [userInfo, loadingUser, apiClient, dispatch, user])

  return apiClient

}

export const useApiClient = singletonHook(init, useApiClientImpl)

export default useApiClient