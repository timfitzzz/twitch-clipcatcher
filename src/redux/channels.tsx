import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { CaughtClip, defaultFilters, defaultSort, ICatcherChannel } from '../types'
import { clipAdded, ClipAddedPayloadV2 } from './clips'

export interface ChannelsSliceState {
  [channelName: string]: ICatcherChannel
}

const initialState: ChannelsSliceState = {}

type ChannelAddedPayload = string
type ChannelRemovedPayload = string
type ScanningStartedPayload = string
type ScanningStoppedPayload = string
type ChannelClearedPayload = string
export type ClipAddedPayload = [streamName: string, clip: CaughtClip, messageId: string]

interface SortMovedPayload {
  dragIndex: number
  hoverIndex: number
  channelName: string
}

interface SortToggledPayload {
  toggleIndex: number
  channelName: string
}

export function initChannelState(channelName: string): ICatcherChannel {
  return {
    name: channelName,
    scanning: true,
    clips: [],
    sort: defaultSort,
    filters: defaultFilters
  };
}


const channelsSlice = createSlice({ 
  name: 'channels',
  initialState,
  reducers: {
    channelAdded(channels, action: PayloadAction<ChannelAddedPayload>) {
      channels[action.payload] = initChannelState(action.payload)
    },
    channelRemoved(channels, action: PayloadAction<ChannelRemovedPayload>) {
      delete channels[action.payload]
    },
    scanningStarted(channels, action: PayloadAction<ScanningStartedPayload>) {
      channels[action.payload].scanning = true
    },
    scanningStopped(channels, action: PayloadAction<ScanningStoppedPayload>) {
      channels[action.payload].scanning = false
    },
    channelCleared(channels, action: PayloadAction<ChannelClearedPayload>) {
      channels[action.payload].clips = []
    },
    sortMoved(channels, action: PayloadAction<SortMovedPayload>) {
      let { dragIndex, hoverIndex, channelName } = action.payload
      let dragSort = channels[channelName].sort[dragIndex]
      channels[channelName].sort.splice(dragIndex, 1)
      channels[channelName].sort.splice(hoverIndex, 0, dragSort)
    },
    sortToggled(channels, action: PayloadAction<SortToggledPayload>) {
      let { toggleIndex, channelName } = action.payload
      let { active, direction } = channels[channelName].sort[toggleIndex]

      if (!active) {
        channels[channelName].sort[toggleIndex].active = true
        channels[channelName].sort[toggleIndex].direction = 'desc'
      } else if (direction === 'desc') {
        channels[channelName].sort[toggleIndex].direction = 'asc'
      } else if (direction === 'asc') {
        channels[channelName].sort[toggleIndex].active = false
      }
    }
  },
  extraReducers: (builder) => {
    builder.addCase(clipAdded.type, (channels, action: PayloadAction<ClipAddedPayloadV2>) => {
      channels[action.payload.channelName].clips.push(action.payload.clip.slug)
    })
  }
})

export const { channelAdded, channelRemoved, scanningStarted, scanningStopped, channelCleared, sortMoved, sortToggled } = channelsSlice.actions;
export default channelsSlice.reducer