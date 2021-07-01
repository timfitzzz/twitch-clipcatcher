import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { HelixUser } from 'twitch/lib'
import { getUserInfo } from './actions'

interface SettingsSliceState {
  user?: {
    userName: string
    profilePicUrl: string
  }
  userLoading: boolean
}

const initialState: SettingsSliceState = {
  userLoading: false
}

const settingsSlice = createSlice({ 
  name: 'settings',
  initialState,
  reducers: {
  },
  extraReducers: (builder) => {
    builder.addCase(getUserInfo.pending, (settings) => {
      settings.userLoading = true
    })
    builder.addCase(getUserInfo.rejected, (settings) => {
      settings.userLoading = false
    })
    builder.addCase(getUserInfo.fulfilled, (settings, action: PayloadAction<HelixUser | null>) => {
      if (action.payload) {
        settings.user = { userName: action.payload.name, profilePicUrl: action.payload.profilePictureUrl }
      }
      settings.userLoading = false
    })
  }
})

export default settingsSlice.reducer