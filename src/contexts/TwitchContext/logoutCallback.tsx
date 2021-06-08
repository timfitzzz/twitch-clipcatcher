import React from "react";
import { useContextSelector } from 'use-context-selector';
import { TwitchContext } from './twitchCtx';

export const LogoutCallback = () => {

    const signoutRedirectCallback = useContextSelector(TwitchContext, (c) => c.signoutRedirectCallback)

    return <>
              {signoutRedirectCallback && signoutRedirectCallback()}
              return <span>loading</span>;
          </>
}