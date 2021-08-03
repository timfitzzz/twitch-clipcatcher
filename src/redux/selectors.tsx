import memoize, { getUntrackedObject } from 'proxy-memoize'
import { RootState } from './store'
import { CaughtClipV2 } from './clips'
import { ICatcherChannel, Sort, SortTypes, UserTypes } from '../types'
import { ChatUser } from './users'

// SINGLE-VALUE SELECTORS

  // STATE
  export const selectChannelNames = memoize((channels: RootState['channels']) => {
    let channelNames = []
    for (let channel in channels) {
      channelNames.push(channel)
    }
    return channelNames
  })


  // SETTINGS
  export const selectPlayerPoppedout = memoize((settings: RootState['settings']) => settings.popoutPlayer)
  export const selectHelpViewActive = memoize((settings: RootState['settings']) => settings.helpViewActive)
  export const selectCurrentChannel = memoize((settings: RootState['settings']) => settings.currentChannel)
  export const selectLeftColumnWidth = memoize((settings: RootState['settings']) => settings.leftColumnWidth)

  // USERS
  export const selectChannelUserType = memoize(([user, channel]: [user: ChatUser, channel: ICatcherChannel]): UserTypes => {
    return user.userTypes[channel.name][0]
  }, { size: 500 })
  export const selectAppUser = memoize((state: RootState) => state.settings.user)
  export const selectAppUserFollows = memoize((state: RootState) => state.settings.user ? state.settings.user.follows : null )
  export const selectUserLoading = memoize((settings: RootState['settings']) => settings.userLoading)

  // CHANNELS
  export const selectChannelSort = memoize((channel: ICatcherChannel) => channel.sort, { size: 500 })
  export const selectChannelError = memoize((channel: ICatcherChannel) => channel.error, { size: 500 })
  export const selectChannelDisplayName = memoize((channel: ICatcherChannel) => channel.displayName, { size: 500 })
  export const selectChannelClipsCount = memoize((channel: ICatcherChannel) => channel.clips.length, { size: 500 })
  export const selectChannelScanning = memoize((channel: ICatcherChannel) => channel.scanning, { size: 50 })
  export const selectChannelUpdateHold = memoize((channel: ICatcherChannel) => channel.holdUpdates, { size: 50 })

  // CLIPS
  export const selectUpvoters = memoize((votesSet: CaughtClipV2['votes'][0]) => votesSet.up,  { size: 500 })
  export const selectDownvoters = memoize((votesSet: CaughtClipV2['votes'][0]) => votesSet.down, { size: 500})
  export const selectViews = memoize((clip: CaughtClipV2) => clip.views, { size: 500 })
  export const selectCreatedAt = memoize((clip: CaughtClipV2) => clip.created_at, { size: 500 })
  export const selectCreatedAtEpoch = memoize((clip: CaughtClipV2) => new Date(clip.created_at).getTime(), { size: 500 })
  export const selectEpoch = memoize((clip: CaughtClipV2) => clip.startEpoch === 0 ? (new Date(clip.created_at).getTime() ) : clip.startEpoch, { size: 500 })
  export const selectDuration = memoize((clip: CaughtClipV2) => clip.duration, { size: 500})
  export const selectStreamerName = memoize((clip: CaughtClipV2 ) => clip.broadcaster.name, { size: 500})
  export const selectWatchedInChannel = memoize(([clip, channel]: [clip: CaughtClipV2, channel: ICatcherChannel]) => !!clip.watchedIn[channel.name], { size: 500 })
  export const selectClipThumbnails = memoize((clip: CaughtClipV2) => clip.thumbnails, { size: 500 })
  export const selectClipTitle = memoize((clip: CaughtClipV2) => clip.title, { size: 500})
  export const selectClipEmbedUrl = memoize((clip: CaughtClipV2) => clip.embed_url, { size: 500 })
  export const selectClipTrackingId = memoize((clip: CaughtClipV2) => clip.tracking_id, { size: 500 })
  export const selectClipMetaedBy = memoize(([ clip, channel ]: [
    clip: CaughtClipV2,
    channel: ICatcherChannel
  ]): null | string[] => {
    return clip.metaedIn && clip.metaedIn[channel.name] ? clip.metaedIn[channel.name].by : null
  }, { size: 500 })

  export const selectClipDramaedBy = memoize(([ clip, channel ]: [
    clip: CaughtClipV2,
    channel: ICatcherChannel
  ]): null | string[] => {
    return clip.dramaedIn && clip.dramaedIn[channel.name] ? clip.dramaedIn[channel.name].by : null
  }, { size: 500 })

  export const selectClipVetoedBy = memoize(([ clip, channel ]: [
    clip: CaughtClipV2,
    channel: ICatcherChannel
  ]): null | string[] => {
    return clip.vetoedIn && clip.vetoedIn[channel.name] ? clip.vetoedIn[channel.name].by : null
  }, { size: 500 })

  // STACKS
  export const selectStackDuration = memoize(([ sort, clips ]: [ sort: Sort, clips: CaughtClipV2[] ]) => {
    // console.log('selectStackDuration')
    if (sort.direction === 'asc') {
      return clips.reduce((shortest: number | null, clip: CaughtClipV2) => {
        let duration = selectDuration(getUntrackedObject(clip) || clip)
        if (shortest === null) {
          return duration
        } else {
          return duration < shortest ? duration : shortest
        }
      }, null as number | null)
    } else {
    return clips.reduce((longest: number | null, clip: CaughtClipV2) => {
        let duration = selectDuration(getUntrackedObject(clip) || clip)
        if (longest === null) {
          return duration
        } else {
          return duration > longest ? duration : longest
        }
      }, null as number | null)
    }
  }, { size: 500})

  export const selectStackDurationRange = memoize((clips: CaughtClipV2[]) => {
    return [
      Math.min(...clips.map(clip => selectDuration(getUntrackedObject(clip) || clip))),
      Math.max(...clips.map(clip => selectDuration(getUntrackedObject(clip) || clip)))
    ]
  }, { size: 500 })

  export const selectStackVoters = memoize((votesSets: { up: string[], down: string[] }[] ) => {
    // console.log('selectStackVoters')
    let upnames: { [name: string]: 1 } = {};
    let downnames: { [name: string]: 1} = {};
    let results: { up: string[], down: string[] } = { up: [], down: [] };

    votesSets.forEach(voteSet => {
      voteSet.up.forEach(userName => {
        if (upnames[userName]) {
          return
        } else {
          upnames[userName] = 1
          results.up.push(userName)
        }
      })
      voteSet.down.forEach(userName => {
        if (downnames[userName]) {
          return
        } else {
          upnames[userName] = 1
          results.down.push(userName)
        }
      })
    })
    return results
  }, { size: 500 })

  // META, DRAMA, VETO
  export const selectStackMetas = memoize(([ clipStack, channel ]: [ 
    clipStack: CaughtClipV2[],
    channel: ICatcherChannel
  ]) => {
    return clipStack.reduce(
      ( 
        returnObj: { 
        metaUsers: string[]
        keyedUsersList: { 
          [userName: string]: 1 
        }
      }, 
        clip: CaughtClipV2
      ) => {
        let clipMetaedBy = selectClipMetaedBy([clip, channel])
        if (clipMetaedBy) {
          clipMetaedBy.forEach(user => {
            if (!returnObj.keyedUsersList[user]) {
              returnObj.keyedUsersList[user] = 1
              returnObj.metaUsers.push(user)
            } 
          })
        }
        return returnObj
    }, { metaUsers: [] as string[], keyedUsersList: {}} ).metaUsers
  }, { size: 500 })

  export const selectStackDramas = memoize(([ clipStack, channel ]: [ 
    clipStack: CaughtClipV2[],
    channel: ICatcherChannel
  ]) => {
    return clipStack.reduce(
      ( 
        returnObj: { 
        dramaUsers: string[]
        keyedUsersList: { 
          [userName: string]: 1 
        }
      }, 
        clip: CaughtClipV2
      ) => {
        let clipDramaedBy = selectClipDramaedBy([clip, channel])
        if (clipDramaedBy) {
          clipDramaedBy.forEach(user => {
            if (!returnObj.keyedUsersList[user]) {
              returnObj.keyedUsersList[user] = 1
              returnObj.dramaUsers.push(user)
            } 
          })
        }
        return returnObj
    }, { dramaUsers: [] as string[], keyedUsersList: {}} ).dramaUsers
  }, { size: 500 })

  export const selectStackVetos = memoize(([ clipStack, channel ]: [ 
    clipStack: CaughtClipV2[],
    channel: ICatcherChannel
  ]) => {
    return clipStack.reduce(
      ( 
        returnObj: { 
        vetoUsers: string[]
        keyedUsersList: { 
          [userName: string]: 1 
        }
      }, 
        clip: CaughtClipV2
      ) => {
        let clipVetoedBy = selectClipVetoedBy([ clip, channel ])
        if (clipVetoedBy) {
          clipVetoedBy.forEach(user => {
            if (!returnObj.keyedUsersList[user]) {
              returnObj.keyedUsersList[user] = 1
              returnObj.vetoUsers.push(user)
            } 
          })
        }
        return returnObj
    }, { vetoUsers: [] as string[], keyedUsersList: {}} ).vetoUsers
  }, { size: 500 })

  export const selectStackViews = memoize((clips: CaughtClipV2[]) => {
    return clips.reduce((total: number, clip: CaughtClipV2) => total + selectViews(getUntrackedObject(clip) || clip), 0)
  }, { size: 500 })

  export const selectStackEpoch = memoize(([dateSort, clips]: [dateSort: Sort, clips: CaughtClipV2[]] ) => {
    if (dateSort.direction === 'asc') {
      return Math.min(...clips.map(clip => selectEpoch(getUntrackedObject(clip) || clip)))
    } else {
      return Math.max(...clips.map(clip => selectEpoch(getUntrackedObject(clip) || clip)))
    }
  }, { size: 500 })

  export const selectStackStreamer = memoize((clips: CaughtClipV2[]) => clips[0].broadcaster.name, { size: 500 })

