import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { TwitchClipV5, UserTypes } from '../types'
import { UpdatedClipEpoch, UpdatedClipViews } from '../utilities/apiMethods'
import { isEmpowered, tagsReport } from '../utilities/parsers'
import { clipAdded, ClipAddedPayloadV2, updateClipViews, clipEpochRetry } from './actions'
import { annotationAdded, annotationsReverted, AnnotationsRevertedPayload, ClipAnnotation, FirstAnnotationAddedPayload } from './annotations'
import { mutateClipByAnnotation, revertClipByAnnotation } from './mutators'
import { RootState } from './store'
import memoize, { getUntrackedObject } from 'proxy-memoize'
import { selectStackVoters } from './selectors'

export type UserName = string
export type MessageId = string

export interface CaughtClipV2 extends TwitchClipV5 {
  votes: {
    [channelName: string]: {
      up: UserName[]
      down: UserName[]
    }
  }
  broadcasterName: UserName
  startEpoch: number
  vetoedIn?: {
    [channelName: string]: {
      by: UserName[]
    }
  }
  watchedIn: {
    [channelName: string]: boolean
  }
  vod: {
    id: string,
    url: string,
    offset: number,
    preview_image_url: string
  }
  firstSeenAnnotation: MessageId
  postedBy: {
    [channelName: string]: UserName[]
  }
  taggedIn?: {
    [channelName: string]: {
      as: {
        tags: string[],
        byTag: {
          [tag: string]: UserName[]
        }
      }
    }
  }
  metaedIn?: {
    [channelName: string]: {
      by: UserName[]
    }
  }
  dramaedIn?: {
    [channelName: string]: {
      by: UserName[]
    }
  }
}

export interface ClipsSliceState {
  clips: {
    [clipSlug: string]: CaughtClipV2
  }
  clipsByStartEpoch: string[]
  clipsByStream: string[]
  clipsByDuration: string[]
  favoriteClips: string[]
  hiddenClips: string[]
  watchedClips: string[]
  watchingClip: string | null
  playlist: string[]
  clipsToRetryEpoch: string[]
}

const initialState: ClipsSliceState = {
  clips: {},
  clipsByStartEpoch: [],
  clipsByStream: [],
  clipsByDuration: [],
  favoriteClips: [],
  hiddenClips: [],
  watchedClips: [],
  watchingClip: null,
  playlist: [],
  clipsToRetryEpoch: []
}


