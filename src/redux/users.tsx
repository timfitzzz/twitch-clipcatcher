import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { UserTypes } from '../types'
import { annotationAdded, AnnotationAddedPayload, firstAnnotationAdded, FirstAnnotationAddedPayload } from './annotations'
import { clipAdded, ClipAddedPayloadV2 } from './actions'

interface ChatUser {
  userName: string
  annotations: string[]
  userTypes: {
    [channelName: string]: UserTypes[]
  }
}

interface UsersSliceState {
  users: {
    [userName: string]: ChatUser
  }
}

const initialState: UsersSliceState = {
  users: {}
}

const usersSlice = createSlice({ 
  name: 'users',
  initialState,
  reducers: {
  },
  extraReducers: (builder) => {
    builder.addCase(clipAdded, (users, action: PayloadAction<ClipAddedPayloadV2>) => {
      let { userName, channelName } = action.payload
      if (!users.users[userName]) {
        users.users[userName] = {
          userName,
          annotations: [],
          userTypes: {
            [channelName]: []
          }
        }
      }
    })
    builder.addCase(firstAnnotationAdded.type, (users, action: PayloadAction<FirstAnnotationAddedPayload>) => {
      let { by, messageId, userTypes, channelName } = action.payload.annotation
      if (!users.users[by])  {
        users.users[by] = 
          { userName: by, 
            annotations: [messageId], 
            userTypes: { 
              [channelName]: userTypes
            }
          }
        } else {
          users.users[by].annotations.push(messageId)
          users.users[by].userTypes[channelName] = userTypes
        }
    })
    builder.addCase(annotationAdded.type, (users, action: PayloadAction<AnnotationAddedPayload>) => {
      let { by, messageId, userTypes, channelName } = action.payload.annotation
      if (!users.users[by])  {
        // console.log('initializing users')
        users.users[by] = 
          { userName: by, 
            annotations: [messageId], 
            userTypes: { 
              [channelName]: userTypes
            }
          }
      } else {
        // console.log(`user ${by} found`)
        users.users[by].annotations.push(messageId)
        users.users[by].userTypes[channelName] = userTypes
      }
    })
  }
})

export default usersSlice.reducer