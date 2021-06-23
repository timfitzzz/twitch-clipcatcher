import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit'
import { AppDispatch, RootState } from './store'
import { ClipAddedPayloadV2, ClipReaddedPayloadV2, ClipAnnotatedPayload, UserTypes, clipAnnotated } from './clips'
import { clipAdded as clipAddedV1, ClipAddedPayload } from './channels'

interface MessagesSliceState {
  messages: {
    [messageId: string]: string
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


const initialState: MessagesSliceState = {
  messages: {}
}


const messagesSlice = createSlice({ 
  name: 'messages',
  initialState,
  reducers: {
    clipAdded(messages, action: PayloadAction<ClipAddedPayloadV2>) {
      messages.messages[action.payload.messageId] = action.payload.clip.slug
    },
    clipReadded(messages, action: PayloadAction<ClipReaddedPayloadV2>) {
      messages.messages[action.payload.readdedBy.messageId] = action.payload.clipSlug
    },
    clipAnnotated(messages, action: PayloadAction<ClipAnnotatedPayload>) {
      messages.messages[action.payload.messageId] = action.payload.clipSlug
    }
  },
  extraReducers: (builder) => {
    builder.addCase(clipAddedV1, (messages, action: PayloadAction<ClipAddedPayload>) => {
      let { payload }: { payload: ClipAddedPayload} = action
      messages.messages[payload[2]] = action.payload[1].slug
    })
  }
})

export default messagesSlice.reducer