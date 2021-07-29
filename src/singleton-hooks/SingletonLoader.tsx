/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useMemo, useState } from 'react'
import useApiClient from './useApiClient'
import useChatClient from './useChatClient'
import { Listener } from '@d-fischer/typed-event-emitter'
import { useAppDispatch } from '../hooks/reduxHooks';
import { intakeClip, intakeReply, messageRemoved, userTimedOut } from '../redux/actions';
import { MessageCountStore } from '../contexts/ChannelsContext/MessageCountStore';
import { TwitchApiCallType } from 'twitch/lib'
import { parseUserType } from '../utilities/parsers';

// const messageParser = (msg: TwitchPrivateMessage) => {
//   let { target, message } = msg
//   let replyText = msg.tags.get("reply-parent-msg-body")
//   let replyMsgId = msg.tags.get("e6f55087-a031-456c-8657-9c9f74d1015a")
//   if ()
// }

// 7/10: adding {6,} to specify that clip name will be at least 6 characters, to avoid falsely matching channelname/clips
// 7/10: removing . from capture group to avoid confusion if user adds period to end of link (end of sentence) under assumption
//       that probably there's not going to be a period in a clip url
let ClipRegExp: RegExp = /(?:(?:https:\/\/)*(?:clips.twitch.tv\/|www.twitch.tv\/.*\/))+(?<clipSlug>[-a-zA-Z0-9~!@#$%^&*()_=+:;',]{6,})/g;
let wordsRegExp: RegExp = /(?:@)+|(?:\?.*=.*)+/gm

interface ModerationListeners {
  onMessageRemove?: Listener
  onTimeout?: Listener
}

const SingletonLoader = () => {

  // console.log('rerendering singleton loader')

  const apiClient = useApiClient()
  const { chatClient, loggedIn } = useChatClient()
  const [currentMessageListener, setCurrentMessageListener] = useState<Listener | null>(null)
  const [currentModerationListeners, setCurrentModerationListeners] = useState<ModerationListeners>({})
  // const [currentUpdateSchedulerId, setCurrentUpdateSchedulerId] = useState<number | null>(null)

  const dispatch = useAppDispatch()
  // const channelsToScan = useAppSelector(state => Object.getOwnPropertyNames(state.channels).filter(channelName => state.channels[channelName].scanning), shallowEqual)

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

  useEffect(() => {

    let oldListener = currentMessageListener
    let newListener: Listener | null;

    if (apiClient && chatClient && loggedIn && getClipMeta && getVodEpoch) {
      newListener = chatClient.onMessage((_channel, _user, _message, msg) => {
        let { target, message } = msg;
        let channelName = target.value.substr(1, target.value.length);
        let replyParentId = msg.tags.get('reply-parent-msg-id')
        ClipRegExp.lastIndex = 0;
        let clipResult = ClipRegExp.exec(message.value)
        if (replyParentId || clipResult) {
          let messageText = message.value
          // we'll process all replies, and any non reply with a clip
          let words: string[];
          if (clipResult && clipResult.groups) {
            words = messageText.replace(clipResult[0].toString(), "").toLocaleLowerCase().split(" ")
          } else {
            words = messageText.toLocaleLowerCase().split(" ")
          }
          wordsRegExp.lastIndex = 0;
          words = words.filter(word => 
            word === "+1" ||
            word === "-1" ||
            (word.length > 2 && !wordsRegExp.exec(word)))
          let sub = msg.tags.get('subscriber')

          if (replyParentId) {
            dispatch(intakeReply({
              channelName,
              clipSlug: clipResult && clipResult.groups ? clipResult.groups.clipSlug : undefined,
              messageId: msg.id,
              parentMessageId: replyParentId,
              words,
              userName: msg.userInfo.userName,
              userTypes: parseUserType(msg.userInfo, sub ? parseInt(sub) as 0 | 1 : 0),
              getClipMeta,
              getVodEpoch
            }))
          } else if (clipResult && clipResult.groups) {
            // console.log(channelName, clipResult.groups.clipSlug, getClipMeta)
            dispatch(intakeClip({
              channelName,
              userName: msg.userInfo.userName,
              words,
              clipSlug: clipResult.groups.clipSlug,
              userTypes: parseUserType(msg.userInfo, sub ? parseInt(sub) as 0 | 1 : 0),
              messageId: msg.id,
              getClipMeta,
              getVodEpoch
            }))
          }
        }
        MessageCountStore.incrementChannelCount(channelName)
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
  }, [chatClient, loggedIn, apiClient, getClipMeta, getVodEpoch])

  // SCHEDULE PERIODIC UPDATES
  // useEffect(() => {
  //   if (chatClient) {
  //     chatClient.onTimeout
  //   }
  // })

  // schedule listeners for moderation actions
  useEffect(() => {
    let oldListeners = currentModerationListeners
    let newListeners: ModerationListeners = {}

    if (chatClient && loggedIn) {
      newListeners.onMessageRemove = chatClient.onMessageRemove((_channel, messageId) => {
        dispatch(messageRemoved({ messageId }))
      })

      if (oldListeners.onMessageRemove) {
        chatClient.removeListener(oldListeners.onMessageRemove.event, oldListeners.onMessageRemove.listener)
      }

      newListeners.onTimeout = chatClient.onTimeout((channel, user) => {
        let channelName = channel.substr(1, channel.length);
        dispatch(userTimedOut({channelName, userName: user }))
      })

      if (oldListeners.onTimeout) {
        chatClient.removeListener(oldListeners.onTimeout.event, oldListeners.onTimeout.event)
      }
    }

    setCurrentModerationListeners(newListeners)

    return (() => {
      if (chatClient && currentModerationListeners) {
        if (currentModerationListeners.onMessageRemove) {
          chatClient.removeListener(currentModerationListeners.onMessageRemove.event, currentModerationListeners.onMessageRemove.listener)
        }
        if (currentModerationListeners.onTimeout) {
          chatClient.removeListener(currentModerationListeners.onTimeout.event, currentModerationListeners.onTimeout.listener)
        }
      }
    })
  }, [chatClient, loggedIn])


  return (<></>)

}

export default SingletonLoader