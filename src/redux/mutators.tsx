import { CaughtClipV2, ClipPostedBy } from './clips'
import { ClipAnnotation, AnnotationTypes } from './annotations'
import { UserTypes } from '../types'
import { isEmpowered, isUserType } from '../utilities/parsers'

export const mutateClipTags = (clip: CaughtClipV2, annotation: ClipAnnotation) => {
  let { taggedIn: startTags } = clip
  let { tags: newTags, userTypes, channelName, messageId } = annotation

  if (!startTags) {
    clip.taggedIn = {}
    startTags = clip.taggedIn
  }

  if (newTags && newTags.length > 0) {
    if (!startTags[channelName]) {
      startTags[channelName] = {
        overall: {
          as: {
            tags: [],
            countByTag: {},
            in: []
          }
        }
      }
    }
      
    newTags.forEach(tag => {
      startTags[channelName].overall.as.in.push(messageId)
      // if the tag is new:
      if (startTags[channelName].overall.as.tags.indexOf(tag) === -1) {
        startTags[channelName].overall.as.tags.push(tag)
        startTags[channelName].overall.as.countByTag[tag] = 1
  
        for (let userType in UserTypes) {
          if (isUserType(userTypes, UserTypes[userType as keyof typeof UserTypes])) {
            if (UserTypes[userType as keyof typeof UserTypes] !== UserTypes['broadcaster']) {
              let userTypeKey = `by${userType.charAt(0).toUpperCase() + userType.slice(1)}s` as 'byUsers' | 'bySubs' | 'byVips' | 'byMods'
              if (!startTags[channelName][userTypeKey]) {
                startTags[channelName][userTypeKey] = {
                  as: {
                    tags: [tag],
                    countByTag: {[tag]: 1},
                    in: [messageId]
                  }
                }
              } else {
                startTags[channelName][userTypeKey]!.as.tags.push(tag)
                startTags[channelName][userTypeKey]!.as.countByTag[tag] = 1
                startTags[channelName][userTypeKey]!.as.in.push(messageId)
              }
            } else {
              if (!startTags[channelName].byBroadcaster) {
                startTags[channelName].byBroadcaster = {
                  as: {
                    tags: [tag],
                    in: [messageId]
                  }
                }
              } else {
                startTags[channelName].byBroadcaster!.as.tags.push(tag)
                startTags[channelName].byBroadcaster!.as.in.push(messageId)
              }
  
            }
          }
        }
      } else { // if the tag is not new
        startTags[channelName].overall.as.countByTag[tag]++
        for (let userType in UserTypes) {
          if (isUserType(userTypes, UserTypes[userType as keyof typeof UserTypes])) {
            if (UserTypes[userType as keyof typeof UserTypes] !== UserTypes['broadcaster']) {
              let userTypeKey = `by${userType.charAt(0).toUpperCase() + userType.slice(1)}s` as 'byUsers' | 'bySubs' | 'byVips' | 'byMods'
              if (!startTags[channelName][userTypeKey]) {
                startTags[channelName][userTypeKey] = {
                  as: {
                    tags: [],
                    countByTag: {},
                    in: [messageId]
                  }
                }
              } else {
                startTags[channelName][userTypeKey]!.as.in.push(messageId)
              }
              if (startTags[channelName][userTypeKey]!.as.tags.indexOf(tag) === -1) {
                startTags[channelName][userTypeKey]!.as.tags.push(tag)
                startTags[channelName][userTypeKey]!.as.countByTag[tag] = 1
              } else {
                startTags[channelName][userTypeKey]!.as.countByTag[tag]++
              }
            } else {
              if (!startTags[channelName].byBroadcaster) {
                startTags[channelName].byBroadcaster = {
                  as: {
                    tags: [],
                    in: [messageId]
                  }
                }
              } else {
                startTags[channelName].byBroadcaster!.as.in.push(messageId)
              }
              if (startTags[channelName].byBroadcaster!.as.tags.indexOf(tag) === -1) {
                startTags[channelName].byBroadcaster!.as.tags.push(tag)
              }
            }
          }
        }
      }
    })
  }
}

export const mutateClipMeta = (clip: CaughtClipV2, annotation: ClipAnnotation) => {
  let { metaedIn } = clip
  let { meta, channelName, messageId, userTypes, by } = annotation

  if (!metaedIn) {
    clip.metaedIn = {}
    metaedIn = clip.metaedIn
  }

  if (meta) {
    if (!metaedIn[channelName]) {
      metaedIn[channelName] = {
        by: {},
        in: [messageId]
      }
    } else {
      metaedIn[channelName].in.push(messageId)
    }
  
    for (let userType in UserTypes) {
      if (isUserType(userTypes, UserTypes[userType as keyof typeof UserTypes])) {
        if (UserTypes[userType as keyof typeof UserTypes] !== UserTypes['broadcaster']) {
          let userTypeKey = `${userType}s` as 'users' | 'subs' | 'vips' | 'mods'
          if (!metaedIn[channelName].by[userTypeKey]) {
            metaedIn[channelName].by[userTypeKey] = [by]
          } else {
            metaedIn[channelName].by[userTypeKey]!.push(by)
          }
        } else {
          metaedIn[channelName].by.broadcaster = true
        }
      }
    }
  }
}

