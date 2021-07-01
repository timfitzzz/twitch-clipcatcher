import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { annotationAdded, AnnotationAddedPayload } from './annotations'
import { clipAdded, ClipAddedPayloadV2 } from './actions'

interface Event {
  startEpoch: number
  endEpoch: number
  clipSlugs: string[]
}

interface EventsSliceState {
  eventsByChannel: {
    [channelName: string]: Event[]
  }
}

const initialState: EventsSliceState = {
  eventsByChannel: {}
}

const eventsSlice = createSlice({ 
  name: 'events',
  initialState,
  reducers: {
  },
  extraReducers: (builder) => {
  //   builder.addCase(clipAdded.type, (events, action: PayloadAction<ClipAddedPayloadV2 >) => {
  //     let clipEndEpoch = action.payload.clip.startEpoch + action.payload.clip.duration * 1000,
  //     if (!events.eventsByChannel[action.payload.channelName]) {
  //       events.eventsByChannel[action.payload.channelName] = [
  //         {
  //           startEpoch: action.payload.clip.startEpoch,
  //           endEpoch: clipEndEpoch,
  //           clipSlugs: [action.payload.clip.slug]
  //         }
  //       ]
  //     } else {
  //       let firstIndexAfter: number;
  //       let lastIndexBefore: number;
  //       let overlappingEventIndex: number;
  //       events.eventsByChannel[action.payload.channelName].forEach(event => {
  //         let endsAfterStart = event.endEpoch > action.payload.clip.startEpoch
  //         let startsBeforeEnd = event.startEpoch < clipEndEpoch

  //         if (endsAfterStart && )
          
  //         )


  //       })

  //     }

  //   })
  }
})

// export const { messageParsed } = messagesSlice.actions
// console.log( messageParsed )
export default eventsSlice.reducer