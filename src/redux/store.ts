import { configureStore } from '@reduxjs/toolkit'
import channelsReducer from './channels'

export const store = configureStore({
  reducer: {
    channels: channelsReducer
  }
});

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>;