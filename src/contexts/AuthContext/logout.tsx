import React from "react";
import { useContextSelector } from 'use-context-selector'
import { AuthContext } from "./twitchCtx";

export const Logout = () => {

  const logout = useContextSelector(AuthContext, (c) => c.logout)

  return <>
              {logout && logout()}
              return <span>loading</span>;
        </>
}