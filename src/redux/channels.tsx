import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { CaughtClip, defaultFilters, defaultSort, ICatcherChannel } from '../types'
import { annotationAdded, annotationsReverted, AnnotationAddedPayload, AnnotationsRevertedPayload, firstAnnotationAdded, FirstAnnotationAddedPayload, AnnotationTypes } from './annotations'

export interface ChannelsSliceState {
  [channelName: string]: ICatcherChannel
}

const initialState: ChannelsSliceState = {}

type ChannelAddedPayload = string
export type ChannelRemovedPayload = string
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
    filters: defaultFilters,
    postersByClip: {}
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
    builder.addCase(firstAnnotationAdded.type, (channels, action: PayloadAction<FirstAnnotationAddedPayload>) => {
      let { channelName, clipSlug, by } = action.payload.annotation
      channels[channelName].clips.push(clipSlug)
      channels[channelName].postersByClip[clipSlug] = [by]
    })
    builder.addCase(annotationAdded.type, (channels, action: PayloadAction<AnnotationAddedPayload>) => {
      let { channelName, clipSlug, by, annotationTypes } = action.payload.annotation
      if (annotationTypes.indexOf(AnnotationTypes['link']) > -1) {
        if (!channels[channelName].postersByClip[clipSlug]) {
          channels[channelName].clips.push(clipSlug)
          channels[channelName].postersByClip[clipSlug] = [by]
        } else if (channels[channelName].postersByClip[clipSlug].indexOf(by) === -1) {
          channels[channelName].postersByClip[clipSlug].push(by)  
        }
      }
    })
    builder.addCase(annotationsReverted.type, (channels, action: PayloadAction<AnnotationsRevertedPayload>) => {
      for (let i = 0; i < action.payload.annotations.length; i++) {
        let { annotationTypes, clipSlug, channelName, by } = action.payload.annotations[i]
        let channel = channels[channelName]
        if (!action.payload.otherLinkRemains && annotationTypes.indexOf(AnnotationTypes['link']) > -1) {
          if (channel.postersByClip[clipSlug] && channel.postersByClip[clipSlug].length > 1) {
            let userIdx = channel.postersByClip[clipSlug].indexOf(by)
            if (userIdx > -1) {
              channel.postersByClip[clipSlug].splice(userIdx, 1)
            }
          } else {
            delete channel.postersByClip[clipSlug]
            let clipIdx = channel.clips.indexOf(clipSlug)
            if (clipIdx > -1) {
              channel.clips.splice(clipIdx, 1)
            }
          }
        }
      }
    })
  }
})

export const { channelAdded, channelRemoved, scanningStarted, scanningStopped, channelCleared, sortMoved, sortToggled } = channelsSlice.actions;
export default channelsSlice.reducer