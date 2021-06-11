import React, { ReactChild, ReactChildren, useEffect, useMemo, useReducer, useRef } from 'react'
import { createContext } from 'use-context-selector'
import { CaughtClip } from '../../types';
import { MessageCountStore } from './MessageCountStore';
import channelsReducer, { ChannelAction, ChannelActions, ICatcherChannel, IChannelsReducerState } from './channelsReducer'

export interface IChannelsContext {
  channels: {
    [channelName: string]: ICatcherChannel
  }
  currentScanned: {
    [channelName: string]: number
  }
  addChannel: (channelName: string) => void
  channelsDispatch: (action: ChannelAction) => void
  processClip: (clip: CaughtClip, channelName: string) => void
  getChannels: () => IChannelsContext['channels']
}

export const defaultChannelsContext: Partial<IChannelsContext> = {}

const defaultChannelsState = {
  channels: {},
  currentScanned: {}
};

export const ChannelsContext = createContext(defaultChannelsContext);

const ChannelsContextProvider = ({
  children
}: {children?: ReactChild | ReactChildren}) => {

  const [channelsState, mainChannelsDispatch] = useReducer(
    channelsReducer,
    defaultChannelsState
  );

  const channelsRef = useRef(channelsState)
  const setChannels = (channels: IChannelsReducerState) => {
    channelsRef.current = channels;

  }

  const channelsDispatch = useMemo(() => (action: ChannelAction) => {
    mainChannelsDispatch(action)
    setChannels(channelsState)
  }, [channelsState])

  // const [channels, currentScanned, channelsDispatch, processClip] = useChannelsReducer();

  function updateCounts() {
    channelsDispatch({
      type: ChannelActions.UPDATE_SCANNED,
      payload: MessageCountStore.getChannelCounts()
    })
  }

  const processClip = (clip: CaughtClip, channelName: string) => {
    let clipExists = -1;
    console.log(channelsState)
    channelsState.channels[channelName].clips.forEach((foundClip, index) => {
      console.log(clip.slug, foundClip.slug)
      if (clip.slug === foundClip.slug) {
        console.log(`clip ${clip.slug} exists, adding new poster: `, clip.postedBy)
        clipExists = index;
        channelsDispatch({
          type: ChannelActions.UPDATE_CLIP_POSTED_BY,
          payload: [channelName, clip, index],
        });
      }
    });

    if (clipExists === -1) {
      console.log(`clip ${clip.slug} does not exist, adding new`)
      channelsDispatch({
        type: ChannelActions.ADD_CLIP,
        payload: [channelName, clip],
      });
    }
  };

  // const addClipByUrl = (channelName: string, clipUrl: string) => {
  //   let splitUrl = clipUrl.split('/');
  //   if (apiClient) {
  //     apiClient
  //       .callApi({
  //         type: TwitchAPICallType.Kraken,
  //         url: `/clips/${splitUrl[splitUrl.length - 1]}`,
  //       })
  //       .then((clip) => {
  //         if (clip) {
  //           channelsDispatch({
  //             type: ChannelActions.ADD_CLIP,
  //             payload: [channelName, clip],
  //           });
  //         }
  //       });
  //   }
  // };

  const addChannel = (channelName: string) => {
    if (channelsDispatch) {
      channelsDispatch({
        type: ChannelActions.ADD_CHANNEL,
        payload: channelName,
      });
    }
  };

  // useEffect(() => {
  //   updateCounts()
  //   let scheduledUpdate = setInterval(() => {
  //     updateCounts()
  //   }, 5000)

  //   return (() => {
  //     clearInterval(scheduledUpdate)
  //   })
  // },[])

  const getChannels = () => {
    return channelsState.channels
  }

  


  return (
    <ChannelsContext.Provider value={{getChannels, addChannel, channels: channelsState.channels, currentScanned: channelsState.currentScanned, channelsDispatch, processClip}}>
      {children}
    </ChannelsContext.Provider>
  )


}

export default ChannelsContextProvider