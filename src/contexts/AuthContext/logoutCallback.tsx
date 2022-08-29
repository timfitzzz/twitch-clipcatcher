import React from "react";
import { useContextSelector } from 'use-context-selector';
import { AuthContext } from './authCtx';

export const LogoutCallback = () => {

    const signoutRedirectCallback = useContextSelector(AuthContext, (c) => c.signoutRedirectCallback)

    return <>
              {signoutRedirectCallback && signoutRedirectCallback()}
              return <span>loading</span>;
          </>
}