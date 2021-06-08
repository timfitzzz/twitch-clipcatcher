/* /src/components/auth/callback.jsx */
import React from "react";
import { useContextSelector } from 'use-context-selector'
import { TwitchContext } from ".";

export const Callback = () => {

  const signinRedirectCallback = useContextSelector(TwitchContext, (c) => c.signinRedirectCallback)

  return <>
          { signinRedirectCallback && signinRedirectCallback() }
            <span>loading</span>
        </>
}