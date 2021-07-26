import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { CaughtClip, defaultFilters, defaultSort, ICatcherChannel } from '../types'
import { annotationAdded, annotationsReverted, AnnotationAddedPayload, AnnotationsRevertedPayload, firstAnnotationAdded, FirstAnnotationAddedPayload, AnnotationTypes } from './annotations'
import { RootState } from './store'

export interface ChannelsSliceState {
  [channelName: string]: ICatcherChannel
}

const initialState: ChannelsSliceState = {
  // clipstime: {                                // demo data for generating example visuals
  //   name: 'clipstime',
  //   scanning: false,
  //   holdUpdates: false,
  //   clips: [],
  //   sort: defaultSort,
  //   filters: defaultFilters,
  //   postersByClip: {},
  //   stackClips: true
  // }
}

type ChannelAddedPayload = string
export type ChannelRemovedPayload = string
type ScanningStartedPayload = string
type ScanningStoppedPayload = string
type ChannelStackingToggledPayload = string
type ChannelClearedPayload = string
type ChannelUpdatesHeldPayload = string
type ChannelUpdatesReleasedPayload = string
type ChannelErrorSetPayload = string
type ChannelErrorClearedPayload = string

interface ChannelClipRemovedPayload {
  channelName: string
  clipSlug: string
}

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
    holdUpdates: false,
    clips: [],
    sort: defaultSort,
    filters: defaultFilters,
    postersByClip: {},
    stackClips: true,
    error: null
  };
}

export const selectChannels = (state: RootState) => state.channels
export const selectChannelName = (state: RootState, channelName: string) => channelName
export const selectChannelById = createSelector(
  [selectChannels, selectChannelName],
  (channels, channelId) => channels[channelId]
)
export const selectChannelClipsById = createSelector(
  [selectChannelById],
  channel => channel.clips
)
export const selectChannelClipsCount = createSelector(
  [selectChannelClipsById],
  clips => clips.length
)


const channelsSlice = createSlice({ 
  name: 'channels',
  initialState,
  reducers: {
    channelStackingToggled(channels, action: PayloadAction<ChannelStackingToggledPayload>) {
      channels[action.payload].stackClips = !channels[action.payload].stackClips
    },
    channelUpdatesHeld(channels, action: PayloadAction<ChannelUpdatesHeldPayload>) {
      channels[action.payload].holdUpdates = true
    },
    channelUpdatesReleased(channels, action: PayloadAction<ChannelUpdatesReleasedPayload>) {
      channels[action.payload].holdUpdates = false
    },
    channelAdded(channels, action: PayloadAction<ChannelAddedPayload>) {
      channels[action.payload] = initChannelState(action.payload)
    },
    channelRemoved(channels, action: PayloadAction<ChannelRemovedPayload>) {
      delete channels[action.payload]
    },
    scanningStarted(channels, action: PayloadAction<ScanningStartedPayload>) {
      channels[action.payload].error = null
      channels[action.payload].scanning = true
    },
    scanningStopped(channels, action: PayloadAction<ScanningStoppedPayload>) {
      channels[action.payload].scanning = false
    },
    channelCleared(channels, action: PayloadAction<ChannelClearedPayload>) {
      channels[action.payload].clips = []
    },
    channelErrorSet(channels, action: PayloadAction<ChannelErrorSetPayload> ) {
      channels[action.payload].error = action.payload
    },
    channelErrorCleared(channels, action: PayloadAction<ChannelErrorClearedPayload>) {
      channels[action.payload].error = null
    },
    channelClipRemoved(channels, action: PayloadAction<ChannelClipRemovedPayload>) {
      channels[action.payload.channelName].clips = channels[action.payload.channelName].clips.filter(clipSlug => clipSlug !== action.payload.clipSlug)
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

export const { channelAdded, channelErrorSet, channelErrorCleared, channelRemoved, scanningStarted, scanningStopped, channelCleared, sortMoved, sortToggled, channelUpdatesHeld, channelUpdatesReleased } = channelsSlice.actions;
export default channelsSlice.reducer