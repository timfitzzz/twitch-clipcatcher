import { createSlice, configureStore, PayloadAction, SliceCaseReducers, CreateSliceOptions, createAsyncThunk } from '@reduxjs/toolkit'
import { BaseThunkAPI } from '@reduxjs/toolkit/dist/createAsyncThunk'
import { RejectedWithValueActionFromAsyncThunk } from '@reduxjs/toolkit/dist/matchers'
import { TwitchPrivateMessage } from 'twitch-chat-client/lib/StandardCommands/TwitchPrivateMessage'
import { ApiClient } from 'twitch/lib'
import { StringLiteralType } from 'typescript'
import { CaughtClipV2, ClipAnnotation, TwitchClipV5 } from '../types'
import { AppDispatch, RootState } from './store'
import { clipAdded as clipAddedV1, ClipAddedPayload } from './channels'


function recursiveSearch<key extends keyof CaughtClipV2>(
  targetArray: string[], 
  referenceObject: { [key: string]: CaughtClipV2 }, 
  referenceProp: key,
  targetValue: CaughtClipV2[key],
  left: number = 0, 
  right: number = targetArray.length - 1
  ): number {

  // console.log(left, right, targetArray.length)

  if (targetArray.length === 0 || left >= right) {
    return left
  }

  let mid = left + Math.floor(right - left / 2)

  if (referenceObject[targetArray[mid]][referenceProp] === targetValue) {
    return mid
  } else {
    if (typeof targetValue === 'number') {
      if (referenceObject[targetArray[mid]][referenceProp] > targetValue) {
        return recursiveSearch(targetArray, referenceObject, referenceProp, targetValue, left, mid-1)
      } else {
        return recursiveSearch(targetArray, referenceObject, referenceProp, targetValue, mid+1, right)
      }
    } else {
      if ((referenceObject[targetArray[mid]][referenceProp] as string).localeCompare(targetValue as string) < 0 ) {
        return recursiveSearch(targetArray, referenceObject, referenceProp, targetValue, left, mid-1)
      } else {
        return recursiveSearch(targetArray, referenceObject, referenceProp, targetValue, mid+1, right)
      }
    }
  }
}


const insertEpoch = (clipsByStartEpoch: string[], startEpoch: number, clipSlug: string, clips: {[key: string]: CaughtClipV2}): string[] => {
  const newIndex = recursiveSearch(clipsByStartEpoch, clips, 'startEpoch', startEpoch)
  return clipsByStartEpoch.splice(newIndex, 0, clipSlug)
}

const insertStream = (clipsByStream: string[], broadcasterName: string, clipSlug: string, clips: {[key: string]: CaughtClipV2}): string[] => {
  const newIndex = recursiveSearch(clipsByStream, clips, 'broadcasterName', broadcasterName)
  return clipsByStream.splice(newIndex, 0, clipSlug)
}

const insertDuration = (clipsByDuration: string[], duration: number, clipSlug: string, clips: {[key: string]: CaughtClipV2}): string[] => {
  const newIndex = recursiveSearch(clipsByDuration, clips, 'duration', duration)
  return clipsByDuration.splice(newIndex, 0, clipSlug)
}

interface ClipsSliceState {
  clips: {
    [clipSlug: string]: CaughtClipV2
  }
  clipsByStartEpoch: string[]
  clipsByStream: string[]
  clipsByDuration: string[]
  favoriteClips: string[]
  hiddenClips: string[]
}

const initialState: ClipsSliceState = {
  clips: {},
  clipsByStartEpoch: [],
  clipsByStream: [],
  clipsByDuration: [],
  favoriteClips: [],
  hiddenClips: []
}

export interface ClipAddedPayloadV2 { 
  channelName: string, 
  clip: CaughtClipV2
  messageId: string
}

export enum UserTypes {
  'user',
  'sub',
  'broadcaster',
  'mod',
  'vip'
}

export interface ClipReaddedPayloadV2 { 
  channelName: string,
  clipSlug: string,
  readdedBy: {
    userName: string,
    userId: string
    messageId: string
  }
  types: UserTypes[]
}


export interface ClipAnnotatedPayload {
  clipSlug: string
  annotation: ClipAnnotation
  channelName: string
  messageId: string
}

export interface ClipUpdate {
  clipSlug: string,
  viewCount: number,
  notFound: boolean
}

export interface ClipsUpdatedPayload {
  updates: ClipUpdate[]
}

export const parseUserType = (userInfo: TwitchPrivateMessage['userInfo'], sub: 0 | 1): UserTypes[] => {
  let response = [UserTypes['user']]
  sub === 1 && response.push(UserTypes['sub'])
  userInfo.isMod && response.push(UserTypes['mod'])
  userInfo.isVip && response.push(UserTypes['vip'])
  userInfo.isBroadcaster && response.push(UserTypes['broadcaster'])
  return response
}

// preprocess clip using existing metadata for convenience
const preProcessClip = (clip: TwitchClipV5 & CaughtClipV2, msg: TwitchPrivateMessage, channelName: string): CaughtClipV2 => {
  clip.postedBy = {
    [channelName]: [{
      userName: msg.userInfo.userName,
      userId: msg.userInfo.userId,
      isMod: msg.userInfo.isMod,
      isBroadcaster: msg.userInfo.isBroadcaster,
      isVip: msg.userInfo.isVip
    }]
  }
  clip.annotations = { [channelName]: []}
  clip.postedByMod = msg.userInfo.isMod
  clip.postedByBroadcaster = msg.userInfo.isBroadcaster
  clip.postedByVip = msg.userInfo.isVip
  // console.log(msg)
  return clip
}

