import React from "react";
import { TwitchPrivateMessage } from "twitch-chat-client/lib/StandardCommands/TwitchPrivateMessage";

export interface TwitchClipV5 {
  slug: string
  tracking_id: string
  url: string
  embed_url: string
  embed_html: string
  broadcaster: {
    id: string
    name: string
    display_name: string
    channel_url: string
    logo: string
  }
  curator: {
    id: string
    name: string
    display_name: string
    channel_url: string
    logo: string
  }
  vod: {
    id: string
    url: string
    offset: number
  }
  game: string
  language: string
  title: string
  views: number
  duration: number
  created_at: string
  thumbnails: {
    medium: string
    small: string
    tiny: string
  }

}

export interface CaughtClip extends TwitchClipV5 {
  broadcasterName: string
  postedBy: {
      userId: TwitchPrivateMessage['userInfo']['userId']
      userName: TwitchPrivateMessage['userInfo']['userName']
      isMod: boolean
      isVip: boolean
      isBroadcaster: boolean
    }[]
  postedByBroadcaster?: boolean
  postedByMod?: boolean
  postedByVip?: boolean
  gtarpFlair?: string[]
  startEpoch?: number
}

// export interface CaughtClipV2 extends TwitchClipV5 {
//   broadcasterName: string
//   postedBy: {
//     [channelName: string]: {
//       userId: TwitchPrivateMessage['userInfo']['userId']
//       userName: TwitchPrivateMessage['userInfo']['userName']
//       isMod: boolean
//       isVip: boolean
//       isBroadcaster: boolean
//     }[]
//   }
//   annotations: {
//     [channelName: string]: ClipAnnotation[]
//   }
//   startEpoch?: number
//   postedByBroadcaster?: boolean
//   postedByMod?: boolean
//   postedByVip?: boolean
//   vod: {
//     id: string,
//     url: string,
//     offset: number
//   }
// }


// export interface ChannelClip {
//   postedBy: {
//     userId: TwitchPrivateMessage['userInfo']['userId']
//     userName: TwitchPrivateMessage['userInfo']['userName']
//     isMod: boolean
//     isVip: boolean
//     isBroadcaster: boolean
//   }[]
// }

export interface OIDCUserData {
  id_token: string
  access_token: string
  token_type: string
  scope: string
  profile: {
    sub?: string
    azp?: string
    preferred_username?: string
  }
}

declare module 'react' {
  interface ClipProps<T> extends React.IframeHTMLAttributes<T> {
    allowfullscreen: boolean
    parent: string
    preload: string
  }
}

declare module 'oidc-client' {
  interface OidcClientSettings {
    metadataSeed?: any
  }
}

export enum SortTypes {
  frogscount,
  views,
  date,
  length,
  streamername
}


export enum ChannelFilters { 
  sameChannel,
  otherChannels,
  allChannels
}

export enum SubmitterFilters {
  specialFrogs,
  normalFrogs,
  allFrogs
}

export enum TrinaryFilterState {
  'none',
  'only',
  'off'
}

export interface Filters {
  meta: TrinaryFilterState
  drama: TrinaryFilterState
  faves: TrinaryFilterState
  today: TrinaryFilterState
  trusted: TrinaryFilterState
  moderated: TrinaryFilterState
  otherChannels: TrinaryFilterState
}

export enum FilterNames {
  'meta' = 'meta',
  'drama' = 'drama',
  'faves' = 'faves',
  'today' = 'today',
  'trusted' = 'trusted',
  'moderated' = 'moderated',
  'otherChannels' = 'otherChannels'
}

export const defaultFilters: Filters = {
  meta: TrinaryFilterState.off,
  drama: TrinaryFilterState.off,
  faves: TrinaryFilterState.off,
  today: TrinaryFilterState.off,
  trusted: TrinaryFilterState.off,
  moderated: TrinaryFilterState.off,
  otherChannels: TrinaryFilterState.off
}

export interface Sort {
  type: SortTypes
  active: boolean
  direction: 'desc' | 'asc'
}

export type SortList = Sort[]

export const defaultSort: SortList = [{
  type: SortTypes.frogscount,
  active: false,
  direction: 'desc'
 },
 {
  type: SortTypes.views,
  active: false,
  direction: 'desc'
 },
 {
   type: SortTypes.length,
   active: false,
   direction: 'desc'
 },
 {
   type: SortTypes.streamername, 
   active: false,
   direction: 'desc'
 },
 {
   type: SortTypes.date,
   active: false,
   direction: 'desc'
 }]



export interface ICatcherChannel {
  name: string
  scanning: boolean
  holdUpdates: boolean
  clips: string[]
  sort: SortList
  filters: Filters
  postersByClip: {
    [clipSlug: string]: string[]
  }
}

export enum UserTypes {
  'user',
  'sub',
  'broadcaster',
  'mod',
  'vip'
}