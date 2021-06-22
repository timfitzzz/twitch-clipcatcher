import { createSlice, configureStore, PayloadAction, SliceCaseReducers, CreateSliceOptions, createAsyncThunk } from '@reduxjs/toolkit'
import { BaseThunkAPI } from '@reduxjs/toolkit/dist/createAsyncThunk'
import { RejectedWithValueActionFromAsyncThunk } from '@reduxjs/toolkit/dist/matchers'
import { TwitchPrivateMessage } from 'twitch-chat-client/lib/StandardCommands/TwitchPrivateMessage'
import { ApiClient } from 'twitch/lib'
import { StringLiteralType } from 'typescript'
import { CaughtClipV2, ClipAnnotation, TwitchClipV5 } from '../types'
import { AppDispatch, RootState } from './store'
import { ClipAddedPayloadV2, ClipReaddedPayloadV2, ClipAnnotatedPayload } from './clips'
import { clipAdded as clipAddedV1, ClipAddedPayload } from './channels'

interface MessagesSliceState {
  messages: {
    [messageId: string]: string
  }
}

const initialState: MessagesSliceState = {
  messages: {}
}


const messagesSlice = createSlice({ 
  name: 'messages',
  initialState,
  reducers: {
    clipAddedV1(messages, action: PayloadAction<ClipAddedPayload>) {
      messages.messages[action.payload[2]] = action.payload[1].slug
    },
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