import React, {
  ReactChild,
  ReactChildren,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from 'react';
import { createContext } from 'use-context-selector';
import { Message } from 'ircv3';
import { ChatClient } from 'twitch-chat-client/lib';
import {
  ApiClient,
  User,
  TwitchAPICallType,
  TwitchApiCallType,
} from 'twitch/lib';
import { 
  Listener
} from '@d-fischer/typed-event-emitter'
import { OIDCUserData } from '../../types';
import AuthService from './authService';
import useChannelsReducer, {
  ChannelAction,
  ChannelActions,
  ICatcherChannel,
} from '../ChannelsContext/useChannelsReducer';
import useTwitchAuth from './useTwitchAuth';
import { TwitchPrivateMessage } from 'twitch-chat-client/lib/StandardCommands/TwitchPrivateMessage';
import { MessageCountStore } from './MessageCountStore';

export interface ITwitchContext {
  loggedIn: boolean;
  user: OIDCUserData | null;
  channels: {
    [channelName: string]: ICatcherChannel;
  };
  logout: () => void;
  addChannel: (channelName: string) => void;
  isAuthenticated: () => boolean;
  signinSilentCallback: () => void;
  signoutRedirectCallback: () => void;
  signinRedirectCallback: () => void;
  signinRedirect: () => void;
  createSigninRequest: () => void;
  channelsDispatch: (action: ChannelAction) => void;
  addClipByUrl: (channelName: string, clipUrl: string) => void;
}

export const defaultTwitchContext: Partial<ITwitchContext> = {
  loggedIn: false,
  user: null,
  channels: {},
};

export const TwitchContext = createContext(defaultTwitchContext);

export const ClipRegExp: RegExp =
  /https:\/\/clips.twitch.tv\/+([a-zA-Z0-9\~\!\@\#\$\%\^\&\*\(\)_\-\=\+\\\/\?\.\:\;\'\,]*)?/g;

const TwitchContextProvider = ({
  children,
}: {
  children?: ReactChild | ReactChildren;
}) => {
  const [apiClient, setApiClient] = useState<ApiClient | null>(null);
  const [chatClient, setChatClient] = useState<ChatClient | null>(null);
  const [loggedIn, setLoggedIn] = useState<boolean>(
    defaultTwitchContext.loggedIn || false
  );
  const [channelsState, channelsDispatch, scheduleCountUpdate, parseClip] =
    useChannelsReducer();

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

  const addClipByUrl = (channelName: string, clipUrl: string) => {
    let splitUrl = clipUrl.split('/');
    if (apiClient) {
      apiClient
        .callApi({
          type: TwitchAPICallType.Kraken,
          url: `/clips/${splitUrl[splitUrl.length - 1]}`,
        })
        .then((clip) => {
          if (clip) {
            channelsDispatch({
              type: ChannelActions.ADD_CLIP,
              payload: [channelName, clip],
            });
          }
        });
    }
  };

  useEffect(() => {

    if (authProvider) {
      const apiClient = new ApiClient({ authProvider });
      const chatClient = new ChatClient(authProvider, { webSocket: true });
      if (apiClient) {
        setApiClient(apiClient);
      }
      if (chatClient) {
        if (!loggedIn) {
          setChatClient(chatClient);
          chatClient.connect();
          chatClient.onRegister(() => {
            // console.log('logged into chat')
            setLoggedIn(true);
          });
          chatClient.onJoin((channel: string) => {
            // console.log('joined a channel: ' + channel)
          });
        }
      }
    }


  }, [authProvider]);

  useEffect(() => {
    let messageListener: Listener | null = null;

    if (chatClient && apiClient && loggedIn) {
      messageListener = chatClient.onMessage((_channel, _user, _message, msg) => {
        // console.log(`handling message; channelsState has ${Object.getOwnPropertyNames(channelsState).length} properties`)
        catchClip(msg, apiClient);
      });
    } 
    
    return (() => {
      if (chatClient && messageListener) {
        // console.log('removing message listener')
        chatClient.removeListener(messageListener.event, messageListener.listener)
      }
    })
  }, [loggedIn, channelsState])

  const getClipMeta = async (clipSlug: string, apiClient: ApiClient) => {
    return apiClient
      .callApi({
        type: TwitchApiCallType.Kraken,
        url: `/clips/${clipSlug}`,
      })
      .then((clip) => {
        return clip;
      });
  };

  const catchClip = (msg: TwitchPrivateMessage, apiClient: ApiClient) => {
    let { message, target } = msg;
    let channelName = target.value.substr(1, target.value.length);
    if (message && apiClient) {
      if (message.value.indexOf('clips.twitch.tv') !== -1) {
        let clipText = ClipRegExp.exec(message.value);
        if (clipText && clipText.length > 0) {
          getClipMeta(clipText[1], apiClient)
            .then((clip) => {
              // console.log('found clip: ', clip);
              clip.postedBy = [msg.userInfo];
              // console.log(
              //   'channelsState before calling parseClip: ',
              //   channelsState
              // );
              parseClip(clip, channelName);
            })
            .catch((err) => {
              // console.log('clip could not be found: ', err);
            });
        }
      }
    }
    MessageCountStore.incrementChannelCount(channelName);
    scheduleCountUpdate(channelName);
  };

  const addChannel = (channelName: string) => {
    if (chatClient) {
      channelsDispatch({
        type: ChannelActions.ADD_CHANNEL,
        payload: channelName,
      });
      if (loggedIn) {
        chatClient.join(channelName);
      } else {
        chatClient.onRegister(() => {
          chatClient?.join(channelName);
        });
        chatClient.connect();
      }
    }
  };

  return (
    <TwitchContext.Provider
      value={{
        addChannel,
        loggedIn,
        isAuthenticated,
        signinSilentCallback,
        createSigninRequest,
        logout,
        signoutRedirectCallback,
        signinRedirectCallback,
        signinRedirect,
        user,
        channels: channelsState,
        channelsDispatch,
        addClipByUrl,
      }}
    >
      {children}
    </TwitchContext.Provider>
  );
};

export default TwitchContextProvider;
