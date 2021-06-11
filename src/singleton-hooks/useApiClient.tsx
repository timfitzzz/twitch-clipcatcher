import React, { useEffect, useState } from 'react'
import { singletonHook } from 'react-singleton-hook'
import {
  ApiClient, TwitchApiCallType,
} from 'twitch/lib';
import { useContextSelector } from 'use-context-selector';
import { AuthContext } from '../contexts/AuthContext';

const init = { apiClient: null, getClipMeta: null}

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


  const getClipMeta = apiClient ? async (clipSlug: string, apiClient: ApiClient) => {
    return apiClient
      .callApi({
        type: TwitchApiCallType.Kraken,
        url: `/clips/${clipSlug}`,
      })
      .then((clip) => {
        return clip;
      });
  } : null


  return {
    apiClient: apiClient, 
    getClipMeta: getClipMeta
  }

}

export const useApiClient = singletonHook({ apiClient: null, getClipMeta: null}, useApiClientImpl)

export default useApiClient