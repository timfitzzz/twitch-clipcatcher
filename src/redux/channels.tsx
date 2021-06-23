import { createSlice, PayloadAction, createAsyncThunk, createAction } from '@reduxjs/toolkit'
import { TwitchPrivateMessage } from 'twitch-chat-client/lib/StandardCommands/TwitchPrivateMessage'
import { CaughtClip, ICatcherChannel, TwitchClipV5 } from '../types'
import { getClipEpoch } from '../utilities/apiMethods'
import { AppDispatch, RootState } from './store'

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
type ClipReaddedPayload = [streamName: string, clip: CaughtClip, clipIndex: number]

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
    clip.broadcasterName = clip.broadcaster.name
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
  getVodEpoch: (vodId: string, offset: number) => Promise<number | undefined>
},
{
  dispatch: AppDispatch
  state: RootState
  rejectValue: Error
}>(
  'channels/intakeClip',
  async({channelName, clipName, msg, getClipMeta, getVodEpoch}, { getState, rejectWithValue, requestId, dispatch }) => {
    let { channels: { [channelName]: channel } } = getState()
    let clipMeta: Partial<CaughtClip> | undefined;
    let clipEpoch: number | undefined
    try {
      clipMeta = await getClipMeta(clipName) as Partial<CaughtClip>
    } catch (err) {
      rejectWithValue(err)
    }

    if (clipMeta && clipMeta.vod) {
      try {
        clipEpoch = await getVodEpoch(clipMeta.vod.id, clipMeta.vod.offset)
      } catch (err) {
        rejectWithValue(err)
      }
    }

    const preProcessedClip: CaughtClip = preProcessClip(clipMeta as CaughtClip, msg)
    preProcessedClip.startEpoch = clipEpoch

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
        preProcessedClip,
        msg.id
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