// MEMOIZED SORT COMPARATOR FUNCTIONS
// these functions are intended to be applied to the array.sort function. since the arguments are provided from state,
// they should memoize and speed up redundant sort operations considerably.
//
// i.e.: (clipIdA, clipIdB) => selectAscendingEpochalSort({clipA: state.clips.clips[clipIdA], clipB: state.clips.clips[clipIdB]})

  // CLIPS

    // START EPOCH
    export const selectAscendingEpochalSort = memoize(([clipA, clipB]: [clipA: CaughtClipV2, clipB: CaughtClipV2]) => {
      // console.log('running ascending sort')
      return (clipA.startEpoch === 0 ? (new Date(clipA.created_at).getTime() ) : clipA.startEpoch) - 
             (clipB.startEpoch === 0 ? (new Date(clipB.created_at).getTime() ) : clipB.startEpoch)
    }, { size: 500 })

    export const selectDescendingEpochalSort = memoize(([clipA, clipB]: [clipA: CaughtClipV2, clipB: CaughtClipV2]) => {
      return (clipB.startEpoch === 0 ? (new Date(clipB.created_at).getTime() ) : clipB.startEpoch) -
             (clipA.startEpoch === 0 ? (new Date(clipA.created_at).getTime() ) : clipA.startEpoch)  
             
    }, { size: 500 })

    // VOTERS
    interface ClipVotesSet {
      up: string[],
      down: string[]
    }

    export const selectAscendingClipVotersSort = memoize(([ votesSetA, votesSetB ]: [ votesSetA: ClipVotesSet, votesSetB: ClipVotesSet ] ) => {
      let upvotersCountA = selectUpvoters(getUntrackedObject(votesSetA) || votesSetA).length
      let upvotersCountB = selectUpvoters(getUntrackedObject(votesSetB) || votesSetB).length
      let downvotersCountA = selectDownvoters(getUntrackedObject(votesSetA) || votesSetA).length
      let downvotersCountB = selectDownvoters(getUntrackedObject(votesSetB) || votesSetB).length
      return ( upvotersCountA - downvotersCountA) - ( upvotersCountB - downvotersCountB )
    }, { size: 500 })


    export const selectDescendingClipVotersSort = memoize(([ votesSetA, votesSetB ]: [ votesSetA: ClipVotesSet, votesSetB: ClipVotesSet ] ) => {
      let upvotersCountA = selectUpvoters(getUntrackedObject(votesSetA) || votesSetA).length
      let upvotersCountB = selectUpvoters(getUntrackedObject(votesSetB) || votesSetB).length
      let downvotersCountA = selectDownvoters(getUntrackedObject(votesSetA) || votesSetA).length
      let downvotersCountB = selectDownvoters(getUntrackedObject(votesSetB) || votesSetB).length
      return (
              upvotersCountB - 
              downvotersCountB
            ) - 
            ( 
              upvotersCountA - 
              downvotersCountA
            )
    }, { size: 500 })



    // VIEWS
    export const selectAscendingClipViewsSort = memoize(([clipA, clipB]: [clipA: CaughtClipV2, clipB: CaughtClipV2 ]) => {
      return selectViews(getUntrackedObject(clipA) || clipA) - selectViews(getUntrackedObject(clipB) || clipB)
    }, { size: 500})

    export const selectDescendingClipViewsSort = memoize(([clipA, clipB]: [clipA: CaughtClipV2, clipB: CaughtClipV2]) => {
      return selectViews(getUntrackedObject(clipB) || clipB) - selectViews(getUntrackedObject(clipA) || clipA)
    }, { size: 500})

    // DURATION
    export const selectAscendingClipDurationSort = memoize(([clipA, clipB]: [clipA: CaughtClipV2, clipB: CaughtClipV2]) => {
      return selectDuration(getUntrackedObject(clipA) || clipA) - selectDuration(getUntrackedObject(clipB) || clipB)
    }, { size: 500})

    export const selectDescendingClipDurationSort = memoize(([clipA, clipB]: [clipA: CaughtClipV2, clipB: CaughtClipV2]) => {
      return selectDuration(getUntrackedObject(clipB) || clipB) - selectDuration(getUntrackedObject(clipA) || clipA)
    }, { size: 500})

    // STREAMER NAME
    export const selectAscendingStreamerSort = memoize(([clipA, clipB]: [clipA: CaughtClipV2, clipB: CaughtClipV2]) => {
      return selectStreamerName(getUntrackedObject(clipA) || clipA).localeCompare(selectStreamerName(getUntrackedObject(clipB) || clipB))
    }, { size: 500})

    export const selectDescendingStreamerSort = memoize(([clipA, clipB]: [clipA: CaughtClipV2, clipB: CaughtClipV2]) => {
      return selectStreamerName(getUntrackedObject(clipB) || clipB).localeCompare(selectStreamerName(getUntrackedObject(clipA) || clipA))
    }, { size: 500})

    // USER PRIVILEGES
    export const selectDescendingPrivilegesSort = memoize(([userA, userB, channel]: [ userA: ChatUser, userB: ChatUser, channel: ICatcherChannel ]) => {
      return selectChannelUserType([userB, channel]) - selectChannelUserType([userA, channel])
    }, { size: 500 })

  // STACKS

    // VOTES
    export const selectStackVotersSort = memoize(
      ([sort, clipStackA, clipStackB, channel]: 
        [ 
          sort: Sort, 
          clipStackA: CaughtClipV2[], 
          clipStackB: CaughtClipV2[], 
          channel: ICatcherChannel
        ]
      ) => {
        // console.log('iteration: stack voters sort')
        let stackVotersA = selectStackVoters((getUntrackedObject(clipStackA) || clipStackA).map(clip => getUntrackedObject(clip.votes[channel.name]) || clip.votes[channel.name]))
        let stackVotersB = selectStackVoters((getUntrackedObject(clipStackB) || clipStackB).map(clip => getUntrackedObject(clip.votes[channel.name]) || clip.votes[channel.name]))

        if (sort.direction === 'asc') {
          return (stackVotersA.up.length - stackVotersA.down.length) - (stackVotersB.up.length - stackVotersB.down.length)
        } else {
          return (stackVotersB.up.length - stackVotersB.down.length) - (stackVotersA.up.length - stackVotersA.down.length)
        }
    }, { size: 500 })
    
    // VIEWS
    export const selectStackViewsSort = memoize(
      ([sort, clipStackA, clipStackB]:
        [
          sort: Sort,
          clipStackA: CaughtClipV2[],
          clipStackB: CaughtClipV2[]
        ]
      ) => {
        // console.log('iteration: stack views sort')
        let stackViewsA = selectStackViews(getUntrackedObject(clipStackA) || clipStackA)
        let stackViewsB = selectStackViews(getUntrackedObject(clipStackB) || clipStackB)

        if (sort.direction === 'asc') {
          return stackViewsA - stackViewsB
        } else {
          return stackViewsB - stackViewsA
        }
      }, { size: 500 })

    // START EPOCH
    export const selectStackEpochSort = memoize(
      ([sort, clipStackA, clipStackB]:
        [
          sort: Sort,
          clipStackA: CaughtClipV2[],
          clipStackB: CaughtClipV2[]
        ]
      ) => {
        // console.log('iteration: stack epoch sort')
        let stackEpochA = selectStackEpoch(
          [
            getUntrackedObject(sort) || sort,
            getUntrackedObject(clipStackA) || clipStackA
          ]
        )
        let stackEpochB = selectStackEpoch(
          [
           getUntrackedObject(sort) || sort,
          getUntrackedObject(clipStackB) || clipStackB
          ]
        )

        if (sort.direction === 'asc') {
          return stackEpochA - stackEpochB
        } else {
          return stackEpochB - stackEpochA
        }
      }, { size: 500 })

    // DURATION
    export const selectStackDurationSort = memoize(
      ([ sort, clipStackA, clipStackB ]: 
        [
          sort: Sort, 
          clipStackA: CaughtClipV2[], 
          clipStackB: CaughtClipV2[]
        ]
      ) => {
        // console.log('iteration: stack duration sort')
        let stackDurationA = selectStackDuration([getUntrackedObject(sort) || sort, getUntrackedObject(clipStackA) || clipStackA])
        let stackDurationB = selectStackDuration([getUntrackedObject(sort) || sort, getUntrackedObject(clipStackB) || clipStackB])
        if (sort.direction === 'asc') {
          return stackDurationA! - stackDurationB!
        } else {
          return stackDurationB! - stackDurationA!
        }
    }, { size: 500 })

    // STREAMERNAME
    export const selectStackStreamerSort = memoize(
      ([ sort, clipStackA, clipStackB ]: 
        [
          sort: Sort,
          clipStackA: CaughtClipV2[],
          clipStackB: CaughtClipV2[]
        ]
      ) => {
        // console.log('iteration: stack streamer sort')
        let stackStreamerA = selectStackStreamer(getUntrackedObject(clipStackA) || clipStackA)
        let stackStreamerB = selectStackStreamer(getUntrackedObject(clipStackB) || clipStackB)
        if (sort.direction === 'asc') {
          return stackStreamerA.localeCompare(stackStreamerB)
        } else {
          return stackStreamerB.localeCompare(stackStreamerA)
        }
      }
    )


