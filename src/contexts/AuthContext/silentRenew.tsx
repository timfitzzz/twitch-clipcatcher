import React from "react";
import { useContextSelector } from 'use-context-selector'
import { AuthContext } from "./authCtx";

export const SilentRenew = () => {

  const signinSilentCallback = useContextSelector(AuthContext, (c) => c.signinSilentCallback)

  return <>
          { signinSilentCallback && signinSilentCallback() }
          <span>loading</span>
        </>
}