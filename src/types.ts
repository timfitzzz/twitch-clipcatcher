import React from "react";
import { ChatMessageRequest } from "twitch-chat-client/lib/ChatClient";
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
  onGtarp?: boolean
  onLSF?: boolean
  gtarpFlair?: string[]
}

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

export enum SortTypes {
  frogscount,
  frogstatus,
  date,
  length,
  viewscount,
  none
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

export interface Filters {
  showMeta: boolean
  showDrama: boolean
  onlyFaves: boolean
  onlyToday: boolean
  whichSubmitters: SubmitterFilters
  whichChannels: ChannelFilters
}

export const defaultFilters: Filters = {
  showMeta: true,
  showDrama: true,
  onlyFaves: false,
  onlyToday: false,
  whichSubmitters: SubmitterFilters.allFrogs,
  whichChannels: ChannelFilters.allChannels,
}