// MEMOIZED OTHER

export const selectSortedUserList = memoize(([state, channel, userList]: [
  state: RootState,
  channel: ICatcherChannel,
  userList: string[]
]): string[] => {
  return userList.sort((userNameA, userNameB) => selectDescendingPrivilegesSort([state.users.users[userNameA], state.users.users[userNameB], channel]))
}, { size: 500 })

export const selectSortedSeparatedUserList = memoize(([state, channel, userList]: [
  state: RootState,
  channel: ICatcherChannel,
  userList: string[]
]): [ string[], string[] ] => {
  let sortedUserList = selectSortedUserList([state, channel, userList])
  let foundRegularUser = false
  let checkingUser = 0
  let results: [string[], string[]] = [
    [],[]
  ]
  while (!foundRegularUser && checkingUser < sortedUserList.length) {
    if (state.users.users[sortedUserList[checkingUser]].userTypes[channel.name][0] >= 2) {
      results[0].push(sortedUserList[checkingUser])
    } else {
      foundRegularUser = true
      results[1] = sortedUserList.slice(checkingUser, sortedUserList.length)
    }
    checkingUser++
  }
  return results
}, { size: 500 })

export const doAscendingClipsOverlap = memoize(([clipA, clipB]: [clipA: CaughtClipV2, clipB: CaughtClipV2]) => {
  return clipA.broadcaster.name === clipB.broadcasterName && clipA.startEpoch + (clipA.duration * 1000) >= clipB.startEpoch
}, { size: 500})

