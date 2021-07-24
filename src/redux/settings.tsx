import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { HelixUser } from 'twitch/lib'
import { getUserInfo } from './actions'
import { channelRemoved, ChannelRemovedPayload } from './channels'
import { RootState } from './store'

interface SettingsSliceState {
  user?: {
    userName: string
    profilePicUrl: string
  }
  userLoading: boolean
  currentChannel: string | -1
  leftColumnWidth: number
  popoutPlayer: boolean
}

const initialState: SettingsSliceState = {
  userLoading: false,
  currentChannel: -1,
  leftColumnWidth: 312,
  popoutPlayer: false
}

interface ChannelChangedPayload {
  newChannel: string | -1
}
type LeftColumnWidthAdjustedPayload = number

export const selectAppUser = (state: RootState) => state.settings.user

const settingsSlice = createSlice({ 
  name: 'settings',
  initialState,
  reducers: {
    playerPoppedOut(settings, action: PayloadAction<undefined>) {
      settings.popoutPlayer = true
    },
    playerPoppedIn(settings, action: PayloadAction<undefined>) {
      settings.popoutPlayer = false
    },
    leftColumnWidthAdjusted(settings, action: PayloadAction<LeftColumnWidthAdjustedPayload>) {
      settings.leftColumnWidth =
        (action.payload > 312) ? action.payload : 312
    },
    channelChanged(settings, action: PayloadAction<ChannelChangedPayload>) {
      settings.currentChannel = action.payload.newChannel
    },
    userLoggedOut(settings, action: PayloadAction<undefined>) {
      delete settings.user
    }
  },
  extraReducers: (builder) => {
    builder.addCase(getUserInfo.pending, (settings) => {
      settings.userLoading = true
    })
    builder.addCase(getUserInfo.rejected, (settings) => {
      settings.userLoading = false
    })
    builder.addCase(getUserInfo.fulfilled, (settings, action: PayloadAction<Pick<HelixUser, 'name' | 'profilePictureUrl'> | null>) => {
      if (action.payload) {
        settings.user = { userName: action.payload.name, profilePicUrl: action.payload.profilePictureUrl }
      }
      settings.userLoading = false
    })
    builder.addCase(channelRemoved, (settings, action: PayloadAction<ChannelRemovedPayload>) => {
      if (action.payload) {
        if (settings.currentChannel === action.payload) {
          settings.currentChannel = -1
        }
      }
    })
  }
})

export const { channelChanged, userLoggedOut, leftColumnWidthAdjusted, playerPoppedOut, playerPoppedIn } = settingsSlice.actions
export default settingsSlice.reducer