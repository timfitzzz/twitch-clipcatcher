import React from "react";
import { useContextSelector } from 'use-context-selector'
import { TwitchContext } from "./twitchCtx";

export const SilentRenew = () => {

  const signinSilentCallback = useContextSelector(TwitchContext, (c) => c.signinSilentCallback)

  return <>
          { signinSilentCallback && signinSilentCallback() }
          <span>loading</span>
        </>
}