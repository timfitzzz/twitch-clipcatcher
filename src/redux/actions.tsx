import { createAction, createAsyncThunk } from "@reduxjs/toolkit"
import { ApiClient, HelixUser } from "twitch/lib"
import { TwitchClipV5, UserTypes } from '../types'
import { fetchUserInfo, retryClipEpoch, UpdatedClipEpoch, UpdatedClipViews } from "../utilities/apiMethods"
import { getAnnotationTypes, parseTags } from "../utilities/parsers"
import { annotationAdded, annotationsReverted, ClipAnnotation, firstAnnotationAdded } from "./annotations"
import { CaughtClipV2 } from "./clips"
import { mutateClipByAnnotation } from "./mutators"
import { AppDispatch, RootState } from "./store"

// chat api:
// non-reply message:
// https://www.twitch.tv/streamname/clips/clipname || https://clips.twitch.tv/clipname -- add or upvote clip
// include tags as discrete words before or after the clip link
//
// reply message:
// +1 || -1 -- upvote or downvote clip
// include tags as discrete words before or after the clip leak
//
// mod commands:
// the following tags are special if sent by a mod or the channel owner: block, meta, drama

export interface ClipAddedPayloadV2 { 
  channelName: string
  clip: CaughtClipV2
  messageId: string
  userName: string
}


export const clipAdded = createAction('clipAdded', (payload: ClipAddedPayloadV2) => {
  return {payload}
})

// intakeClip: handle message with detected clip.
// ----------------------------------------------
// possible results: clipAdded || clipAnnotated

export const intakeClip = createAsyncThunk<
{ 
  result: string
  clip?: CaughtClipV2
  error?: string
  annotation?: ClipAnnotation
},
{ 
  channelName: string
  words: string[]
  clipSlug: string
  userName: string
  userTypes: UserTypes[]
  messageId: string
  // msg: TwitchPrivateMessage,
  getClipMeta: (clipSlug: string) => Promise<TwitchClipV5>
  getVodEpoch: (vodId: string, offset: number) => Promise<number | undefined>
},
{
  dispatch: AppDispatch
  state: RootState
  rejectValue: Error
}>(
  'intakeClip',
  async({channelName, words, clipSlug, userTypes, messageId, userName, getClipMeta, getVodEpoch}, { getState, rejectWithValue, requestId, dispatch }) => {
    let { clips: { clips: { [clipSlug]: clip } } } = getState()
    let tagReport = parseTags(words)
    let annotationTypes = getAnnotationTypes(tagReport, true)

    let newAnnotation = {
      annotationTypes,
      clipSlug,
      channelName,
      by: userName,
      userTypes,
      messageId,
      messageEpoch: new Date().getTime(),
      ...tagReport
    }

    if (clip) {   // if clip exists, this is just an annotation
      dispatch(annotationAdded({
        annotation: newAnnotation
      }))
      return { result: 'exists', annotation: newAnnotation}

    } else {    // if clip doesn't exist, it's a new clip
      let clipMeta: Partial<CaughtClipV2> | undefined;
      let startEpoch: number | undefined

      try {
        clipMeta = await getClipMeta(clipSlug) as Partial<CaughtClipV2>
      } catch (err) {
        rejectWithValue(err)
      }

      if (clipMeta && clipMeta.vod) {
        try {
          startEpoch = await getVodEpoch(clipMeta.vod.id, clipMeta.vod.offset)
        } catch (err) {
          rejectWithValue(err)
        }
      }
  
      if (clipMeta) {
        let preProcessedClip: CaughtClipV2 = {
          ...clipMeta as CaughtClipV2,
          startEpoch: startEpoch || 0,
          firstSeenAnnotation: messageId,
          broadcasterName: clipMeta!.broadcaster!.name,
          postedBy: {},
          votes: { [channelName]: { up: [], down: [] }},
          watchedIn: {}
          // votes: { [channelName]: newAnnotation.upvote ? { up: [userName], down: [] } : newAnnotation.downvote ? { down: [userName], up: [] } : { up: [], down: [] } }
        }
        mutateClipByAnnotation(preProcessedClip, newAnnotation)
        dispatch(clipAdded({
          channelName,
          clip: preProcessedClip,
          messageId,
          userName
        }))
        dispatch(firstAnnotationAdded({
          annotation: newAnnotation
        }))
        return { result: 'new', clip: preProcessedClip}
      } else {
        let err = new Error('Clip meta not found')
        rejectWithValue(err)
        return { result: 'error', error: err.toString() }
      }
    }
})

