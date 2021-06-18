import React, { useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import { useContextSelector } from 'use-context-selector'
import { AuthContext } from '../contexts/AuthContext'
import useApiClient from './useApiClient'
import useChatClient from './useChatClient'
import { Listener } from '@d-fischer/typed-event-emitter'
import { useAppDispatch, useAppSelector } from '../hooks/reduxHooks';
import { intakeClip } from '../redux/channels';
import { MessageCountStore } from '../contexts/ChannelsContext/MessageCountStore';
import { ChatClient } from 'twitch-chat-client/lib'
import { TwitchApiCallType } from 'twitch/lib'
import { shallowEqual } from 'react-redux'

const SingletonLoader = () => {

  console.log('rerendering singleton loader')

  const apiClient = useApiClient()
  const { chatClient, loggedIn } = useChatClient()
  const [currentMessageListener, setCurrentMessageListener] = useState<Listener | null>(null)
  const dispatch = useAppDispatch()
  const channelsToScan = useAppSelector(state => Object.getOwnPropertyNames(state.channels).filter(channelName => state.channels[channelName].scanning), shallowEqual)

  const getClipMeta = useMemo(() => apiClient ? async (clipSlug: string) => {
    return apiClient
      .callApi({
        type: TwitchApiCallType.Kraken,
        url: `/clips/${clipSlug}`,
      })
      .then((clip) => {
        return clip;
      });
  } : null, [apiClient])

  useEffect(() => {

    let oldListener = currentMessageListener
    let newListener: Listener | null;

    if (apiClient && chatClient && loggedIn && getClipMeta) {
      console.log('setting message listener')
      newListener = chatClient.onMessage((_channel, _user, _message, msg) => {
        let { target, message } = msg;
        let channelName = target.value.substr(1, target.value.length);
        // console.log(channelName)
        if (channelsToScan.indexOf(channelName) > -1) {
          // console.log('got message for ', channelName)
          let ClipRegExp: RegExp = /(?:clips.twitch.tv\/|www.twitch.tv\/.*\/)+(?<clipName>[a-zA-Z0-9~!@#$%^&*()_\-=+/.:;',]*)?/g; 
          let clipResult = ClipRegExp.exec(message.value)
          if (clipResult && clipResult.groups) {
            dispatch(intakeClip({
              channelName,
              clipName: clipResult.groups.clipName,
              msg,
              getClipMeta
            }))
          }
          MessageCountStore.incrementChannelCount(channelName)
        }
      })

      if (oldListener) {
        chatClient.removeListener(oldListener.event, oldListener.listener)
      }

      setCurrentMessageListener(newListener || null)    
    }
    

    return (() => {
    })
  }, [chatClient, loggedIn, apiClient, getClipMeta, channelsToScan])

  return (<></>)

}

export default SingletonLoader