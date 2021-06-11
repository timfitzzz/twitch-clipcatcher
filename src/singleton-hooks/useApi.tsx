import React, { useEffect, useState } from 'react'
import { singletonHook } from 'react-singleton-hook'
import {
  ApiClient, TwitchApiCallType,
} from 'twitch/lib';
import { useContextSelector } from 'use-context-selector';
import { AuthContext } from '../contexts/AuthContext';

const init = null

const useApiClientImpl = () => {

  const authProvider = useContextSelector(AuthContext, (c) => c.authProvider)
  const [apiClient, setApiClient] = useState<ApiClient | null>(null);

  useEffect(() => {
    if (authProvider && !apiClient) {
      const apiClient = new ApiClient({ authProvider });
      if (apiClient) {
        setApiClient(apiClient);
      }
    }

    return (() => {
      setApiClient(null)
    })

  }, [authProvider]);


  const getClipMeta = async (clipSlug: string, apiClient: ApiClient) => {
    return apiClient
      .callApi({
        type: TwitchApiCallType.Kraken,
        url: `/clips/${clipSlug}`,
      })
      .then((clip) => {
        return clip; 
      });
  };


  return {apiClient, getClipMeta}

}

export const useApiClient = singletonHook(init, useApiClientImpl)

export default useApiClient