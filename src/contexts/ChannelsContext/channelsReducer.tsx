import { CaughtClip } from '../../types';

export interface ICatcherChannel {
  name: string;
  scanning: boolean;
  clips: CaughtClip[];
}

export interface IChannelsReducerState {
  channels: {
    [streamName: string]: ICatcherChannel
  }
  currentScanned: {
    [streamName: string]: number
  }
}

export function initChannelState(channelName: string): ICatcherChannel {
  return {
    name: channelName,
    scanning: true,
    clips: [],
  };
}

export enum ChannelActions {
  ADD_CHANNEL,
  REMOVE_CHANNEL,
  START_SCANNING,
  STOP_SCANNING,
  CLEAR_CHANNEL,
  ADD_CLIP,
  UPDATE_CLIP_POSTED_BY,
  UPDATE_CLIP_META,
  UPDATE_SCANNED,
}

interface AddChannelAction {
  type: ChannelActions.ADD_CHANNEL;
  payload: string;
}
 
interface RemoveChannelAction {
  type: ChannelActions.REMOVE_CHANNEL;
  payload: string;
}

interface StartScanningAction {
  type: ChannelActions.START_SCANNING;
  payload: string;
}

interface StopScanningAction {
  type: ChannelActions.STOP_SCANNING;
  payload: string;
}

interface ClearChannelAction {
  type: ChannelActions.CLEAR_CHANNEL;
  payload: string;
}

interface AddClipAction {
  type: ChannelActions.ADD_CLIP
  payload: [streamName: string, clip: CaughtClip]
}

interface UpdateClipPostedByAction {
  type: ChannelActions.UPDATE_CLIP_POSTED_BY
  payload: [streamName: string, clip: CaughtClip, clipIndex: number]
}

interface IncrementScannedAction {
  type: ChannelActions.UPDATE_SCANNED
  payload: { [streamName: string]: number }
}

export type ChannelAction =
  | AddChannelAction
  | RemoveChannelAction
  | StartScanningAction
  | StopScanningAction
  | ClearChannelAction
  | AddClipAction
  | IncrementScannedAction
  | UpdateClipPostedByAction;

function channelDataReducer(
  state: IChannelsReducerState,
  action: ChannelAction
): IChannelsReducerState {
  // console.log('processing action: ', action);
  switch (action.type) {
    case ChannelActions.ADD_CHANNEL:
      return { 
              ...state, 
               channels: {
                 ...state.channels,
                 [action.payload]: initChannelState(action.payload)
               }
            };
    case ChannelActions.REMOVE_CHANNEL:
      let { [action.payload]: goodbyeChannel, ...otherChannels } = state.channels;
      return { 
        ...state, 
        channels: otherChannels 
      };
    case ChannelActions.START_SCANNING:
      return {
        ...state,
        channels: {
          ...state.channels,
          [action.payload]: { 
            ...state.channels[action.payload], 
            scanning: true 
          }
        }
      };
    case ChannelActions.STOP_SCANNING:
      return {
        ...state,
        channels: {
          ...state.channels,
          [action.payload]: { 
            ...state.channels[action.payload], 
            scanning: false 
          },
        } 
      };
    case ChannelActions.CLEAR_CHANNEL:
      return {
        ...state,
          channels: {
            ...state.channels,
            [action.payload]: initChannelState(action.payload)
          }
      };
    case ChannelActions.ADD_CLIP:

      

      return {
        ...state,
        channels: {
          ...state.channels,
          [action.payload[0]]: {
            ...state.channels[action.payload[0]],
            clips: [
              ...state.channels[action.payload[0]].clips, action.payload[1]
            ]
          }
        }
      };
    case ChannelActions.UPDATE_CLIP_POSTED_BY:
      let existingClip = state.channels[action.payload[0]].clips[action.payload[2]];
      let existingPostedBy = existingClip.postedBy.filter(
        (userInfo) => userInfo.userId === action.payload[1].postedBy[0].userId
      );

      if (existingPostedBy.length === 0) {
        let newPostedBy = [
          ...state.channels[action.payload[0]].clips[action.payload[2]].postedBy,
          action.payload[1].postedBy[0],
        ];

        let newClipState = {
          ...state.channels[action.payload[0]].clips[action.payload[2]],
          postedBy: newPostedBy,
          postedByMod: existingClip.postedByMod
            ? true
            : action.payload[1].postedByMod,
          postedByVip: existingClip.postedByVip
            ? true
            : action.payload[1].postedByVip,
          postedByBroadcaster: existingClip.postedByBroadcaster
            ? true
            : action.payload[1].postedByBroadcaster
        };

        return {
          ...state,
          channels: {
            ...state.channels,
            [action.payload[0]]: {
              ...state.channels[action.payload[0]],
              clips: state.channels[action.payload[0]].clips.splice(
                action.payload[2],
                1,
                newClipState
              ),
            }
          },
        };
      } else {
        return state;
      }
    case ChannelActions.UPDATE_SCANNED:
      return {
        ...state,
        currentScanned: action.payload
      }
  }
}

export default channelDataReducer;