// COMPOSITE SELECTORS
export const selectChannelChronology = memoize(
  ([ state, channel ]: [ state: RootState, channel: ICatcherChannel ]) => {
    let clips = channel.clips.map((clipId) => state.clips.clips[clipId])
    return clips.sort((clipA, clipB) => selectAscendingEpochalSort([clipA, clipB]))
}, { size: 500 })

export const selectChannelChronologyWithStacksIfDesired = memoize(
  ([ state, channel ]: [ state: RootState, channel: ICatcherChannel ]) => {
    let channelChronology = channel.clips.map(
      clipId => state.clips.clips[clipId]).sort(
      (clipA, clipB) => selectAscendingEpochalSort(
        [getUntrackedObject(clipA) || clipA, getUntrackedObject(clipB) || clipB]
      )
    )
    if (channel.stackClips) {
      return channelChronology.reduce((output, clip, index) => {
        if (clip) {
          if (!output.broadcasters[clip.broadcasterName]) {    // if we haven't seen this broadcaster yet we can create a new clip stack.
            output.clipStacks.push([clip.slug])
            output.broadcasters[clip.broadcasterName] = output.clipStacks.length - 1                  
            return output
          } else {
            let lastClipStackIndex = output.broadcasters[clip.broadcasterName] // get the last stack saved for this broadcaster.
            let lastClipStack = output.clipStacks[lastClipStackIndex]
            let overlap = clip.startEpoch === 0 ? false : doAscendingClipsOverlap([ state.clips.clips[lastClipStack[lastClipStack.length - 1]],
                                                                                    clip ])
            if (overlap) {  // if the clips overlap, add it to their last stack.
              output.clipStacks[lastClipStackIndex].push(clip.slug)
              return output
            } else {      // if the clips don't overlap, create a new stack and mark it as the last one for this broadcaster.
              output.broadcasters[clip.broadcasterName] = output.clipStacks.length
              output.clipStacks.push([clip.slug])
              return output
            }
          }
        }
        return output
      }, { clipStacks: [], broadcasters: { }} as { clipStacks: string[][], broadcasters: { [broadcasterName: string]: number } }).clipStacks
    } else {
      return channelChronology.map(clip => [clip.slug])
    }
  }, { size: 500 })