// intakeReply: process message that is a reply but does not contain a clip link

export const intakeReply = createAsyncThunk<
  {
    result: string
  },
  {
    channelName: string
    parentMessageId: string
    messageId: string
    words: string[]
    userName: string
    userTypes: UserTypes[]
    clipSlug?: string
    getClipMeta: (clipSlug: string) => Promise<TwitchClipV5>
    getVodEpoch: (vodId: string, offset: number) => Promise<number | undefined>
  },
  { 
    dispatch: AppDispatch
    state: RootState
    rejectValue: Error
  }>(
    'intakeReply',
    async({clipSlug, channelName, parentMessageId, messageId, words, userName, userTypes, getClipMeta, getVodEpoch}, { getState, rejectWithValue, requestId, dispatch}) => {
      let { clips: { clips }, messages: { messages }} = getState()

      let messageRecord = messages[parentMessageId]
      
      // handle possibility that this is all in reference to a brand new clip, in which case
      // we want to switch to the regular intakeClip flow.
      if (clipSlug && !clips[clipSlug]) {
        dispatch(intakeClip({
          channelName,
          userName,
          words,
          clipSlug,
          userTypes,
          messageId,
          getClipMeta,
          getVodEpoch
        }))
        return { result: 'new clip found, forwarded to intakeclip'}
      } else {
        let parentClipSlug = messageRecord && clips[messageRecord] ? clips[messageRecord].slug : rejectWithValue(new Error('Not clip reply')) && null

        if (clipSlug || parentClipSlug) {     // prefer clipSlug if there is a difference

          let tagReport = parseTags(words)
          let annotationTypes = getAnnotationTypes(tagReport, false)
      
          let newAnnotation: ClipAnnotation = {
            annotationTypes,
            clipSlug: (clipSlug || parentClipSlug)!,
            channelName,
            by: userName,
            userTypes,
            messageId,
            messageEpoch: new Date().getTime(),
            ...tagReport
          }

          dispatch(annotationAdded({
            annotation: newAnnotation
          }))
    
          return {
            result: 'annotation saved'
          }
          
        } else {
          return {
            result: 'no annotation found'
          }
        }
      }
      
      
    }
  )

  export const clipEpochRetry = createAsyncThunk<
  UpdatedClipEpoch,
  {
    clipSlug: string,
    apiClient: ApiClient
  },
  {
    dispatch: AppDispatch
    state: RootState
    rejectValue: Error
  }>(
    'clipEpochRetry',
    async({clipSlug, apiClient}, {getState, rejectWithValue, requestId, dispatch}) => {
      let newClipEpoch = retryClipEpoch(clipSlug, apiClient).catch(err => { console.log(err); return { clipSlug, startEpoch: 0 } })
      // console.log(newClipEpoch)
      await newClipEpoch
      // console.log('awaited for ', newClipEpoch)
      return newClipEpoch
    }
  )


  export const updateClipEpochs = createAsyncThunk<
  string,
  {
    apiClient: ApiClient
  },
  { state: RootState, dispatch: AppDispatch }>(
    'updateClipEpochs',
    async({ apiClient}, { getState, dispatch }) => {
      let { clips: { clips } } = getState()
  
      let epochsToRefresh = Object.getOwnPropertyNames(clips).reduce((clipSlugs: string[], clipSlug: string) => {
  
        if (clips[clipSlug].startEpoch === 0) {
          if ((new Date(clips[clipSlug].created_at)).getTime() > (new Date()).getTime() - 360000) {
            clipSlugs.push(clipSlug)
          }
        }
  
        return clipSlugs
  
      }, [])
      
      function refreshNextEpoch() {
        if (epochsToRefresh.length > 0) {
          dispatch(clipEpochRetry({clipSlug: epochsToRefresh.shift()!, apiClient}))
          if (epochsToRefresh.length > 0) {
            setTimeout( () => refreshNextEpoch(), 2000)
          }
        }
      }

      refreshNextEpoch()

      while(epochsToRefresh.length > 0){
        await new Promise(resolve => setTimeout(resolve, 1000))
      }
      
      return 'refreshing epochs'
    }
  )

