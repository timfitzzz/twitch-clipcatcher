import { configureStore } from '@reduxjs/toolkit'
import channelsReducer from './channels'
import clipsReducer from './clips'
import messagesReducer from './messages'

export const store = configureStore({
  reducer: {
    channels: channelsReducer,
    clips: clipsReducer,
    messages: messagesReducer
  }
});

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>;