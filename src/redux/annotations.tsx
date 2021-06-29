import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { UserTypes } from '../types'

export enum AnnotationTypes {
  'link',
  'upvote',
  'downvote',
  'tag',
  'veto'
}

export interface ClipAnnotation {
  annotationTypes: AnnotationTypes[]
  channelName: string
  clipSlug: string
  by: string
  userTypes: UserTypes[]
  tags?: string[]
  meta?: boolean
  drama?: boolean
  veto?: boolean
  upvote?: boolean
  downvote?: boolean
  messageId: string
  messageEpoch: number
  reverted?: boolean
}

interface AnnotationsSliceState {
  annotations: {
    [messageId: string]: ClipAnnotation
  }
  annotationsByClip: {
    [clipSlug: string]: {
      [channelName: string]: string[]
    }
  }
  annotationsByChannel: {
    [channelName: string]: string[]
  }
  annotationsByUser: {
    [userName: string]: {
      [clipName: string]: string[]
    }
  }
}


// export const intakeReply = createAsyncThunk<
//   {
//     result: string
//   },
//   {
//     channelName: string
//     parentMessageId: string
//     messageId: string
//     messageText: string
//     tags: string[]
//     userName: string
//     userTypes: UserTypes[]
//   },
//   { 
//     dispatch: AppDispatch
//     state: RootState
//     rejectValue: Error
//   }>(
//     'messages/intakeReply',
//     async({channelName, parentMessageId, messageId, messageText, tags, userName, userTypes}, { getState, rejectWithValue, requestId, dispatch}) => {
//       let { clips: { clips }, messages: { messages }} = getState()

//       let messageRecord = messages[parentMessageId]
//       let clipSlug = messageRecord && clips[messageRecord] ? clips[messageRecord].slug : rejectWithValue(new Error('Not clip reply')) && null

//       if (clipSlug) {
//         dispatch(clipAnnotated({
//           channelName,
//           clipSlug,
//           messageId,
//           annotation: {
//             annotationTypes: 
//             messageText,
//             channelName,
//             by: userName,
//             userTypes,
//             drama: tags.indexOf('drama') > -1,
//             meta: tags.indexOf('meta') > -1,
//             block: tags.indexOf('block') > -1,
//             vouch: tags.indexOf('vouch') > -1,
//             tags
//           }
//         }))
  
//         return {
//           result: 'annotation saved'
//         }
//       } else {
//         return {
//           result: 'no annotation found'
//         }
//       }
//     }
//   )

export interface AnnotationAddedPayload {
  annotation: ClipAnnotation
}

export interface FirstAnnotationAddedPayload {
  annotation: ClipAnnotation
}

export interface AnnotationsRevertedPayload {
  annotations: ClipAnnotation[]
}

const initialState: AnnotationsSliceState = {
  annotations: {},
  annotationsByClip: {},
  annotationsByChannel: {},
  annotationsByUser: {}
}


const annotationsSlice = createSlice({ 
  name: 'annotations',
  initialState,
  reducers: {
    annotationsReverted(annotations, action: PayloadAction<AnnotationsRevertedPayload>) {
      for (let i = 0; i < action.payload.annotations.length; i++) {
        if (annotations.annotations[action.payload.annotations[i].messageId]) {
          annotations.annotations[action.payload.annotations[i].messageId].reverted = true
        }
      }
    },
    annotationAdded(annotations, action: PayloadAction<AnnotationAddedPayload>) {
      let { payload }: { payload: AnnotationAddedPayload } = action
      let { channelName, messageId, clipSlug, by } = payload.annotation
      annotations.annotations[payload.annotation.messageId] = payload.annotation
      if (annotations.annotationsByChannel[channelName]) {
        annotations.annotationsByChannel[channelName].push(messageId)
      } else {
        annotations.annotationsByChannel[channelName] = [messageId]
      }
      // we know there's already annotations for this clip since it's not firstAnnotationAdded
      // but we don't know whether there's an object for the channel
      if (annotations.annotationsByClip[clipSlug][channelName]) {
        annotations.annotationsByClip[clipSlug][channelName].push(messageId)
      } else {
        annotations.annotationsByClip[clipSlug][channelName] = [messageId]
      }
      // for user, we'll need to stack annotations even from the same clip
      if (annotations.annotationsByUser[by]) {
        if (annotations.annotationsByUser[by][clipSlug]) {
          annotations.annotationsByUser[by][clipSlug].push(messageId)
        } else {
          annotations.annotationsByUser[by][clipSlug] = [messageId]
        }
      } else {
        annotations.annotationsByUser[by] = {
          [clipSlug]: [messageId]
        }
      }
      // in clips, we'll need to handle updating votes, vetoedIn, and tags
      // to reflect the new annotation.
    },
    firstAnnotationAdded(annotations, action: PayloadAction<FirstAnnotationAddedPayload>) {
      let { payload }: { payload: AnnotationAddedPayload } = action
      let { channelName, messageId, clipSlug, by } = payload.annotation
      
      annotations.annotations[messageId] = payload.annotation

      if (annotations.annotationsByChannel[channelName]) {
        annotations.annotationsByChannel[channelName].push(messageId)
      } else {
        annotations.annotationsByChannel[channelName] = [messageId]
      }
      if (annotations.annotationsByClip[clipSlug]) {
        if (annotations.annotationsByClip[clipSlug][channelName]) {
          annotations.annotationsByClip[clipSlug][channelName].push(messageId)
        } else {
          annotations.annotationsByClip[clipSlug][channelName] = [messageId]
        }
      } else {
        annotations.annotationsByClip[clipSlug] = {
          [channelName]: [messageId]
        }
      }
      // we know there's no annotations for this clip by this user because we've
      // never seen this clip before. but we don't know if there are annotations
      // from this user for other clips.
      if (annotations.annotationsByUser[by]) {
        annotations.annotationsByUser[by][clipSlug] = [messageId]
      } else {
        annotations.annotationsByUser[by] = {
          [clipSlug]: [messageId]
        }
      }
      // we don't need to handle anything else in clips for this action because 
      // the first annotation is generated when the clip is first added from the 
      // same information.
    }
  },
  extraReducers: (builder) => {
  }
})

export const { annotationAdded, firstAnnotationAdded, annotationsReverted } = annotationsSlice.actions
export default annotationsSlice.reducer