export const StacksSortTable = {
  [SortTypes['frogscount']]: selectStackVotersSort,
  [SortTypes['views']]: selectStackViewsSort,
  [SortTypes['date']]: selectStackEpochSort,
  [SortTypes['length']]: selectStackDurationSort,
  [SortTypes['streamername']]: selectStackStreamerSort
}

export const ClipsSortTable = {
  [SortTypes['frogscount']]: {
    'asc': selectAscendingClipVotersSort,
    'desc': selectDescendingClipVotersSort
  },
  [SortTypes['views']]: {
    'asc': selectAscendingClipViewsSort,
    'desc': selectDescendingClipViewsSort
  },
  [SortTypes['date']]: {
    'asc': selectAscendingEpochalSort,
    'desc': selectDescendingEpochalSort
  },
  [SortTypes['length']]: {
    'asc': selectAscendingClipDurationSort,
    'desc': selectDescendingClipDurationSort
  },
  [SortTypes['streamername']]: {
    'asc': selectAscendingStreamerSort,
    'desc': selectDescendingStreamerSort
  }
}

export type ClipsSortByClipTypes = SortTypes.views | SortTypes.date | SortTypes.length | SortTypes.streamername

export const lexSortClips = memoize(([
  clipA,
  clipB,
  channel
]: [
  clipA: CaughtClipV2,
  clipB: CaughtClipV2,
  channel: ICatcherChannel
]) => {
  // console.log(`${clipA.slug} vs ${clipB.slug}`)
  for (let sortNumber = 0; sortNumber < channel.sort.length; sortNumber++) {
    let result = channel.sort[sortNumber].active
      ? channel.sort[sortNumber].type === SortTypes['frogscount']
        ? ClipsSortTable[SortTypes['frogscount']][channel.sort[sortNumber].direction]([(getUntrackedObject(clipA) || clipA).votes[channel.name], (getUntrackedObject(clipB) || clipB).votes[channel.name]])
        : ClipsSortTable[channel.sort[sortNumber].type as ClipsSortByClipTypes][channel.sort[sortNumber].direction]([(getUntrackedObject(clipA) || clipA), (getUntrackedObject(clipB) || clipB)])
      : 0
    if (result !== 0) {
      return result
    }
  }
  
  return 0

}, { size: 1000})

