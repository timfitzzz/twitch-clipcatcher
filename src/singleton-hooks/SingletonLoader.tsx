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
import { TwitchPrivateMessage } from 'twitch-chat-client/lib/StandardCommands/TwitchPrivateMessage'

// const messageParser = (msg: TwitchPrivateMessage) => {
//   let { target, message } = msg
//   let replyText = msg.tags.get("reply-parent-msg-body")
//   let replyMsgId = msg.tags.get("e6f55087-a031-456c-8657-9c9f74d1015a")
//   if ()
// }

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

  const getVodEpoch = apiClient ? async (vodId: string, offset: number) => {
    return apiClient.helix.videos.getVideoById(vodId).then((video) => {
      if (video) {
        return video.creationDate.getTime() + offset * 1000
      } else {
        return undefined
      }
    }, (err) => { console.log(err); return undefined})
  } : null

  // use msg.tags.get('${tagName}') to discover these
//   {"reply-parent-display-name" => "yolson_13"}
// 10: {"reply-parent-msg-body" => "but I enjoyed the rp"}
// 11: {"reply-parent-msg-id" => "e6f55087-a031-456c-8657-9c9f74d1015a"}
// 12: {"reply-parent-user-id" => "273265751"}
// 13: {"reply-parent-user-login" => "y
// 15: {"subscriber" => "0"}


  useEffect(() => {

    let oldListener = currentMessageListener
    let newListener: Listener | null;

    console.log('getVodEpoch: ', getVodEpoch)

    if (apiClient && chatClient && loggedIn && getClipMeta && getVodEpoch) {
      console.log('setting message listener')
      newListener = chatClient.onMessage((_channel, _user, _message, msg) => {
        let { target, message } = msg;
        let channelName = target.value.substr(1, target.value.length);
        // console.log(channelName)
        if (channelsToScan.indexOf(channelName) > -1) {
          console.log('got message for ', channelName)
          let ClipRegExp: RegExp = /(?:clips.twitch.tv\/|www.twitch.tv\/.*\/)+(?<clipName>[a-zA-Z0-9~!@#$%^&*()_\-=+/.:;',]*)?/g; 
          let clipResult = ClipRegExp.exec(message.value)
          console.log('got clipResult: ', clipResult)
          if (clipResult && clipResult.groups) {
            dispatch(intakeClip({
              channelName,
              clipName: clipResult.groups.clipName,
              msg,
              getClipMeta,
              getVodEpoch
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
      if (currentMessageListener) {
        chatClient?.removeListener(currentMessageListener.event, currentMessageListener.listener)
      }
    })
  }, [chatClient, loggedIn, apiClient, getClipMeta, channelsToScan])

  return (<></>)

}

export default SingletonLoader