export interface ClipTaggedPayload {
  clipSlug: string
  tags: tagsReport
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

export interface ClipsTruthUpdatedPayload {
  updates: ClipUpdate[]
}

export interface ClipsEpochsUpdatedPayload {
  updates: UpdatedClipEpoch[]
}

export const selectClips = (state: RootState) => state.clips.clips
export const selectClipBySlug = (state: RootState, clipSlug: string) => state.clips.clips[clipSlug]
export const selectClipsBySlug = (state: RootState, clipSlugs: string[]) => clipSlugs.map(clipSlug => state.clips.clips[clipSlug])
export const createSpecialTagsSelector = (clipSlugs: string[], type: 'meta' | 'drama', channelName: string) => {
  
  return memoize((state: RootState) => clipSlugs.map(clipSlug => {
      if (clipSlug 
          && state.clips.clips[clipSlug] 
          && state.clips.clips[clipSlug][type+'edIn' as "metaedIn" | "dramaedIn"]
          && state.clips.clips[clipSlug][type+'edIn' as "metaedIn" | "dramaedIn"]![channelName]) {
        return state.clips.clips[clipSlug][type+'edIn' as "metaedIn" | "dramaedIn"]![channelName].by
      } else {
        return null
      }
    }))
}

type SpecialTagsSelectorInput = [state: RootState, clipSlugs: string[], channelName: string, type: 'meta' | 'drama']

export const specialTagsSelector = memoize((obj: SpecialTagsSelectorInput) => {
  let [state, clipSlugs, channelName, type] = obj
  return clipSlugs.map((clipSlug: string) => {
    if (clipSlug 
      && state.clips.clips[clipSlug] 
      && state.clips.clips[clipSlug][type+'edIn' as "metaedIn" | "dramaedIn"]
      && state.clips.clips[clipSlug][type+'edIn' as "metaedIn" | "dramaedIn"]![channelName]) {
      return state.clips.clips[clipSlug][type+'edIn' as "metaedIn" | "dramaedIn"]![channelName].by
    } else {
      return null
    }
  })
})
  
export const specialTagsOrderedUsersSelector = memoize((obj: SpecialTagsSelectorInput): string[][] => {
  let [state, clipSlugs, channelName, type] = obj
  let users = clipSlugs.reduce((taggerNames: string[], clipSlug: string) => {
    if (clipSlug 
      && state.clips.clips[clipSlug] 
      && state.clips.clips[clipSlug][type+'edIn' as "metaedIn" | "dramaedIn"]
      && state.clips.clips[clipSlug][type+'edIn' as "metaedIn" | "dramaedIn"]![channelName]) {
      return taggerNames.concat(
        state.clips.clips[clipSlug][type+'edIn' as "metaedIn" | "dramaedIn"]![channelName].by.filter(
          name => taggerNames.indexOf(name) === -1
        ))
    } else {
      return taggerNames
    }
  }, [] as string[])
  .sort((userNameA: string, userNameB: string) => 
    Math.max(...state.users.users[userNameB].userTypes[channelName]) - 
    Math.max(...state.users.users[userNameA].userTypes[channelName]))

  let foundRegularUser = false
  let checkingUser = 0
  while (!foundRegularUser && checkingUser < users.length) {
    if (!isEmpowered(state.users.users[users[checkingUser]].userTypes[channelName])) {
      foundRegularUser = true
    }
    checkingUser++
  }
  return [
    users.slice(0, checkingUser),
    (users.length > 0 || checkingUser === 0) ? users.slice(checkingUser, users.length) : []
  ]
})

const selectorsInputRegistry: { 
  [type: string]: {
    [argumentsSlug: string]: object | any[]
}} = {

}

export function getDurationsSelector(clipSlugs: string[]) {
  if (selectorsInputRegistry.durations[clipSlugs.join("")]) {
    return selectorsInputRegistry.durations[clipSlugs.join("")]
  } else {
    selectorsInputRegistry.durations[clipSlugs.join("")] = clipSlugs
    return clipSlugs
  }
}

export const stackDurationsSelector = memoize(({ state, clipSlugs }: { state: RootState, clipSlugs: string[] }) => {
  return clipSlugs.map(clipSlug => state.clips.clips[clipSlug].duration)
})

export const specialTagsMaxUserTypeSelector = memoize((obj: SpecialTagsSelectorInput) => {
  let [state, clipSlugs, channelName, type] = obj
  let maxType = -1
  let checkingSlug = 0

  while (maxType < 4 && checkingSlug < clipSlugs.length) {
    let slug = clipSlugs[checkingSlug]
    if (clipSlugs[checkingSlug]) {
      let clip = state.clips.clips[slug]
      if (clip) {
        if (clip[type+'edIn' as "metaedIn" | "dramaedIn"] &&
            clip[type+'edIn' as "metaedIn" | "dramaedIn"]![channelName]) {
          let checkingUser = 0
          while (maxType < 4 && checkingUser < clip[type+'edIn' as "metaedIn" | "dramaedIn"]![channelName].by.length) {
            let userMax = Math.max(...state.users.users[clip[type+'edIn' as "metaedIn" | "dramaedIn"]![channelName].by[checkingUser]].userTypes[channelName])
            if (maxType < userMax) {
              maxType = userMax
            } 
            checkingUser++
          }
        }
      }
    }
    checkingSlug++
  }
  return maxType
})

interface ChannelClipsSelectorInput {
  state: RootState
  clipSlugs: string[]
  channelName: string
}

export const selectVotersByClipIds = memoize(({state, clipSlugs, channelName}: { state: RootState, clipSlugs: string[], channelName: string}) => {
  let output = {
    upVoters: [] as string[],
    downVoters: [] as string[],
    upvoterTypes: [] as UserTypes[],
    downvoterTypes: [] as UserTypes[]
  }

  let votesSets = clipSlugs.map(clipSlug => (getUntrackedObject(state) || state).clips.clips[clipSlug].votes[channelName])

  let stackVoters = selectStackVoters(
    {
      votesSets
    }
  )

  output.upVoters = stackVoters.up
  output.downVoters = stackVoters.down

  output.upVoters = output.upVoters.sort((usernameA, usernameB) => 
    state.users.users[usernameB].userTypes[channelName][0] -
    state.users.users[usernameA].userTypes[channelName][0]
  )
  output.downVoters = output.downVoters.sort((usernameA, usernameB) => 
    state.users.users[usernameB].userTypes[channelName][0] -
    state.users.users[usernameA].userTypes[channelName][0]
  )

  output.upvoterTypes = output.upVoters.reduce((voterTypes, upVoterName) => {
    if (voterTypes.length === 0 || (state.users.users[upVoterName].userTypes[channelName].indexOf(voterTypes[0]) === -1)) {
      voterTypes.unshift(state.users.users[upVoterName].userTypes[channelName][0])
      return voterTypes
    } else {
      return voterTypes
    }
  }, [] as UserTypes[])

  output.downvoterTypes = output.downVoters.reduce((voterTypes, downVoterName) => {
    if (voterTypes.length === 0 || (state.users.users[downVoterName].userTypes[channelName].indexOf(voterTypes[0]) === -1)) {
     voterTypes.unshift(state.users.users[downVoterName].userTypes[channelName][0])
     return voterTypes
    } else {
      return voterTypes
    }
  }, [] as UserTypes[])

  return output
})

interface ChannelClipSelectorInput {
  state: RootState
  clipSlug: string
  channelName: string
  direction?: 'asc' | 'desc'
}

export const selectVoteTotalByClipId = memoize((obj: ChannelClipSelectorInput) => 
  obj.state.clips.clips[obj.clipSlug].votes[obj.channelName].up.length - obj.state.clips.clips[obj.clipSlug].votes[obj.channelName].down.length
)

export const selectVoteTotalByClipIds = memoize((obj: ChannelClipsSelectorInput) => 
  obj.clipSlugs.reduce(
    (total: number, clipSlug: string) =>
      total + obj.state.clips.clips[clipSlug].votes[obj.channelName].up.length - obj.state.clips.clips[clipSlug].votes[obj.channelName].down.length
    , 0)
)

interface ClipsSelectorInput {
  state: RootState
  clipSlugs: string[]
  direction?: 'asc' | 'desc'
}

interface ClipSelectorInput {
  state: RootState
  clipSlug: string
}

export const selectLengthByClipId = memoize((obj: ClipSelectorInput) => 
  obj.state.clips.clips[obj.clipSlug].duration
)

export const selectViewsByClipId = memoize((obj: ClipSelectorInput) => 
  obj.state.clips.clips[obj.clipSlug].views
)

export const selectViewsTotalByClipIds = memoize((obj: ClipsSelectorInput) => 
    obj.clipSlugs.reduce(
      (total: number, clipSlug: string) => 
        total + obj.state.clips.clips[clipSlug].views
    , 0)
  )

export const selectStartEpochByClipIds = memoize((obj: ClipsSelectorInput) => 
    obj.state.clips.clips[obj.clipSlugs[0]].startEpoch
  )

export const selectLengthByClipIdsAndSort = memoize((obj: ClipsSelectorInput) => 
    obj.direction === 'asc'
      ? Math.min(...obj.clipSlugs.map(clipSlug => obj.state.clips.clips[clipSlug].duration))
      : Math.max(...obj.clipSlugs.map(clipSlug => obj.state.clips.clips[clipSlug].duration))
  )

export const doPresortedClipsOverlap = memoize(
  ({ clipA, clipB }: { 
    clipA: CaughtClipV2, 
    clipB: CaughtClipV2
  }) => {

  return clipA.broadcasterName === clipB.broadcasterName
          ? clipA.startEpoch + clipA.duration * 1000 > clipB.startEpoch
            ? true
            : false
          : false
})

export const clipsSlice = createSlice({ 
  name: 'clips',
  initialState,
  reducers: {
    clipPlayed(clips, action: PayloadAction<{clipSlug: string, channelName: string}>) {
      clips.clips[action.payload.clipSlug].watchedIn[action.payload.channelName] = true
    }
  },
  extraReducers: (builder) => {
    builder.addCase(clipAdded, (clips, action: PayloadAction<ClipAddedPayloadV2>) => {
      clips.clips[action.payload.clip.slug] = action.payload.clip
    })
    builder.addCase(annotationAdded.type, (clips, action: PayloadAction<FirstAnnotationAddedPayload>) => {
      let { clipSlug } = action.payload.annotation
      let clip = clips.clips[clipSlug]
      mutateClipByAnnotation(clip, action.payload.annotation)
    })
    builder.addCase(annotationsReverted.type, (clips, action: PayloadAction<AnnotationsRevertedPayload>) => {
      for (let i = 0; i < action.payload.annotations.length; i++) {
        let clip = clips.clips[action.payload.annotations[i].clipSlug]
        revertClipByAnnotation(clip, action.payload.annotations[i], action.payload.otherLinkRemains)
      }
    })
    builder.addCase(clipEpochRetry.fulfilled, (clips, action: PayloadAction<UpdatedClipEpoch>) => {
        if (action.payload.startEpoch) {
          clips.clips[action.payload.clipSlug].startEpoch = action.payload.startEpoch
        }
    })
    // builder.addCase(updateClipEpochs.fulfilled, (clips, action: PayloadAction<UpdatedClipEpoch[]>) => {
    //   action.payload.forEach(update => {
    //     if (update.startEpoch) {
    //       clips.clips[update.clipSlug].startEpoch = update.startEpoch
    //     }
    //   })
    // })
    builder.addCase(updateClipViews.fulfilled, (clips, action: PayloadAction<{ result: UpdatedClipViews[] | string}>) => {
      if (Array.isArray(action.payload.result)) {
        action.payload.result.forEach(updateReport => {
          clips.clips[updateReport.slug].views = updateReport.views
        })
      }
    })
  }
})

export const { clipPlayed } = clipsSlice.actions
export default clipsSlice.reducer