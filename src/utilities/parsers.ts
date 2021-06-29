import { TwitchPrivateMessage } from "twitch-chat-client/lib/StandardCommands/TwitchPrivateMessage"
import { AnnotationTypes } from "../redux/annotations"
import { UserTypes } from "../types"

export const parseUserType = (userInfo: TwitchPrivateMessage ['userInfo'], sub: 0 | 1): UserTypes[] => {
  let response = [UserTypes['user']]
  sub === 1 && response.push(UserTypes['sub'])
  userInfo.isMod && response.push(UserTypes['mod'])
  userInfo.isVip && response.push(UserTypes['vip'])
  userInfo.isBroadcaster && response.push(UserTypes['broadcaster'])
  return response
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
  tags: words.filter(tag => tag.length >= 4 && tag !== "veto" && tag !== 'drama' && tag !== 'meta')
})

export const getAnnotationTypes = (tagReport: tagsReport, hasLink: boolean): AnnotationTypes[] => {
  let types = []
  hasLink && types.push(AnnotationTypes['link'])
  hasLink && !tagReport.downvote && types.push(AnnotationTypes['upvote'])
  !hasLink && tagReport.upvote && !tagReport.downvote && types.push(AnnotationTypes['upvote'])
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
