import React from 'react'
import { createContext } from 'use-context-selector'
import { ICatcherChannel } from './useChannelsReducer'

interface IChannelsContext {
  channels: {
    [channelName: string]: ICatcherChannel
  };
}