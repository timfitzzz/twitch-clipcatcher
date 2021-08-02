import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { TwitchClipV5 } from '../types'
import { UpdatedClipEpoch, UpdatedClipViews } from '../utilities/apiMethods'
import { tagsReport } from '../utilities/parsers'
import { clipAdded, ClipAddedPayloadV2, updateClipViews, clipEpochRetry } from './actions'
import { annotationAdded, annotationsReverted, AnnotationsRevertedPayload, ClipAnnotation, FirstAnnotationAddedPayload } from './annotations'
import { mutateClipByAnnotation, revertClipByAnnotation } from './mutators'

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