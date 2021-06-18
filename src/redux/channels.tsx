import { createSlice, configureStore, PayloadAction, SliceCaseReducers, CreateSliceOptions, createAsyncThunk } from '@reduxjs/toolkit'
import { BaseThunkAPI } from '@reduxjs/toolkit/dist/createAsyncThunk'
import { RejectedWithValueActionFromAsyncThunk } from '@reduxjs/toolkit/dist/matchers'
import { TwitchPrivateMessage } from 'twitch-chat-client/lib/StandardCommands/TwitchPrivateMessage'
import { ApiClient } from 'twitch/lib'
import { StringLiteralType } from 'typescript'
import { CaughtClip, TwitchClipV5 } from '../types'
import { AppDispatch, RootState } from './store'

interface ChannelsSliceState {
  [channelName: string]: ICatcherChannel
}

const initialState: ChannelsSliceState = {}

type ChannelAddedPayload = string
type ChannelRemovedPayload = string
type ScanningStartedPayload = string
type ScanningStoppedPayload = string
type ChannelClearedPayload = string
type ClipAddedPayload = [streamName: string, clip: CaughtClip]
type ClipReaddedPayload = [streamName: string, clip: CaughtClip, clipIndex: number]

export interface ICatcherChannel {
  name: string;
  scanning: boolean;
  clips: CaughtClip[];
}
export function initChannelState(channelName: string): ICatcherChannel {
  return {
    name: channelName,
    scanning: true,
    clips: [],
  };
}

  // preprocess clip using existing metadata for convenience
  const preProcessClip = (clip: TwitchClipV5 & CaughtClip, msg: TwitchPrivateMessage): CaughtClip => {
    clip.postedBy = [{
      userName: msg.userInfo.userName,
      userId: msg.userInfo.userId,
      isMod: msg.userInfo.isMod,
      isBroadcaster: msg.userInfo.isBroadcaster,
      isVip: msg.userInfo.isVip
    }]
    clip.postedByMod = msg.userInfo.isMod
    clip.postedByBroadcaster = msg.userInfo.isBroadcaster
    clip.postedByVip = msg.userInfo.isVip
    // console.log(msg)
    return clip
  }

export const intakeClip = createAsyncThunk<
{ 
  result: string
  clip: CaughtClip
},
{ 
  channelName: string
  clipName: string
  msg: TwitchPrivateMessage
  getClipMeta: (clipSlug: string) => Promise<TwitchClipV5>
},
{
  dispatch: AppDispatch
  state: RootState
  rejectValue: Error
}>(
  'channels/intakeClip',
  async({channelName, clipName, msg, getClipMeta}, { getState, rejectWithValue, requestId, dispatch }) => {
    let { channels: { [channelName]: channel } } = getState()
    let clipMeta: TwitchClipV5 | undefined;
    try {
      clipMeta = await getClipMeta(clipName)
    } catch (err) {
      rejectWithValue(err)
    }

    const preProcessedClip: CaughtClip = preProcessClip(clipMeta as CaughtClip, msg)
    
    let clipExists = -1
    if (channel) {
      channel.clips.forEach((clip: CaughtClip, index: number) => {
        if (preProcessedClip.tracking_id === clip.tracking_id) {
          clipExists = index
        }
      })
    }

    if (clipExists > -1) {
      dispatch(channelsSlice.actions.clipReadded([
        channelName,
        preProcessedClip,
        clipExists
      ]))
      return { result: 'exists', clip: preProcessedClip}
    } else {
      dispatch(channelsSlice.actions.clipAdded([
        channelName,
        preProcessedClip
      ]))
      return { result: 'new', clip: preProcessedClip}
    }

  }
)

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
    clipAdded(channels, action: PayloadAction<ClipAddedPayload>) {
      channels[action.payload[0]].clips.push(action.payload[1])
    },
    clipReadded(channels, action: PayloadAction<ClipReaddedPayload>) {
      let [ channelName, clip, clipIndex ] = action.payload
      if (channels[channelName].clips[clipIndex].postedBy.filter(userInfo => userInfo.userId === clip.postedBy[0].userId).length === 0) {
        channels[channelName].clips[clipIndex].postedBy.push(clip.postedBy[0])
      }
    }
  },
  extraReducers: (builder) => {
    builder.addCase(intakeClip.fulfilled, (state, action) => {

    })
  }
})

export const { channelAdded, channelRemoved, scanningStarted, scanningStopped, channelCleared, clipAdded, clipReadded } = channelsSlice.actions;
export default channelsSlice.reducer