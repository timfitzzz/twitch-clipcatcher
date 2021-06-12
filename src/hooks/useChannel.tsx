import { useEffect, useState } from 'react'
import { Listener } from '@d-fischer/typed-event-emitter'
import { TwitchPrivateMessage } from 'twitch-chat-client/lib/StandardCommands/TwitchPrivateMessage'
import { useContextSelector } from 'use-context-selector'
import { ChannelActions, ChannelsContext } from '../contexts/ChannelsContext'
import useApiClient from '../singleton-hooks/useApiClient'
import useChatClient from '../singleton-hooks/useChatClient'
import { CaughtClip } from '../types'
import { MessageCountStore } from '../contexts/ChannelsContext/MessageCountStore'

const useChannel = (channelName: string) => {

  console.log('rendering usechannel')

  const { apiClient, getClipMeta } = useApiClient()
  const { chatClient, loggedIn } = useChatClient()
  const channel = useContextSelector(ChannelsContext, (c) => c.channels && c.channels[channelName])
  const clipsLength = useContextSelector(ChannelsContext, (c) => c.channels && c.channels[channelName].clips.length)
  const channelsDispatch = useContextSelector(ChannelsContext, (c) => c.channelsDispatch)
  // const clipsLength = useMemo(() => channel && channel.clips && channel.clips.length, [channel.clips])

  const [currentMessageListener, setCurrentMessageListener] = useState<Listener | null>(null)
  const [joined, setJoined] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const processClip = (clip: CaughtClip, channelName: string) => {
    let clipExists = -1;
    if (channel && channelsDispatch) {
      channel.clips.forEach((foundClip, index) => {
        // console.log(clip.slug, foundClip.slug)
        if (clip.slug === foundClip.slug) {
          // console.log(`clip ${clip.slug} exists, adding new poster: `, clip.postedBy)
          clipExists = index;
          channelsDispatch({
            type: ChannelActions.UPDATE_CLIP_POSTED_BY,
            payload: [channelName, clip, index],
          });
        }
      });
  
      if (clipExists === -1) {
        // console.log(`clip ${clip.slug} does not exist, adding new`)
        channelsDispatch({
          type: ChannelActions.ADD_CLIP,
          payload: [channelName, clip],
        });
      }
    }
  };

  // preprocess clip using existing metadata for convenience
  const preProcessClip = (clip: CaughtClip, msg: TwitchPrivateMessage): CaughtClip => {
    clip.postedBy = [msg.userInfo]
    clip.postedByMod = msg.userInfo.isMod
    clip.postedByBroadcaster = msg.userInfo.isBroadcaster
    clip.postedByVip = msg.userInfo.isVip
    console.log(msg)
    return clip
  }

  // // join / part channel
  // useEffect(() => {
  //   console.log('join part channel: ', chatClient, joined, error, loggedIn)
  //   if (chatClient && !joined && !error && loggedIn) {
  //     chatClient.join(channelName).then((success) => setJoined(true), (err) => setError(err));
  //     setJoined(true)
  //   }

  //   return (() => {
  //     if (chatClient && joined && !error && (typeof channel === 'undefined')) {
  //       chatClient.part(channelName)
  //       setJoined(false)
  //     }
  //   })
  // }, [joined, error, chatClient, loggedIn, channel, channelName])


  // schedule message listener
  // useEffect(() => {
  //   console.log('rescheduling message listener')
  //   // console.log('scheduling message listener', chatClient, apiClient, loggedIn)

  //   let oldListener = currentMessageListener
  //   let newListener: Listener;

  //   if (chatClient && apiClient && joined) {
  //     newListener = chatClient.onMessage((_channel, _user, _message, msg) => {
  //       // console.log(msg)
  //       let { target } = msg;
  //       let msgChannelName = target.value.substr(1, target.value.length);

  //       if (msgChannelName === channelName) {
  //         let { message } = msg;
  //         let ClipRegExp: RegExp = /(?:clips.twitch.tv\/|www.twitch.tv\/.*\/)+(?<clipName>[a-zA-Z0-9~!@#$%^&*()_\-=+/.:;',]*)?/g; 
  //         let clipResult = ClipRegExp.exec(message.value)
  //         if (clipResult && clipResult.groups && getClipMeta) {
  //           getClipMeta(clipResult!.groups.clipName, apiClient)
  //             .then((clip) => {
  //               // console.log('found clip: ', clip.slug)
  //               clip = preProcessClip(clip, msg)
  //               // console.log(
  //               //   'channelState before calling processClip: ',
  //               //   channel
  //               // );
  //               processClip(clip, channelName);
  //             })
  //         }
  //         MessageCountStore.incrementChannelCount(channelName);
  //       }
  //     });
  //     if (oldListener) {
  //       chatClient.removeListener(oldListener.event, oldListener.listener)
  //     }
  //     setCurrentMessageListener(newListener)
  //   } 

  //   return (() => {
  //     if (chatClient && oldListener) {
  //       chatClient.removeListener(oldListener.event, oldListener.listener)
  //       setCurrentMessageListener(null)
  //     }
  //   })

  // }, [clipsLength, chatClient, apiClient, joined])

  return channel

}

export default useChannel