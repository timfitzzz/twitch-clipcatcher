import React, {
  ReactChild,
  ReactChildren,
} from 'react';
import { createContext } from 'use-context-selector';
import {
  StaticAuthProvider,
} from '@twurple/auth';
import { OIDCUserData } from '../../types';
import useTwitchAuth from './useTwitchAuth';


export interface IAuthContext {
  authProvider: StaticAuthProvider | null
  user: OIDCUserData | null
  logout: () => void
  isAuthenticated: () => boolean
  signinSilentCallback: () => void
  signoutRedirectCallback: () => void
  signinRedirectCallback: () => void
  signinRedirect: () => void
  createSigninRequest: () => void
}

export const defaultAuthContext: Partial<IAuthContext> = {
  // loggedIn: false,
  user: null,
};

export const AuthContext = createContext(defaultAuthContext);

// export const ClipRegExp: RegExp =
//   /https:\/\/clips.twitch.tv\/+([a-zA-Z0-9~!@#$%^&*()_\-=\\+/?.:;',]*)?/g;

const AuthContextProvider = ({
  children,
}: {
  children?: ReactChild | ReactChildren | ReactChild[];
}) => {

  const {
    authProvider,
    user,
    signinRedirectCallback,
    logout,
    signoutRedirectCallback,
    isAuthenticated,
    signinRedirect,
    signinSilentCallback,
    createSigninRequest,
  } = useTwitchAuth();

  return (
    <AuthContext.Provider
      value={{
        authProvider,
        isAuthenticated,
        signinSilentCallback,
        createSigninRequest,
        logout,
        signoutRedirectCallback,
        signinRedirectCallback,
        signinRedirect,
        user
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
