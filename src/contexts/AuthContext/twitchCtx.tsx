import React, {
  ReactChild,
  ReactChildren,
  useEffect,
  useState,
} from 'react';
import { createContext, useContextSelector } from 'use-context-selector';
import { ChatClient } from 'twitch-chat-client/lib';
import {
  ApiClient,
  StaticAuthProvider,
  TwitchAPICallType,
  TwitchApiCallType,
} from 'twitch/lib';
import { 
  Listener
} from '@d-fischer/typed-event-emitter'
import { OIDCUserData } from '../../types';
import {
  ChannelAction,
  ChannelActions,
  ICatcherChannel,
} from '../ChannelsContext/channelsReducer';
import useTwitchAuth from './useTwitchAuth';
import { TwitchPrivateMessage } from 'twitch-chat-client/lib/StandardCommands/TwitchPrivateMessage';
import { MessageCountStore } from '../ChannelsContext/MessageCountStore';
import { ChannelsContext } from '../ChannelsContext/channelsCtx';

export interface IAuthContext {
  // loggedIn: boolean;
  authProvider: StaticAuthProvider | null;
  user: OIDCUserData | null;
  logout: () => void;
  // addChannel: (channelName: string) => void;
  isAuthenticated: () => boolean;
  signinSilentCallback: () => void;
  signoutRedirectCallback: () => void;
  signinRedirectCallback: () => void;
  signinRedirect: () => void;
  createSigninRequest: () => void;
  // channelsDispatch: (action: ChannelAction) => void;
  // addClipByUrl: (channelName: string, clipUrl: string) => void;
}

export const defaultAuthContext: Partial<IAuthContext> = {
  // loggedIn: false,
  user: null,
};

export const AuthContext = createContext(defaultAuthContext);

export const ClipRegExp: RegExp =
  /https:\/\/clips.twitch.tv\/+([a-zA-Z0-9~!@#$%^&*()_\-=\\+/?.:;',]*)?/g;

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

  // const [loggedIn, setLoggedIn] = useState<boolean>(
  //   defaultAuthContext.loggedIn || false
  // );

  // const channelsState = useContextSelector(ChannelsContext, (c) => c.channels)!
  // const channelsDispatch = useContextSelector(ChannelsContext, (c) => c.channelsDispatch)!
  // const processClip = useContextSelector(ChannelsContext, (c) => c.processClip)!

  // let channelsCount = channelsState && Object.getOwnPropertyNames(channelsState).length

  // useEffect(() => {

  //   if (authProvider) {
  //     const apiClient = new ApiClient({ authProvider });
  //     const chatClient = new ChatClient(authProvider, { webSocket: true });
  //     if (apiClient) {
  //       setApiClient(apiClient);
  //     }
  //     if (chatClient) {
  //       if (!loggedIn) {
  //         setChatClient(chatClient);
  //         chatClient.connect();
  //         chatClient.onRegister(() => {
  //           // console.log('logged into chat')
  //           setLoggedIn(true);
  //         });
  //         chatClient.onJoin((channel: string) => {
  //           // console.log('joined a channel: ' + channel)
  //         });
  //       }
  //     }
  //   }


  // }, [authProvider, loggedIn]);

  // useEffect(() => {
  //   // console.log('scheduling message listener', chatClient, apiClient, loggedIn)

  //   let oldListener = currentMessageListener

  //   if (chatClient && apiClient && loggedIn) {
  //     let newListener = chatClient.onMessage((_channel, _user, _message, msg) => {
  //       // console.log(`handling message; channelsState has ${Object.getOwnPropertyNames(channelsState).length} properties`)
  //       catchClip(msg, apiClient);
  //     });
  //     setCurrentMessageListener(newListener)
  //   } 

  //   if (chatClient && oldListener) {
  //     chatClient.removeListener(oldListener.event, oldListener.listener)
  //   }

  // }, [loggedIn, apiClient, chatClient, channelsCount])



  return (
    <AuthContext.Provider
      value={{
        // addChannel,
        authProvider,
        // loggedIn,
        isAuthenticated,
        signinSilentCallback,
        createSigninRequest,
        logout,
        signoutRedirectCallback,
        signinRedirectCallback,
        signinRedirect,
        user,
        // addClipByUrl,
        // chatClient,
        // apiClient
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
