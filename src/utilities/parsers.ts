import { HelixClip } from "@twurple/api/lib"
import { TwitchPrivateMessage } from "@twurple/chat/lib/commands/TwitchPrivateMessage"
import { AnnotationTypes } from "../redux/annotations"
import { TwitchClipV5, UserTypes } from "../types"

export const parseUserType = (userInfo: TwitchPrivateMessage ['userInfo'], sub: 0 | 1): UserTypes[] => {
  let response = [UserTypes['user']]
  sub === 1 && response.push(UserTypes['sub'])
  userInfo.isMod && response.push(UserTypes['mod'])
  userInfo.isVip && response.push(UserTypes['vip'])
  userInfo.isBroadcaster && response.push(UserTypes['broadcaster'])
  return response.sort((typeA, typeB) => typeB - typeA)
}

export interface tagsReport {
  upvote: boolean
  downvote: boolean
  veto: boolean
  meta: boolean
  drama: boolean
  tags: string[]
}

export const parseTags = (words: string[]): tagsReport => ({
  upvote: words.indexOf('+1') > -1,
  downvote: words.indexOf('-1') > -1,
  veto: words.indexOf('veto') > -1,
  meta: words.indexOf('meta') > -1,
  drama: words.indexOf('drama') > -1,
  tags: words.filter(tag => tag.length >= 3 && tag !== "veto" && tag !== 'drama' && tag !== 'meta')
})

export const getAnnotationTypes = (tagReport: tagsReport, hasLink: boolean): AnnotationTypes[] => {
  let types = []

  if (hasLink) {
    if (!tagReport.downvote && !tagReport.meta && !tagReport.drama && !tagReport.veto) {
      types.push(AnnotationTypes['link'])
      types.push(AnnotationTypes['upvote'])
    } else {
      types.push(AnnotationTypes['link'])
    }
  } else {
    if (tagReport.upvote && !tagReport.downvote) {
      types.push(AnnotationTypes['upvote'])
    }
  }
  
  tagReport.downvote && !tagReport.upvote && types.push(AnnotationTypes['downvote'])
  tagReport.veto && types.push(AnnotationTypes['veto']);
  (tagReport.drama || tagReport.meta || tagReport.tags.length > 0) && types.push(AnnotationTypes['tag'])
  
  return types
}

export const isUserType = (types: UserTypes[], type: UserTypes) => {
  return types.indexOf(type) > -1
}

export const isEmpowered = (types: UserTypes[]) => {
  return types.indexOf(UserTypes['mod']) > -1 || types.indexOf(UserTypes['broadcaster']) > -1 
}

export const userTypeReport = (types: UserTypes[]) => {
  return {
    isMod: isUserType(types, UserTypes['mod']),
    isVip: isUserType(types, UserTypes['vip']),
    isBroadcaster: isUserType(types, UserTypes['broadcaster']),
    isSub: isUserType(types, UserTypes['sub'])
  }
}

export const px = (n: any) => (typeof n === 'number' ? n + 'px' : n);

// export const addUserTypes = (userName: string, postedBy: ClipPostedBy = {}, types: UserTypes[]) => {
//   let index = 0;

//   function applyType(type: UserTypes) {
//     switch (type) {
//       case UserTypes['broadcaster']:
//         postedBy.broadcaster = true;
//         break;
//       case UserTypes['mod']:
//         postedBy.mods = postedBy.mods ? [...postedBy.mods, userName] : [userName]
//         break;
//       case UserTypes['vip']:
//         postedBy.vips = postedBy.vips ? [...postedBy.vips, userName] : [userName]
//         break;
//       case UserTypes['sub']:
//         postedBy.subs = postedBy.subs ? [...postedBy.subs, userName] : [userName]
//         break;
//       case UserTypes['user']:
//         postedBy.users = postedBy.users ? [...postedBy.users, userName] : [userName]
//         break;
//       default:
//         break;
//     }
//   }

//   while (index < types.length) {
//     applyType(types[index])
//     index++
//   }
  
//   return postedBy
// }

export const helixClipToKraken = async (helixClip: HelixClip): Promise<TwitchClipV5> => {

  const broadcaster = await helixClip.getBroadcaster();
  const creator = await helixClip.getCreator();
  const vod = await helixClip.getVideo();

  return {
    slug: helixClip.id,
    tracking_id: helixClip.id,
    url: helixClip.url,
    embed_url: helixClip.embedUrl,
    broadcaster: {
      id: broadcaster.id,
      name: broadcaster.name,
      display_name: broadcaster.displayName,
      channel_url: `https://twitch.tv/${broadcaster.name}`,
      logo: broadcaster.profilePictureUrl
    },
    curator: {
      id: creator.id,
      name: creator.name,
      display_name: creator.displayName,
      channel_url: `https://twitch.tv/${creator.name}`,
      logo: creator.profilePictureUrl
    },
    vod: {
      id: vod.id,
      url: vod.url,
      offset: helixClip.vodOffset,
      preview_image_url: vod.thumbnailUrl
    },
    broadcast_id: helixClip.videoId,
    game: helixClip.gameId,
    language: helixClip.language,
    title: helixClip.title,
    views: helixClip.views,
    duration: helixClip.duration,
    created_at: helixClip.creationDate.toISOString(),
    thumbnails: {
      medium: helixClip.thumbnailUrl,
      small: helixClip.thumbnailUrl,
      tiny: helixClip.thumbnailUrl,
    }
  }
}