export const selectSortedClips = memoize(([channel, clips]: [channel: ICatcherChannel, clips: CaughtClipV2[]]) => {

  return clips.sort((a,b) => lexSortClips([getUntrackedObject(a) || a, getUntrackedObject(b) || b, channel])).map(clip => clip.slug)

}, { size: 1000})

export const lexSortClipStacks = 
  (channel: ICatcherChannel) => 
    (clipStackA: CaughtClipV2[] | CaughtClipV2, 
     clipStackB: CaughtClipV2[] | CaughtClipV2 ): number => {
  
      let { sort } = channel

      if (!Array.isArray(clipStackA)) {
        clipStackA = [clipStackA]
      }
      if (!Array.isArray(clipStackB)) {
        clipStackB = [clipStackB]
      }

      for (let sortNumber = 0; sortNumber < sort.length; sortNumber++) {
        let result = (
          StacksSortTable[sort[sortNumber].type] as (obj: [sort: Sort, clipStackA: CaughtClipV2[], clipStackB: CaughtClipV2[], channel: ICatcherChannel]) => number
        )([sort[sortNumber], clipStackA, clipStackB, channel])
        if (result !== 0) {
          return result
        }
      }
      return 0
  }

export const lexSortClipStackIds = 
  ([state, channel]: [state: RootState, channel: ICatcherChannel]) => 
    (clipStackA: string[], 
     clipStackB: string[]): number => {

      let { sort } = channel

      for (let sortNumber = 0; sortNumber < sort.length; sortNumber++) {
        if (sort[sortNumber].active) {
          let result = (
            StacksSortTable[sort[sortNumber].type] as (obj: [sort: Sort, clipStackA: CaughtClipV2[], clipStackB: CaughtClipV2[], channel: ICatcherChannel]) => number
          )([ 
            sort[sortNumber], 
            clipStackA.map(clipId => state.clips.clips[clipId]), 
            clipStackB.map(clipId => state.clips.clips[clipId]), 
            channel
          ])
          if (result !== 0) {
            return result
          }
        }
      }
      return 0
  }

