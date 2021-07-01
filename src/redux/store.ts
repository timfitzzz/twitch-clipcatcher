import { configureStore } from '@reduxjs/toolkit'
import channelsReducer from './channels'
import clipsReducer from './clips'
import messagesReducer from './messages'
import annotationsReducer from './annotations'
import usersReducer from './users'
import settingsReducer from './settings'

export const store = configureStore({
  reducer: {
    channels: channelsReducer,
    clips: clipsReducer,
    messages: messagesReducer,
    annotations: annotationsReducer,
    users: usersReducer,
    settings: settingsReducer
  }
});

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>;