export const updateClipViews = createAsyncThunk<
{ result: UpdatedClipViews[] | string },
{ apiClient: ApiClient },
{
  dispatch: AppDispatch
  state: RootState
}>(
  'updateClipViews',
  async({ apiClient }, { dispatch, getState }) => {
    let { clips: { clips } } = getState()
    let clipSlugs = Object.getOwnPropertyNames(clips)
    // generate sets of 100
    let clipSets: string[][] = []

    while (clipSlugs.length > 100) {
      clipSets.push(clipSlugs.splice(0, 100))
    }
    clipSets.push(clipSlugs)

    let updatedViews: UpdatedClipViews[] = []

    while (clipSets.length > 0) {
      let clips = await apiClient.helix.clips.getClipsByIds(clipSets.shift()!)
      updatedViews = updatedViews.concat(clips.map(clip => ({ slug: clip.id, views: clip.views })))
    }

    updatedViews = updatedViews.filter(updateReport => updateReport.views !== clips[updateReport.slug].views)
    if (updatedViews && updatedViews.length > 0) {
      return {
        result: updatedViews
      }
    } else {
      return {
        result: 'no updated views found'
      }
    }
  }
)

export interface GetUserInfoPayload extends Pick<HelixUser, 'name' | 'profilePictureUrl'> {
  follows: string[]
}

export const getUserInfo = createAsyncThunk<
  GetUserInfoPayload | null,
{
  userName: string,
  apiClient: ApiClient
},
{
  dispatch: AppDispatch
  state: RootState
  rejectValue: Error
}>(
  'getUserInfo',
  async({userName, apiClient}, { getState, rejectWithValue, requestId, dispatch}) => {
    return fetchUserInfo(userName, apiClient)
  }
)


export const messageRemoved = createAsyncThunk<
string,
{
  messageId: string
},
{ 
  dispatch: AppDispatch
  state: RootState
  rejectValue: Error
}>(
  'messageRemoved',
  async({messageId}, {getState, rejectWithValue, requestId, dispatch}) => {
    let { annotations } = getState()
    let annotationToRevert = annotations.annotations[messageId]
    let { by, clipSlug } = annotationToRevert
    let prevUserAnnotations = annotations.annotationsByUser[by][clipSlug].map(messageId => annotations.annotations[messageId])

    if (annotationToRevert) {

      // we need to determine whether there's a previous link annotation for this clip
      // to decide whether a link or upvote should be reversed.
      let otherLinkRemains: boolean = prevUserAnnotations.filter(prevAnnotation => 
        prevAnnotation.channelName === annotationToRevert.channelName
        && prevAnnotation.annotationTypes[0] === 0
        && prevAnnotation.messageId !== annotationToRevert.messageId
      ).length > 0


      // revertClipByAnnotation(clips.clips[annotationToRevert.clipSlug], annotationToRevert)
      dispatch(annotationsReverted({annotations: [annotationToRevert], otherLinkRemains}))
      return "successfully reverted annotation for removed message id " + messageId
    } else {
      return "no annotation found for removed message with id " + messageId
    }
  }
)

// userTimedOut -- to be used when the chat client event "onTimeout"
// occurs (a user is timed out, which has a secondary effect of wiping
// some quantity of their previous messages). therefore we'll 
// respond to this event by reverting any impact this user's 
// annotations have had.

export const userTimedOut = createAsyncThunk<
  string,
  {
    channelName: string,
    userName: string
  },
  {
    dispatch: AppDispatch,
    state: RootState
  }>(
    'userTimedOut',
    async ({channelName, userName}, { dispatch, getState }) => {
      let { annotations } = getState()

      // for this we'll use the annotations.annotationsByUser
      // record. unfortunately, it indexes them by clipSlug, and 
      // not by channelName. a future optimization would be to add
      // an index by channelName.

      let { [userName]: userAnnotations } = annotations.annotationsByUser

      if (userAnnotations) {
        let userAnnotationsForChannel: string[] = []

        Object.getOwnPropertyNames(userAnnotations).forEach(
          (clipSlug: string) => userAnnotations[clipSlug].forEach(
              (annotationId: string) => {
                if (annotations.annotations[annotationId].channelName === channelName) {
                  userAnnotationsForChannel.push(annotationId)
                }
              })
          )
        userAnnotationsForChannel.forEach(messageId => dispatch(messageRemoved({messageId})))
        return `removed ${userAnnotationsForChannel.length} annotations for ${userName} in ${channelName}`
      } else {
        return `no annotations found for channel ${channelName} by user ${userName}`
      }

    }
  )