import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { TwitchClipV5 } from '../types'
import { tagsReport } from '../utilities/parsers'
import { annotationAdded, ClipAnnotation, FirstAnnotationAddedPayload } from './annotations'
import { mutateClipByAnnotation } from './mutators'

export interface ClipPostedBy {
  broadcaster?: boolean,
  mods?: string[],
  vips?: string[],
  subs?: string[],
  users?: string[]
}

export interface CaughtClipV2 extends TwitchClipV5 {
  votes: {
    [channelName: string]: {
      up: string[]
      down: string[]
    }
  }
  broadcasterName: string
  startEpoch: number
  vetoedIn: {
    [channelName: string]: {
      by: string[]
      in: string[]
    }
  }
  vod: {
    id: string,
    url: string,
    offset: number
  }
  firstSeenAnnotation: string
  postedBy: {
    [channelName: string]: ClipPostedBy
  }
  taggedIn: {
    [channelName: string]: {
      overall: {
        as: {
          tags: string[],
          countByTag: {
            [tag: string]: number
          }
          in: string[]
        }
      }
      byUsers?: {
        as: {
          tags: string[],
          countByTag: {
            [tag: string]: number
          }
          in: string[]
        }
      }
      bySubs?: {
        as: {
          tags: string[],
          countByTag: {
            [tag: string]: number
          }
          in: string[]
        }
      }
      byVips?: {
        as: {
          tags: string[],
          countByTag: {
            [tag: string]: number
          }
          in: string[]
        }
      }
      byMods?: {
        as: {
          tags: string[],
          countByTag: {
            [tag: string]: number
          }
          in: string[]
        }
      }
      byBroadcaster?: {
        as: {
          tags: string[]
          in: string[]
        }
      }
    }
  }
  metaedIn: {
    [channelName: string]: {
      by: {
        users?: string[]
        subs?: string[]
        vips?: string[]
        mods?: string[]
        broadcaster?: boolean
      }
      in: string[]
    }
  }
  dramaedIn: {
    [channelName: string]: {
      by: {
        users?: string[]
        subs?: string[]
        vips?: string[]
        mods?: string[]
        broadcaster?: boolean
      }
      in: string[]
    }
  }
}

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
  watchedClips: string[]
  watchingClip: string | null,
  playlist: string[]
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
  playlist: []
}

export interface ClipAddedPayloadV2 { 
  channelName: string
  clip: CaughtClipV2
  messageId: string
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

export const clipsSlice = createSlice({ 
  name: 'clips',
  initialState,
  reducers: {
    clipAdded(clips, action: PayloadAction<ClipAddedPayloadV2>) {
      clips.clips[action.payload.clip.slug] = action.payload.clip
      insertEpoch(clips.clipsByStartEpoch, action.payload.clip.startEpoch || 0, action.payload.clip.slug, clips.clips)
      insertStream(clips.clipsByStream, action.payload.clip.broadcasterName, action.payload.clip.slug, clips.clips)
      insertDuration(clips.clipsByDuration, action.payload.clip.duration, action.payload.clip.slug, clips.clips)
    },
    clipsTruthUpdated(clips, action: PayloadAction<ClipsTruthUpdatedPayload>) {
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
    builder.addCase(annotationAdded.type, (clips, action: PayloadAction<FirstAnnotationAddedPayload>) => {
      let { clipSlug } = action.payload.annotation
      let clip = clips.clips[clipSlug]
      mutateClipByAnnotation(clip, action.payload.annotation)
    })
  }
})

export const { clipAdded, clipsTruthUpdated } = clipsSlice.actions;
export default clipsSlice.reducer