export const selectSortedStacks =
  ([ state, channel ]: [ state: RootState, channel: ICatcherChannel ]) => {
    let channelStacks = selectChannelChronologyWithStacksIfDesired([ getUntrackedObject(state) || state, getUntrackedObject(channel) || channel])
    // console.log(`re-ran selectSortedStacks for ${channel.name}, got stacks: `, channelStacks)
    let channelSort = channelStacks.sort(
      (clipIdsA: string[] | string, clipIdsB: string[] | string) => 
        lexSortClipStacks(channel)
          (Array.isArray(clipIdsA) ? clipIdsA.map(clipId => state.clips.clips[clipId]) : state.clips.clips[clipIdsA],
          Array.isArray(clipIdsB) ? clipIdsB.map(clipId => state.clips.clips[clipId]) : state.clips.clips[clipIdsB]))
    return channelSort
  }

export const selectSortedSpecialStackUsers = memoize(
  ([state, clipSlugs, channel, type]: [ state: RootState, clipSlugs: string[], channel: ICatcherChannel, type: 'meta' | 'drama']) => {

    let users = type === 'meta' ? selectStackMetas([clipSlugs.map(clipSlug => state.clips.clips[clipSlug]), channel])
                : type === 'drama' ? selectStackDramas([clipSlugs.map(clipSlug => state.clips.clips[clipSlug]), channel])
                                   : null
    return users ? selectSortedSeparatedUserList([state, channel, users]) : [[],[]]

}, { size: 500 })

