import { CaughtClipV2 } from './clips'
import { ClipAnnotation, AnnotationTypes } from './annotations'
import { isEmpowered } from '../utilities/parsers'

export const mutateClipTags = (clip: CaughtClipV2, annotation: ClipAnnotation) => {
  let { taggedIn } = clip
  let { tags: newTags, by, channelName } = annotation

  if (!taggedIn) {
    clip.taggedIn = {}
    taggedIn = clip.taggedIn
  }

  if (newTags && newTags.length > 0) {
    if (!taggedIn[channelName]) {
      taggedIn[channelName] = {
          as: {
            tags: [],
            byTag: {}
          }
        }
    }
      
    newTags.forEach(tag => {
      
      // if the tag is new:
      if (!taggedIn![channelName].as.byTag[tag]) {
        taggedIn![channelName].as.tags.push(tag)
        taggedIn![channelName].as.byTag[tag] = [by]

      } else { // if the tag is not new
        taggedIn![channelName].as.byTag[tag].indexOf(by) === -1 && 
          taggedIn![channelName].as.byTag[tag].push(by)
      }
    })
  }
}

export const revertClipTags = (clip: CaughtClipV2, annotation: ClipAnnotation) => {
  let { tags: annotationTags, by } = annotation
  
  if (!annotationTags || annotationTags.length === 0 || !clip.taggedIn) {
    return
  } else {
    let { as: channelTags } = clip.taggedIn[annotation.channelName]
    for (let i = 0; i < annotationTags.length; i++) {
      let isLastTagger = channelTags.byTag[annotationTags[i]].length === 1
      let tagIdx = channelTags.tags.indexOf(annotationTags[i])
      if (isLastTagger && tagIdx > -1) {
        channelTags.tags.splice(tagIdx, 1)
      }
      if (!isLastTagger) {
        let byIdx = channelTags.byTag[annotationTags[i]].indexOf(by)
        if (byIdx > -1) {
          channelTags.byTag[annotationTags[i]].splice(byIdx, 1)
        }
      } else {
        delete channelTags.byTag[annotationTags[i]]
      }
    }
  }
}

export const mutateClipMeta = (clip: CaughtClipV2, annotation: ClipAnnotation) => {
  let { metaedIn } = clip
  let { meta, channelName, by } = annotation

  if (!metaedIn) {
    clip.metaedIn = {}
    metaedIn = clip.metaedIn
  }

  if (meta) {
    if (!metaedIn[channelName]) {
      metaedIn[channelName] = {
        by: [by]
      }
    } else {
      metaedIn[channelName].by.indexOf(by) === -1 && metaedIn[channelName].by.push(by)
    }
  }
}

export const revertClipMeta = (clip: CaughtClipV2, annotation: ClipAnnotation) => {
  let { meta, by } = annotation

  if (meta && clip.metaedIn && clip.metaedIn[annotation.channelName]) {
    let { metaedIn: { [annotation.channelName]: { by: clipBy } }  } = clip
    let userIdx = clipBy.indexOf(by)
    if (userIdx > -1) {
      clipBy.splice(userIdx, 1)
    }
    if (clipBy.length === 0) {
      delete clip.metaedIn[annotation.channelName]
      if (Object.getOwnPropertyNames(clip.metaedIn).length === 0) {
        delete clip.metaedIn
      }
    }
  }
}

export const mutateClipDrama = (clip: CaughtClipV2, annotation: ClipAnnotation) => {
  let { dramaedIn } = clip
  let { drama, channelName, by } = annotation

  if (!dramaedIn) {
    clip.dramaedIn = {}
    dramaedIn = clip.dramaedIn
  }

  if (drama) {
    if (!dramaedIn[channelName]) {
      dramaedIn[channelName] = {
        by: [by]
      }
    } else {
      dramaedIn[channelName].by.indexOf(by) === -1 && dramaedIn[channelName].by.push(by)
    }
  }
}

export const revertClipDrama = (clip: CaughtClipV2, annotation: ClipAnnotation) => {
  let { drama, by } = annotation

  if (drama && clip.dramaedIn && clip.dramaedIn[annotation.channelName]) {
    let { dramaedIn: { [annotation.channelName]: { by: clipBy } }  } = clip
    let userIdx = clipBy.indexOf(by)
    if (userIdx > -1) {
      clipBy.splice(userIdx, 1)
    }
    if (clipBy.length === 0) {
      delete clip.dramaedIn[annotation.channelName]
      if (Object.getOwnPropertyNames(clip.dramaedIn).length === 0) {
        delete clip.dramaedIn
      }
    }
  }
}

export function mutateClipByAnnotation(clip: CaughtClipV2, annotation: ClipAnnotation) {
  let { channelName, by, annotationTypes, userTypes } = annotation
        
  annotationTypes.forEach(type => {
    switch (type) {
      case AnnotationTypes['link']:
        if (!clip.postedBy[channelName]) {
          clip.postedBy[channelName] = [by]
        } else {
          if (clip.postedBy[channelName].indexOf(by) === -1) {
            clip.postedBy[channelName].push(by)
          }
        }
        break;
      case AnnotationTypes['veto']:
        if (isEmpowered(userTypes)) {
          if (!clip.vetoedIn) {
            clip.vetoedIn = {}
          }
          if (!clip.vetoedIn[channelName]) {
            clip.vetoedIn[channelName] = {
              by: [by]
            }
          } else {
            if (clip.vetoedIn[channelName].by.indexOf(by) === -1) {
              clip.vetoedIn[channelName].by.push(by)
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

export function revertClipByAnnotation(clip: CaughtClipV2, annotation: ClipAnnotation, otherLinkRemains: boolean) {
  let { channelName, by, annotationTypes } = annotation
  

  annotationTypes.forEach(type => {
    switch (type) {
      case AnnotationTypes['link']:
        let { postedBy: { [channelName]: clipPostedBy } } = clip

        // if there's no prior link to this clip by this user, revert this one if appropriate.
        if (!otherLinkRemains) {
          if (clipPostedBy.length > 1) {
            let userIdx = clipPostedBy.indexOf(by)
            userIdx > -1 && clipPostedBy.splice(userIdx, 1)
          } else {
            delete clip.postedBy[channelName]
            // channel.clips.splice(channel.clips.indexOf(annotation.clipSlug)) -- happening in channelsSlice
          }
        }
        break;
      case AnnotationTypes['veto']:
        if (clip.vetoedIn) {
          let { vetoedIn: { [channelName]: { by: channelVetos } } } = clip
          if (channelVetos.length > 1) {
            let userIdx = channelVetos.indexOf(by)
            userIdx > -1 && channelVetos.splice(userIdx, 1)
          } else {
            delete clip.vetoedIn[channelName]
            if (Object.getOwnPropertyNames(clip.vetoedIn).length === 0) {
              delete clip.vetoedIn
            }
          }
        }
        break;
      case AnnotationTypes['upvote']:
        if (!otherLinkRemains) {
          let { votes: { [channelName]: { up: ups } } } = clip
          if (ups.length > 0) {
            let userIdx = ups.indexOf(by)
            userIdx > -1 && ups.splice(userIdx, 1)
          }
        }
        break;
      case AnnotationTypes['downvote']:
        let { votes: { [channelName]: { down: downs }}} = clip
        if (downs.length > 0) {
          let userIdx = downs.indexOf(by)
          userIdx > -1 && downs.splice(userIdx, 1)
        }
        break;
      case AnnotationTypes['tag']:
        revertClipTags(clip, annotation)
        revertClipMeta(clip, annotation)
        revertClipDrama(clip, annotation)
        break;
      default:
        break;
    }
  })
}