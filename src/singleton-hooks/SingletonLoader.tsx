import React, { useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import { useContextSelector } from 'use-context-selector'
import { AuthContext } from '../contexts/AuthContext'
import useApiClient from './useApiClient'
import useChatClient from './useChatClient'
import { Listener } from '@d-fischer/typed-event-emitter'
import { useAppDispatch, useAppSelector } from '../hooks/reduxHooks';
import { intakeClip } from '../redux/channels';
import { intakeReply } from '../redux/messages';
import { MessageCountStore } from '../contexts/ChannelsContext/MessageCountStore';
import { ChatClient } from 'twitch-chat-client/lib'
import { TwitchApiCallType } from 'twitch/lib'
import { shallowEqual } from 'react-redux'
import { TwitchPrivateMessage } from 'twitch-chat-client/lib/StandardCommands/TwitchPrivateMessage'
import { parseUserType } from '../redux/clips'

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

  const getVodEpoch = useMemo(() => apiClient ? async (vodId: string, offset: number): Promise<number | undefined> => {
    return apiClient.helix.videos.getVideoById(vodId).then((video) => {
      if (video) {
        return video.creationDate.getTime() + offset * 1000
      } else {
        return undefined
      }
    }, (err) => { console.log(err); return undefined})
  } : null, [apiClient])

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

    if (apiClient && chatClient && loggedIn && getClipMeta && getVodEpoch) {
      console.log('setting message listener')
      newListener = chatClient.onMessage((_channel, _user, _message, msg) => {
        let { target, message } = msg;
        let channelName = target.value.substr(1, target.value.length);

        if (channelsToScan.indexOf(channelName) > -1) {
          
          let replyParentId = msg.tags.get('reply-parent-msg-id')
          if (replyParentId) {
            let tags = message.value.split(" ")
            let sub = msg.tags.get('subscriber')
            dispatch(intakeReply({
              channelName,
              messageId: msg.id,
              parentMessageId: replyParentId,
              tags: tags,
              messageText: message.value,
              userName: msg.userInfo.userName,
              userTypes: parseUserType(msg.userInfo, sub ? parseInt(sub) as 0 | 1 : 0)
            }))
          }

          let ClipRegExp: RegExp = /(?:[https://]*clips.twitch.tv\/|www.twitch.tv\/.*\/)+(?<clipName>[a-zA-Z0-9~!@#$%^&*()_\-=+/.:;',]+-{1}[a-zA-Z0-9~!@#$%^&*()_\-=+/.:;',]+)/g;
          let clipResult = ClipRegExp.exec(message.value)
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
  }, [chatClient, loggedIn, apiClient, getClipMeta, getVodEpoch, channelsToScan])

  return (<></>)

}

export default SingletonLoader