export const selectStacksTagsReport = memoize(
  ([channel, clipsTaggedInChannelAs]: [ 
    channel: ICatcherChannel, 
    clipsTaggedInChannelAs: ({ 
      tags: string[], 
      byTag: { 
        [tagName: string]: string[] 
      }
    })[] 
  ]) => {
    let tags = clipsTaggedInChannelAs.reduce(
      (agg: {
        tags: string[], 
        byTag: {
          [tagName: string ]: {
            names: string[],
            namesSeen: { [userName: string]: true }
          }
        }
      }, clipTaggedInChannelAs) => {
        clipTaggedInChannelAs.tags.forEach(tag => {
          if (agg.byTag[tag]) {
            clipTaggedInChannelAs.byTag[tag].forEach(userName => {
              if (!agg.byTag[tag].namesSeen[userName]) {
                agg.byTag[tag].names = [ ...agg.byTag[tag].names, userName ]
                agg.byTag[tag].namesSeen[userName] = true
              }
            })
          } else {
            agg.tags.push(tag)
            agg.byTag[tag] = {
              names: clipTaggedInChannelAs.byTag[tag],
              namesSeen: Object.assign({}, ...clipTaggedInChannelAs.byTag[tag].map(name => ({ [name]: true })))
            }
          }
        })
        return agg
      }, { tags: [], byTag: { } }
    )

    return tags

}, { size: 500 })
  
export const selectStackModerationReport = memoize(
  ([ state, clips, channel ]:
    [
      state: RootState,
      clips: CaughtClipV2[],
      channel: ICatcherChannel
    ]
  ) => {

    let clipStack = clips.map(clip => getUntrackedObject(clip) || clip)

    let stackMetas = selectStackMetas([clipStack, getUntrackedObject(channel) || channel])
    let stackDramas = selectStackDramas([clipStack, getUntrackedObject(channel) || channel])
    let stackVetos = selectStackVetos([clipStack, getUntrackedObject(channel) || channel])
    let sortedMetas = selectSortedSeparatedUserList([getUntrackedObject(state) || state, getUntrackedObject(channel) || channel, stackMetas])
    let sortedDramas = selectSortedSeparatedUserList([getUntrackedObject(state) || state, getUntrackedObject(channel) || channel, stackDramas])

    return {
      sortedMetas,
      sortedDramas,
      vetos: stackVetos
    }
}, { size: 500 })


export const selectStackVoteReport = memoize(([state, clips, channel]: [ state: RootState, clips: CaughtClipV2[], channel: ICatcherChannel]) => {
  let output = {
    upVoters: [] as string[],
    downVoters: [] as string[],
    upvoterTypes: [] as UserTypes[],
    downvoterTypes: [] as UserTypes[]
  }

  let votesSets = clips.map(clip => (getUntrackedObject(clip) || clip).votes[channel.name])

  let stackVoters = selectStackVoters(votesSets)

  output.upVoters = stackVoters.up
  output.downVoters = stackVoters.down

  output.upVoters = output.upVoters.sort((usernameA, usernameB) => 
    state.users.users[usernameB].userTypes[channel.name][0] -
    state.users.users[usernameA].userTypes[channel.name][0]
  )
  output.downVoters = output.downVoters.sort((usernameA, usernameB) => 
    state.users.users[usernameB].userTypes[channel.name][0] -
    state.users.users[usernameA].userTypes[channel.name][0]
  )

  output.upvoterTypes = output.upVoters.reduce((voterTypes, upVoterName) => {
    if (voterTypes.length === 0 || (state.users.users[upVoterName].userTypes[channel.name].indexOf(voterTypes[0]) === -1)) {
      voterTypes.unshift(state.users.users[upVoterName].userTypes[channel.name][0])
      return voterTypes
    } else {
      return voterTypes
    }
  }, [] as UserTypes[])

  output.downvoterTypes = output.downVoters.reduce((voterTypes, downVoterName) => {
    if (voterTypes.length === 0 || (state.users.users[downVoterName].userTypes[channel.name].indexOf(voterTypes[0]) === -1)) {
     voterTypes.unshift(state.users.users[downVoterName].userTypes[channel.name][0])
     return voterTypes
    } else {
      return voterTypes
    }
  }, [] as UserTypes[])

  return output
}, { size: 500 })