export const mutateClipDrama = (clip: CaughtClipV2, annotation: ClipAnnotation) => {
  let { dramaedIn } = clip
  let { drama, channelName, messageId, userTypes, by } = annotation

  if (!dramaedIn) {
    clip.dramaedIn = {}
    dramaedIn = clip.dramaedIn
  }

  if (drama) {
    if (!dramaedIn[channelName]) {
      dramaedIn[channelName] = {
        by: {},
        in: [messageId]
      }
    } else {
      dramaedIn[channelName].in.push(messageId)
    }
  
    for (let userType in UserTypes) {
      if (isUserType(userTypes, UserTypes[userType as keyof typeof UserTypes])) {
        if (UserTypes[userType as keyof typeof UserTypes] !== UserTypes['broadcaster']) {
          let userTypeKey = `${userType}s` as 'users' | 'subs' | 'vips' | 'mods'
          if (!dramaedIn[channelName].by[userTypeKey]) {
            dramaedIn[channelName].by[userTypeKey] = [by]
          } else {
            dramaedIn[channelName].by[userTypeKey]!.push(by)
          }
        } else {
          dramaedIn[channelName].by.broadcaster = true
        }
      }
    }
  }
}


export function mutateClipByAnnotation(clip: CaughtClipV2, annotation: ClipAnnotation) {
  let { channelName, by, annotationTypes, userTypes, messageId } = annotation
        
  annotationTypes.forEach(type => {
    switch (type) {
      case AnnotationTypes['link']:
        
        if (!clip.postedBy[channelName]) {
          clip.postedBy[channelName] = {}
        }

        for (let userType in UserTypes) {
          if (UserTypes[userType as keyof typeof UserTypes] !== UserTypes['broadcaster']) {
            if (isUserType(userTypes, UserTypes[userType as keyof typeof UserTypes])) {
              if (clip.postedBy[channelName][`${userType}s` as keyof Omit<ClipPostedBy, 'broadcaster'>]) {
                if (clip.postedBy[channelName][`${userType}s` as keyof Omit<ClipPostedBy, 'broadcaster'>]!.indexOf(by) === -1) {
                  clip.postedBy[channelName][`${userType}s` as keyof Omit<ClipPostedBy, 'broadcaster'>]!.push(by)
                }
              } else {
                clip.postedBy[channelName][`${userType}s` as keyof Omit<ClipPostedBy, 'broadcaster'>] = [by]
              }
            }
          } else {
            clip.postedBy[channelName].broadcaster = true
          }
        }
        break;
      case AnnotationTypes['veto']:
        if (isEmpowered(userTypes)) {
          if (!clip.vetoedIn[channelName]) {
            clip.vetoedIn[channelName] = {
              by: [by],
              in: [messageId]
            }
          } else {
            if (clip.vetoedIn.channelName.by.indexOf(by) === -1) {
              clip.vetoedIn.channelName.by.push(by)
              clip.vetoedIn.channelName.in.push(messageId)
            }
          }
        }
        break;
      case AnnotationTypes['upvote']:
        if (!clip.votes[channelName]) {
          clip.votes[channelName] = { up: [], down: [] }
        }
        if (clip.votes[channelName].up.indexOf(by) === -1) {
          clip.votes[channelName].up.push(by)
        }
        let downIndex = clip.votes[channelName].down.indexOf(by)
        if (downIndex !== -1) {
          clip.votes[channelName].down.splice(downIndex, 1)
        }
        break;
      case AnnotationTypes['downvote']:
        if (!clip.votes[channelName]) {
          clip.votes[channelName] = { up: [], down: []}
        }
        if (clip.votes[channelName].down.indexOf(by) === -1) {
          clip.votes[channelName].down.push(by)
        }
        let upIndex = clip.votes[channelName].up.indexOf(by)
        if (upIndex !== -1) {
          clip.votes[channelName].up.splice(upIndex, 1)
        }
        break;
      case AnnotationTypes['tag']:      
        mutateClipTags(clip, annotation)
        mutateClipMeta(clip, annotation)
        mutateClipDrama(clip, annotation)
        break;
      default:
        break;
    }
  })
}