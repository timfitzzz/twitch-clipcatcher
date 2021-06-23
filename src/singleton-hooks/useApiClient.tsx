/* eslint-ignore @typescript-eslint/no-unused-vars */

// import React, { useEffect, useState } from 'react'
import { useMemo } from 'react';
import { singletonHook } from 'react-singleton-hook'
import {
  ApiClient
} from 'twitch/lib';
import { useContextSelector } from 'use-context-selector';
import { AuthContext } from '../contexts/AuthContext';

const init = null

const useApiClientImpl = () => {

  console.log('rerendering useapiclient')

  const authProvider = useContextSelector(AuthContext, (c) => c.authProvider)
  // const [apiClient, setApiClient] = useState<ApiClient | null>(null);

  const apiClient = useMemo(() => {
    if (authProvider) {
      return new ApiClient({ authProvider })
    } else {
      return null
    }
  }, [authProvider])


  return apiClient

}

export const useApiClient = singletonHook(init, useApiClientImpl)

export default useApiClient