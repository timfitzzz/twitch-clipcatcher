import React from "react";
import { useContextSelector } from 'use-context-selector'
import { TwitchContext } from "./twitchCtx";

export const Logout = () => {

  const logout = useContextSelector(TwitchContext, (c) => c.logout)

  return <>
              {logout && logout()}
              return <span>loading</span>;
        </>
}