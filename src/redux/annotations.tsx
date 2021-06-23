import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit'
import { ClipAnnotation } from '../types'
import { AppDispatch, RootState } from './store'
import { ClipAnnotatedPayload, UserTypes, clipAnnotated } from './clips'

interface AnnotationsSliceState {
  annotations: {
    [messageId: string]: ClipAnnotation
  }
  annotationsByClip: {
    [clipSlug: string]: string[]
  }
  annotationsByChannel: {
    [channelName: string]: string[]
  }
}


export const intakeReply = createAsyncThunk<
  {
    result: string
  },
  {
    channelName: string
    parentMessageId: string
    messageId: string
    messageText: string
    tags: string[]
    userName: string
    userTypes: UserTypes[]
  },
  { 
    dispatch: AppDispatch
    state: RootState
    rejectValue: Error
  }>(
    'messages/intakeReply',
    async({channelName, parentMessageId, messageId, messageText, tags, userName, userTypes}, { getState, rejectWithValue, requestId, dispatch}) => {
      let { clips: { clips }, messages: { messages }} = getState()

      let messageRecord = messages[parentMessageId]
      let clipSlug = messageRecord && clips[messageRecord] ? clips[messageRecord].slug : rejectWithValue(new Error('Not clip reply')) && null

      if (clipSlug) {
        dispatch(clipAnnotated({
          channelName,
          clipSlug,
          messageId,
          annotation: {
            messageText,
            channelName,
            source: userName,
            userTypes,
            drama: tags.indexOf('drama') > -1,
            meta: tags.indexOf('meta') > -1,
            block: tags.indexOf('block') > -1,
            vouch: tags.indexOf('vouch') > -1,
            tags
          }
        }))
  
        return {
          result: 'annotation saved'
        }
      } else {
        return {
          result: 'no annotation found'
        }
      }
    }
  )


const initialState: AnnotationsSliceState = {
  annotations: {},
  annotationsByClip: {},
  annotationsByChannel: {}
}


const annotationsSlice = createSlice({ 
  name: 'annotations',
  initialState,
  reducers: {
  },
  extraReducers: (builder) => {
    builder.addCase(clipAnnotated, (annotations, action: PayloadAction<ClipAnnotatedPayload>) => {
      let { payload }: { payload: ClipAnnotatedPayload} = action
      annotations.annotations[payload.messageId] = payload.annotation
      if (annotations.annotationsByChannel[payload.channelName]) {
        annotations.annotationsByChannel[payload.channelName].push(payload.messageId)
      } else {
        annotations.annotationsByChannel[payload.channelName] = [payload.messageId]
      }
      if (annotations.annotationsByClip[payload.clipSlug]) {
        annotations.annotationsByClip[payload.clipSlug].push(payload.messageId)
      } else {
        annotations.annotationsByClip[payload.clipSlug] = [payload.messageId]
      }
    })
  }
})

export default annotationsSlice.reducer