import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { TwitchClipV5 } from '../types'
import { UpdatedClipEpoch } from '../utilities/apiMethods'
import { isEmpowered, tagsReport } from '../utilities/parsers'
import { clipEpochsRetry, clipAdded, ClipAddedPayloadV2 } from './actions'
import { annotationAdded, annotationsReverted, AnnotationsRevertedPayload, ClipAnnotation, FirstAnnotationAddedPayload } from './annotations'
import { mutateClipByAnnotation, revertClipByAnnotation } from './mutators'
import { RootState } from './store'
import memoize from 'proxy-memoize'

// export interface ClipPostedBy {
//   broadcaster?: boolean,
//   mods?: string[],
//   vips?: string[],
//   subs?: string[],
//   users?: string[]
// }

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
  vod: {
    id: string,
    url: string,
    offset: number
  }
  firstSeenAnnotation: MessageId
  postedBy: {
    [channelName: string]: UserName[]
  }
  taggedIn: {
    [channelName: string]: {
      // overall: {
      as: {
        tags: string[],
        byTag: {
          [tag: string]: UserName[]
        }
      }
      // }
      // byUsers?: {
      //   as: {
      //     tags: string[],
      //     countByTag: {
      //       [tag: string]: number
      //     }
      //     in: string[]
      //   }
      // }
      // bySubs?: {
      //   as: {
      //     tags: string[],
      //     countByTag: {
      //       [tag: string]: number
      //     }
      //     in: string[]
      //   }
      // }
      // byVips?: {
      //   as: {
      //     tags: string[],
      //     countByTag: {
      //       [tag: string]: number
      //     }
      //     in: string[]
      //   }
      // }
      // byMods?: {
      //   as: {
      //     tags: string[],
      //     countByTag: {
      //       [tag: string]: number
      //     }
      //     in: string[]
      //   }
      // }
      // byBroadcaster?: {
      //   as: {
      //     tags: string[]
      //     in: string[]
      //   }
      // }
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

// function recursiveSearch<key extends keyof CaughtClipV2>(
//   targetArray: string[], 
//   referenceObject: { [key: string]: CaughtClipV2 }, 
//   referenceProp: key,
//   targetValue: CaughtClipV2[key],
//   left: number = 0, 
//   right: number = targetArray.length - 1
//   ): number {

//   // console.log(left, right, targetArray.length)

//   if (targetArray.length === 0 || left >= right) {
//     return left
//   }

//   let mid = left + Math.floor(right - left / 2)

//   if (referenceObject[targetArray[mid]][referenceProp] === targetValue) {
//     return mid
//   } else {
//     if (typeof targetValue === 'number') {
//       if (referenceObject[targetArray[mid]][referenceProp] > targetValue) {
//         return recursiveSearch(targetArray, referenceObject, referenceProp, targetValue, left, mid-1)
//       } else {
//         return recursiveSearch(targetArray, referenceObject, referenceProp, targetValue, mid+1, right)
//       }
//     } else {
//       if ((referenceObject[targetArray[mid]][referenceProp] as string).localeCompare(targetValue as string) < 0 ) {
//         return recursiveSearch(targetArray, referenceObject, referenceProp, targetValue, left, mid-1)
//       } else {
//         return recursiveSearch(targetArray, referenceObject, referenceProp, targetValue, mid+1, right)
//       }
//     }
//   }
// }


// const insertEpoch = (clipsByStartEpoch: string[], startEpoch: number, clipSlug: string, clips: {[key: string]: CaughtClipV2}): string[] => {
//   const newIndex = recursiveSearch(clipsByStartEpoch, clips, 'startEpoch', startEpoch)
//   return clipsByStartEpoch.splice(newIndex, 0, clipSlug)
// }

// const insertStream = (clipsByStream: string[], broadcasterName: string, clipSlug: string, clips: {[key: string]: CaughtClipV2}): string[] => {
//   const newIndex = recursiveSearch(clipsByStream, clips, 'broadcasterName', broadcasterName)
//   return clipsByStream.splice(newIndex, 0, clipSlug)
// }

// const insertDuration = (clipsByDuration: string[], duration: number, clipSlug: string, clips: {[key: string]: CaughtClipV2}): string[] => {
//   const newIndex = recursiveSearch(clipsByDuration, clips, 'duration', duration)
//   return clipsByDuration.splice(newIndex, 0, clipSlug)
// }

interface ClipsSliceState {
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

export const clipsSlice = createSlice({ 
  name: 'clips',
  initialState,
  reducers: {
    // clipAdded(clips, action: PayloadAction<ClipAddedPayloadV2>) {
    //   clips.clips[action.payload.clip.slug] = action.payload.clip
    //   insertEpoch(clips.clipsByStartEpoch, action.payload.clip.startEpoch || 0, action.payload.clip.slug, clips.clips)
    //   insertStream(clips.clipsByStream, action.payload.clip.broadcasterName, action.payload.clip.slug, clips.clips)
    //   insertDuration(clips.clipsByDuration, action.payload.clip.duration, action.payload.clip.slug, clips.clips)
    // }
  },
  extraReducers: (builder) => {
    builder.addCase(clipAdded, (clips, action: PayloadAction<ClipAddedPayloadV2>) => {
      clips.clips[action.payload.clip.slug] = action.payload.clip
      // insertEpoch(clips.clipsByStartEpoch, action.payload.clip.startEpoch || 0, action.payload.clip.slug, clips.clips)
      // insertStream(clips.clipsByStream, action.payload.clip.broadcasterName, action.payload.clip.slug, clips.clips)
      // insertDuration(clips.clipsByDuration, action.payload.clip.duration, action.payload.clip.slug, clips.clips)
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
    builder.addCase(clipEpochsRetry.fulfilled, (clips, action: PayloadAction<UpdatedClipEpoch[]>) => {
      action.payload.forEach(update => {
        if (update.startEpoch) {
          clips.clips[update.clipSlug].startEpoch = update.startEpoch
        }})
    })
  }
})

export default clipsSlice.reducer