import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { getUserInfo, GetUserInfoPayload } from './actions'
import { channelRemoved, ChannelRemovedPayload } from './channels'

interface SettingsSliceState {
  user?: {
    userName: string
    profilePicUrl: string
    follows: string[]
  }
  userLoading: boolean
  currentChannel: string | -1
  leftColumnWidth: number
  popoutPlayer: boolean
  helpViewActive: boolean
}

const initialState: SettingsSliceState = {
  userLoading: false,
  currentChannel: -1,
  leftColumnWidth: 321,
  popoutPlayer: false,
  helpViewActive: false
}

interface ChannelChangedPayload {
  newChannel: string | -1
}


type LeftColumnWidthAdjustedPayload = number



const settingsSlice = createSlice({ 
  name: 'settings',
  initialState,
  reducers: {
    helpViewActivated(settings, action: PayloadAction<undefined>) {
      settings.helpViewActive = true
    },
    helpViewDeactivated(settings, action: PayloadAction<undefined>) {
      settings.helpViewActive = false
    },
    playerPoppedOut(settings, action: PayloadAction<undefined>) {
      settings.popoutPlayer = true
    },
    playerPoppedIn(settings, action: PayloadAction<undefined>) {
      settings.popoutPlayer = false
    },
    leftColumnWidthAdjusted(settings, action: PayloadAction<LeftColumnWidthAdjustedPayload>) {
      settings.leftColumnWidth =
        (action.payload >= 321) ? action.payload : 321
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
    builder.addCase(getUserInfo.fulfilled, (settings, action: PayloadAction<GetUserInfoPayload | null>) => {
      if (action.payload) {
        settings.user = { userName: action.payload.name, profilePicUrl: action.payload.profilePictureUrl, follows: action.payload.follows }
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

export const { helpViewActivated, helpViewDeactivated, channelChanged, userLoggedOut, leftColumnWidthAdjusted, playerPoppedOut, playerPoppedIn } = settingsSlice.actions
export default settingsSlice.reducer