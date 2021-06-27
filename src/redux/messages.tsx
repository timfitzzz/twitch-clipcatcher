import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { annotationAdded, AnnotationAddedPayload } from './annotations'
import { clipAdded } from './clips'
import { ClipAddedPayloadV2 } from './clips'

interface MessagesSliceState {
  messages: {
    [messageId: string]: string
  }
}

const initialState: MessagesSliceState = {
  messages: {}
}

interface MessageParsedPayload {
  messageId: string
  clipSlug: string
}

const messagesSlice = createSlice({ 
  name: 'messages',
  initialState,
  reducers: {
    messageParsed(messages, action: PayloadAction<MessageParsedPayload>) {
      messages.messages[action.payload.messageId] = action.payload.clipSlug
    }
  },
  extraReducers: (builder) => {
    builder.addCase(clipAdded.type, (messages, action: PayloadAction<ClipAddedPayloadV2 >) => {
      messages.messages[action.payload.messageId] = action.payload.clip.slug

    })
    builder.addCase(annotationAdded.type, (messages, action: PayloadAction<AnnotationAddedPayload>) => {
      messages.messages[action.payload.annotation.messageId] = action.payload.annotation.clipSlug
    })
  }
})

export const { messageParsed } = messagesSlice.actions
console.log( messageParsed )
export default messagesSlice.reducer