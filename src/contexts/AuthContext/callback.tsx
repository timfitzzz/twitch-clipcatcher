/* /src/components/auth/callback.jsx */
import React from "react";
import { useContextSelector } from 'use-context-selector'
import { AuthContext } from ".";

export const Callback = () => {

  const signinRedirectCallback = useContextSelector(AuthContext, (c) => c.signinRedirectCallback)

  return <>
          { signinRedirectCallback && signinRedirectCallback() }
            <span>loading</span>
        </>
}