// export const intakeClip = createAsyncThunk<
// { 
//   result: string
//   clip: CaughtClipV2
// },
// { 
//   channelName: string
//   clipSlug: string
//   msg: TwitchPrivateMessage
//   getClipMeta: (clipSlug: string) => Promise<TwitchClipV5>
// },
// {
//   dispatch: AppDispatch
//   state: RootState
//   rejectValue: Error
// }>(
//   'clips/intakeClip',
//   async({channelName, clipSlug, msg, getClipMeta}, { getState, rejectWithValue, requestId, dispatch }) => {
//     let { clips: { clips: { [clipSlug]: existingClip }}} = getState()
//     let clipMeta: TwitchClipV5 | undefined;
//     if (existingClip) {
//       dispatch(clipsSlice.actions.clipReadded({
//         channelName,
//         clipSlug,
//         readdedBy: {
//           userName: msg.userInfo.userName,
//           userId: msg.userInfo.userId || 'unknown'
//         },
//         type: "user" | "sub" | "broadcaster" | "mod" | "vip"
//       })
//     }
//     try {
//       clipMeta = await getClipMeta(clipName)
//     } catch (err) {
//       rejectWithValue(err)
//     }

//     const preProcessedClip: CaughtClipV2 = preProcessClip(clipMeta as CaughtClipV2, msg, channelName)
    
//     let clipExists = -1
//     if (channel) {
//       channel.clips.forEach((clip: CaughtClipV2, index: number) => {
//         if (preProcessedClip.tracking_id === clip.tracking_id) {
//           clipExists = index
//         }
//       })
//     }

//     if (clipExists > -1) {
//       dispatch(channelsSlice.actions.clipReadded([
//         channelName,
//         preProcessedClip,
//         clipExists
//       ]))
//       return { result: 'exists', clip: preProcessedClip}
//     } else {
//       dispatch(channelsSlice.actions.clipAdded([
//         channelName,
//         preProcessedClip
//       ]))
//       return { result: 'new', clip: preProcessedClip}
//     }

//   }
// )


const clipsSlice = createSlice({ 
  name: 'clips',
  initialState,
  reducers: {
    clipAdded(clips, action: PayloadAction<ClipAddedPayloadV2>) {
      clips.clips[action.payload.clip.slug] = action.payload.clip
      insertEpoch(clips.clipsByStartEpoch, action.payload.clip.startEpoch, action.payload.clip.slug, clips.clips)
      insertStream(clips.clipsByStream, action.payload.clip.broadcasterName, action.payload.clip.slug, clips.clips)
      insertDuration(clips.clipsByDuration, action.payload.clip.duration, action.payload.clip.slug, clips.clips)
    },
    clipReadded(clips, action: PayloadAction<ClipReaddedPayloadV2>) {
      clips.clips[action.payload.clipSlug].postedBy[action.payload.channelName].push({
        userId: action.payload.readdedBy.userId,
        userName: action.payload.readdedBy.userName,
        isMod: action.payload.types.indexOf(UserTypes["mod"]) > -1,
        isVip: action.payload.types.indexOf(UserTypes["vip"]) > -1,
        isBroadcaster: action.payload.types.indexOf(UserTypes["broadcaster"]) > -1
      })
      clips.clips[action.payload.clipSlug].postedByBroadcaster = clips.clips[action.payload.clipSlug].postedByBroadcaster || action.payload.types.indexOf(UserTypes["broadcaster"]) > -1
      clips.clips[action.payload.clipSlug].postedByMod = clips.clips[action.payload.clipSlug].postedByMod || action.payload.types.indexOf(UserTypes["mod"]) > -1
      clips.clips[action.payload.clipSlug].postedByVip = clips.clips[action.payload.clipSlug].postedByMod || action.payload.types.indexOf(UserTypes["vip"]) > -1
    },
    clipAnnotated(clips, action: PayloadAction<ClipAnnotatedPayload>) {
      if (!clips.clips[action.payload.clipSlug].annotations[action.payload.channelName]) {
        clips.clips[action.payload.clipSlug].annotations[action.payload.channelName] = [action.payload.annotation]
      } else {
        clips.clips[action.payload.clipSlug].annotations[action.payload.channelName].push(action.payload.annotation)
      }
    },
    clipsUpdated(clips, action: PayloadAction<ClipsUpdatedPayload>) {
      action.payload.updates.forEach(update => {
        if (update.notFound) {
          delete clips.clips[update.clipSlug]
        } else if (update.viewCount) {
          clips.clips[update.clipSlug].views = update.viewCount
        }
      })
    }
  },
  extraReducers: (builder) => {
    builder.addCase(clipAddedV1, (clips, action: PayloadAction<ClipAddedPayload>) => {
      let { payload }: { payload: ClipAddedPayload} = action
      let [channelName, clip, messageId] = payload
      clips.clips[clip.slug] = { 
        ...clip,
        annotations: {},
        startEpoch: clip.startEpoch || -1,
        postedBy: {
          [channelName]: clip.postedBy
        }
      }
      if (clip.startEpoch) {
        insertEpoch(clips.clipsByStartEpoch, clip.startEpoch, clip.slug, clips.clips)
      }
      
      insertStream(clips.clipsByStream, clip.broadcasterName, clip.slug, clips.clips)
      insertDuration(clips.clipsByDuration, clip.duration, clip.slug, clips.clips)
    })
  }
})

export const { clipAdded, clipReadded, clipAnnotated, clipsUpdated } = clipsSlice.actions;
export default clipsSlice.reducer