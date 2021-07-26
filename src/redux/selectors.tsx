import memoize, { getUntrackedObject } from 'proxy-memoize'
import { RootState } from './store'
import { CaughtClipV2 } from './clips'
import { ICatcherChannel, Sort, SortTypes, UserTypes } from '../types'
import { ChatUser } from './users'

// SINGLE-VALUE SELECTORS

  // SETTINGS
  export const selectPlayerPoppedout = memoize(({settings}: { settings: RootState['settings'] }) => settings.popoutPlayer)

  // USERS
  export const selectChannelUserType = memoize(({user, channel}: {user: ChatUser, channel: ICatcherChannel}): UserTypes => {
    return user.userTypes[channel.name][0]
  }, { size: 500 })

  // CHANNELS
  export const selectChannelSort = memoize((channel: ICatcherChannel) => channel.sort, { size: 500 })

  // CLIPS
  export const selectUpvoters = memoize(({ votesSet }: { votesSet: CaughtClipV2['votes'][0] }) => votesSet.up,  { size: 500 })
  export const selectDownvoters = memoize(({ votesSet } : { votesSet: CaughtClipV2['votes'][0] }) => votesSet.down, { size: 500})
  export const selectViews = memoize(({clip}: { clip: CaughtClipV2 }) => clip.views, { size: 500 })
  export const selectEpoch = memoize(({clip}: { clip: CaughtClipV2 }) => clip.startEpoch === 0 ? (new Date(clip.created_at).getTime() ) : clip.startEpoch, { size: 500 })
  export const selectDuration = memoize(({clip}: { clip: CaughtClipV2 }) => clip.duration, { size: 500})
  export const selectStreamerName = memoize(({clip}: { clip: CaughtClipV2 }) => clip.broadcaster.name, { size: 500})

  export const selectClipMetaedBy = memoize(({ clip, channel }: {
    clip: CaughtClipV2,
    channel: ICatcherChannel
  }): null | string[] => {
    return clip.metaedIn && clip.metaedIn[channel.name] ? clip.metaedIn[channel.name].by : null
  }, { size: 500 })

  export const selectClipDramaedBy = memoize(({ clip, channel }: {
    clip: CaughtClipV2,
    channel: ICatcherChannel
  }): null | string[] => {
    return clip.dramaedIn && clip.dramaedIn[channel.name] ? clip.dramaedIn[channel.name].by : null
  }, { size: 500 })

  export const selectClipVetoedBy = memoize(({ clip, channel }: {
    clip: CaughtClipV2,
    channel: ICatcherChannel
  }): null | string[] => {
    return clip.vetoedIn && clip.vetoedIn[channel.name] ? clip.vetoedIn[channel.name].by : null
  }, { size: 500 })


  // STACKS

  export const selectStackDuration = memoize(({sort, clips}: {sort: Sort, clips: CaughtClipV2[]}) => {
    if (sort.direction === 'asc') {
      return clips.reduce((shortest: number | null, clip: CaughtClipV2) => {
        let duration = selectDuration({ clip: (getUntrackedObject(clip) || clip) })
        if (shortest === null) {
          return duration
        } else {
          return duration < shortest ? duration : shortest
        }
      }, null as number | null)
    } else {
    return clips.reduce((longest: number | null, clip: CaughtClipV2) => {
        let duration = selectDuration({ clip: (getUntrackedObject(clip) || clip) })
        if (longest === null) {
          return duration
        } else {
          return duration > longest ? duration : longest
        }
      }, null as number | null)
    }
  }, { size: 500})

  export const selectStackVoters = memoize(( {votesSets} : { votesSets: { up: string[], down: string[] }[] }) => {
    // console.log('selectStackVoters')
    let upnames: { [name: string]: 1 } = {};
    let downnames: { [name: string]: 1} = {};
    let results: { up: string[], down: string[] } = { up: [], down: [] };

    // console.log('selecting stack voters: ', votesSets)

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
  export const selectStackMetas = memoize(({ clipStack, channel }: { 
    clipStack: CaughtClipV2[],
    channel: ICatcherChannel
  }) => {
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
        let clipMetaedBy = selectClipMetaedBy({clip, channel})
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

  export const selectStackDramas = memoize(({ clipStack, channel }: { 
    clipStack: CaughtClipV2[],
    channel: ICatcherChannel
  }) => {
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
        let clipDramaedBy = selectClipDramaedBy({clip, channel})
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

  export const selectStackVetos = memoize(({ clipStack, channel }: { 
    clipStack: CaughtClipV2[],
    channel: ICatcherChannel
  }) => {
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
        let clipVetoedBy = selectClipVetoedBy({clip, channel})
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

  export const selectStackViews = memoize(( {clips}: { clips: CaughtClipV2[]} ) => {
    return clips.reduce((total: number, clip: CaughtClipV2) => total + selectViews({clip: (getUntrackedObject(clip) || clip)}), 0)
  }, { size: 500 })

  export const selectStackEpoch = memoize(( {dateSort, clips}: { dateSort: Sort, clips: CaughtClipV2[]} ) => {
    if (dateSort.direction === 'asc') {
      return Math.min(...clips.map(clip => selectEpoch({ clip: (getUntrackedObject(clip) || clip) })))
    } else {
      return Math.max(...clips.map(clip => selectEpoch({ clip: (getUntrackedObject(clip) || clip) })))
    }
  }, { size: 500 })

  export const selectStackStreamer = memoize(( {clips}: { clips: CaughtClipV2[] }) => clips[0].broadcaster.name, { size: 500 })

// MEMOIZED SORT COMPARATOR FUNCTIONS
// these functions are intended to be applied to the array.sort function. since the arguments are provided from state,
// they should memoize and speed up redundant sort operations considerably.
//
// i.e.: (clipIdA, clipIdB) => selectAscendingEpochalSort({clipA: state.clips.clips[clipIdA], clipB: state.clips.clips[clipIdB]})

  // CLIPS

    // START EPOCH
    export const selectAscendingEpochalSort = memoize(({clipA, clipB}: {clipA: CaughtClipV2, clipB: CaughtClipV2}) => {
      // console.log('running ascending sort')
      return (clipA.startEpoch === 0 ? (new Date(clipA.created_at).getTime() ) : clipA.startEpoch) - 
             (clipB.startEpoch === 0 ? (new Date(clipB.created_at).getTime() ) : clipB.startEpoch)
    }, { size: 500 })

    export const selectDescendingEpochalSort = memoize(({clipA, clipB}: {clipA: CaughtClipV2, clipB: CaughtClipV2}) => {
      return (clipB.startEpoch === 0 ? (new Date(clipB.created_at).getTime() ) : clipB.startEpoch) -
             (clipA.startEpoch === 0 ? (new Date(clipA.created_at).getTime() ) : clipA.startEpoch)  
             
    }, { size: 500 })

    // VOTERS
    export const selectAscendingClipVotersSort = memoize(({ votesSetA, votesSetB }: { votesSetA: CaughtClipV2['votes'][0], votesSetB: CaughtClipV2['votes'][0]} ) => {
      return (
              selectUpvoters({votesSet: (getUntrackedObject(votesSetA) || votesSetA) }).length - 
              selectDownvoters({votesSet: (getUntrackedObject(votesSetA) || votesSetA)}).length
            ) - 
            ( 
              selectUpvoters({votesSet: (getUntrackedObject(votesSetB) || votesSetB)}).length - 
              selectUpvoters({votesSet: (getUntrackedObject(votesSetB) || votesSetB)}).length
            )
    }, { size: 500 })

    export const selectDescendingClipVotersSort = memoize(({ votesSetA, votesSetB }: { votesSetA: CaughtClipV2['votes'][0], votesSetB: CaughtClipV2['votes'][0]} ) => {
      return (
              selectUpvoters({votesSet: (getUntrackedObject(votesSetB) || votesSetB) }).length - 
              selectDownvoters({votesSet: (getUntrackedObject(votesSetB) || votesSetB)}).length
            ) - 
            ( 
              selectUpvoters({votesSet: (getUntrackedObject(votesSetA) || votesSetA)}).length - 
              selectUpvoters({votesSet: (getUntrackedObject(votesSetA) || votesSetA)}).length
            )
    }, { size: 500 })



    // VIEWS
    export const selectAscendingClipViewsSort = memoize(({ clipA, clipB }: { clipA: CaughtClipV2, clipB: CaughtClipV2 }) => {
      return selectViews(({ clip: (getUntrackedObject(clipA) || clipA)})) - selectViews(({clip: (getUntrackedObject(clipB) || clipB)}))
    }, { size: 500})

    export const selectDescendingClipViewsSort = memoize(({ clipA, clipB }: { clipA: CaughtClipV2, clipB: CaughtClipV2 }) => {
      return selectViews(({ clip: (getUntrackedObject(clipA) || clipA)})) - selectViews(({clip: (getUntrackedObject(clipB) || clipB)}))
    }, { size: 500})

    // DURATION
    export const selectAscendingClipDurationSort = memoize(({clipA, clipB}: { clipA: CaughtClipV2, clipB: CaughtClipV2}) => {
      return selectDuration(({ clip: (getUntrackedObject(clipA) || clipA)})) - selectDuration(({clip: (getUntrackedObject(clipB) || clipB)}))
    }, { size: 500})

    export const selectDescendingClipDurationSort = memoize(({clipA, clipB}: { clipA: CaughtClipV2, clipB: CaughtClipV2}) => {
      return selectDuration(({ clip: (getUntrackedObject(clipB) || clipB)})) - selectDuration(({clip: (getUntrackedObject(clipA) || clipA)}))
    }, { size: 500})

    // STREAMER NAME
    export const selectAscendingStreamerSort = memoize(({clipA, clipB}: { clipA: CaughtClipV2, clipB: CaughtClipV2}) => {
      return selectStreamerName(({ clip: (getUntrackedObject(clipA) || clipA)})).localeCompare(selectStreamerName(({clip: (getUntrackedObject(clipB) || clipB)})))
    }, { size: 500})

    export const selectDescendingStreamerSort = memoize(({clipA, clipB}: { clipA: CaughtClipV2, clipB: CaughtClipV2}) => {
      return selectStreamerName(({ clip: (getUntrackedObject(clipB) || clipB)})).localeCompare(selectStreamerName(({clip: (getUntrackedObject(clipA) || clipA)})))
    }, { size: 500})

    // USER PRIVILEGES
    export const selectDescendingPrivilegesSort = memoize(({userA, userB, channel}: { userA: ChatUser, userB: ChatUser, channel: ICatcherChannel }) => {
      return selectChannelUserType({user: userB, channel}) - selectChannelUserType({user: userA, channel})
    }, { size: 500 })

  // STACKS

    // VOTES
    export const selectStackVotersSort = memoize(
      ({sort, clipStackA, clipStackB, channel}: 
        { 
          sort: Sort, 
          clipStackA: CaughtClipV2[], 
          clipStackB: CaughtClipV2[], 
          channel: ICatcherChannel
        }
      ) => {
        // console.log('iteration: stack voters sort')
        let stackVotersA = selectStackVoters({votesSets: (getUntrackedObject(clipStackA) || clipStackA).map(clip => clip.votes[channel.name])})
        let stackVotersB = selectStackVoters({votesSets: (getUntrackedObject(clipStackB) || clipStackB).map(clip => clip.votes[channel.name])})

        if (sort.direction === 'asc') {
          return (stackVotersA.up.length - stackVotersA.down.length) - (stackVotersB.up.length - stackVotersB.down.length)
        } else {
          return (stackVotersB.up.length - stackVotersB.down.length) - (stackVotersA.up.length - stackVotersA.down.length)
        }
    }, { size: 500 })
    
    // VIEWS
    export const selectStackViewsSort = memoize(
      ({sort, clipStackA, clipStackB}:
        {
          sort: Sort,
          clipStackA: CaughtClipV2[],
          clipStackB: CaughtClipV2[]
        }
      ) => {
        // console.log('iteration: stack views sort')
        let stackViewsA = selectStackViews({ clips: (getUntrackedObject(clipStackA) || clipStackA) })
        let stackViewsB = selectStackViews({ clips: (getUntrackedObject(clipStackB) || clipStackB) })

        if (sort.direction === 'asc') {
          return stackViewsA - stackViewsB
        } else {
          return stackViewsB - stackViewsA
        }
      }, { size: 500 })

    // START EPOCH
    export const selectStackEpochSort = memoize(
      ({sort, clipStackA, clipStackB}:
        {
          sort: Sort
          clipStackA: CaughtClipV2[]
          clipStackB: CaughtClipV2[]
        }
      ) => {
        // console.log('iteration: stack epoch sort')
        let stackEpochA = selectStackEpoch(
          {
            dateSort: (getUntrackedObject(sort) || sort),
            clips: (getUntrackedObject(clipStackA) || clipStackA)
          }
        )
        let stackEpochB = selectStackEpoch(
          {
            dateSort: (getUntrackedObject(sort) || sort),
            clips: (getUntrackedObject(clipStackB) || clipStackB)
          }
        )

        if (sort.direction === 'asc') {
          return stackEpochA - stackEpochB
        } else {
          return stackEpochB - stackEpochA
        }
      }, { size: 500 })

    // DURATION
    export const selectStackDurationSort = memoize(
      ({ sort, clipStackA, clipStackB }: 
        { 
          sort: Sort, 
          clipStackA: CaughtClipV2[], 
          clipStackB: CaughtClipV2[]
        }
      ) => {
        // console.log('iteration: stack duration sort')
        let stackDurationA = selectStackDuration(({sort: (getUntrackedObject(sort) || sort), 
          clips: (getUntrackedObject(clipStackA) || clipStackA)}))
        let stackDurationB = selectStackDuration(({sort: (getUntrackedObject(sort) || sort), 
          clips: (getUntrackedObject(clipStackB) || clipStackB)}))
        if (sort.direction === 'asc') {
          return stackDurationA! - stackDurationB!
        } else {
          return stackDurationB! - stackDurationA!
        }
    }, { size: 500 })

    // STREAMERNAME
    export const selectStackStreamerSort = memoize(
      ({ sort, clipStackA, clipStackB }: 
        {
          sort: Sort
          clipStackA: CaughtClipV2[]
          clipStackB: CaughtClipV2[]
        }
      ) => {
        // console.log('iteration: stack streamer sort')
        let stackStreamerA = selectStackStreamer({ clips: (getUntrackedObject(clipStackA) || clipStackA) })
        let stackStreamerB = selectStackStreamer({ clips: (getUntrackedObject(clipStackB) || clipStackB) })
        if (sort.direction === 'asc') {
          return stackStreamerA.localeCompare(stackStreamerB)
        } else {
          return stackStreamerB.localeCompare(stackStreamerA)
        }
      }
    )


// MEMOIZED OTHER
export const selectSortedUserList = memoize(({ state, channel, userList }: {
  state: RootState
  channel: ICatcherChannel
  userList: string[]
}): string[] => {
  return userList.sort((userNameA, userNameB) => selectDescendingPrivilegesSort({userA: state.users.users[userNameA], userB: state.users.users[userNameB], channel}))
}, { size: 500 })

export const selectSortedSeparatedUserList = memoize(({ state, channel, userList }: {
  state: RootState
  channel: ICatcherChannel
  userList: string[]
}): [ string[], string[] ] => {
  let sortedUserList = selectSortedUserList({state, channel, userList})
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

export const doAscendingClipsOverlap = memoize(({clipA, clipB}: {clipA: CaughtClipV2, clipB: CaughtClipV2}) => {
  return clipA.broadcaster.name === clipB.broadcasterName && clipA.startEpoch + (clipA.duration * 1000) >= clipB.startEpoch
}, { size: 500})

// COMPOSITE SELECTORS
export const selectChannelChronology = memoize(
  ({ state, channel }: { state: RootState, channel: ICatcherChannel}) => {
    // console.log('running channel chronology for ' + channel.name)
    let clips = channel.clips.map((clipId) => state.clips.clips[clipId])
    return clips.sort((clipA, clipB) => selectAscendingEpochalSort({ clipA: /*getUntrackedObject(clipA) ||*/ clipA, clipB: /*getUntrackedObject(clipB) || */clipB }))
}, { size: 500 })

export const selectChannelChronologyWithStacksIfDesired = memoize(
  ({ state, channel }: { state: RootState, channel: ICatcherChannel }) => {
    let channelChronology = channel.clips.map(clipId => state.clips.clips[clipId]).sort(
      (clipA, clipB) => selectAscendingEpochalSort({ 
        clipA: (getUntrackedObject(clipA) || clipA), 
        clipB: (getUntrackedObject(clipB) || clipB) 
      })
    )
    // let channelChronology = selectChannelChronology({ state: (getUntrackedObject(state) || state), channel: getUntrackedObject(channel) || channel })
    // console.log(`reran selectChannelChronologyWithStacksIfDesired for ${channel.name}, got `, channelChronology)
    if (channel.stackClips) {
      // console.log('current channel chronology: ', channelChronology)
      return channelChronology.reduce((output, clip, index) => {
        if (!output.broadcasters[clip.broadcasterName]) {    // if we haven't seen this broadcaster yet we can create a new clip stack.
          output.clipStacks.push([clip.slug])
          output.broadcasters[clip.broadcasterName] = output.clipStacks.length - 1                  
          return output
        } else {
          let lastClipStackIndex = output.broadcasters[clip.broadcasterName] // get the last stack saved for this broadcaster.
          let lastClipStack = output.clipStacks[lastClipStackIndex]
          let overlap = clip.startEpoch === 0 ? false : doAscendingClipsOverlap({clipA: state.clips.clips[lastClipStack[lastClipStack.length - 1]],
                                                                                        clipB: clip})
          if (overlap) {  // if the clips overlap, add it to their last stack.
            output.clipStacks[lastClipStackIndex].push(clip.slug)
            return output
          } else {      // if the clips don't overlap, create a new stack and mark it as the last one for this broadcaster.
            output.broadcasters[clip.broadcasterName] = output.clipStacks.length
            output.clipStacks.push([clip.slug])
            return output
          }
        }
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

export const lexSortClipStacks = 
  ({channel, channel: { sort, name }}: {channel: ICatcherChannel}) => 
    (clipStackA: CaughtClipV2[] | CaughtClipV2, 
     clipStackB: CaughtClipV2[] | CaughtClipV2 ): number => {
  
      if (!Array.isArray(clipStackA)) {
        clipStackA = [clipStackA]
      }
      if (!Array.isArray(clipStackB)) {
        clipStackB = [clipStackB]
      }


      for (let sortNumber = 0; sortNumber < sort.length; sortNumber++) {
        let result = StacksSortTable[sort[sortNumber].type]({ sort: sort[sortNumber], clipStackA, clipStackB, channel })
        if (result !== 0) {
          return result
        }
      }

      return 0
  }

export const lexSortClipStackIds = 
  ({state, channel, channel: { sort }}: {state: RootState, channel: ICatcherChannel}) => 
    (clipStackA: string[], 
     clipStackB: string[]): number => {
      // console.log('lexsort iteration')

      for (let sortNumber = 0; sortNumber < sort.length; sortNumber++) {
        if (sort[sortNumber].active) {
          let result = StacksSortTable[sort[sortNumber].type]({ 
            sort: sort[sortNumber], 
            clipStackA: clipStackA.map(clipId => state.clips.clips[clipId]), 
            clipStackB: clipStackB.map(clipId => state.clips.clips[clipId]), 
            channel
          })
          if (result !== 0) {
            return result
          }
        }
      }

      return 0
  }


export const selectSortedStacks =
  ({ state, channel }: { state: RootState, channel: ICatcherChannel }) => {
    let channelStacks = selectChannelChronologyWithStacksIfDesired({ state: getUntrackedObject(state) || state, channel: getUntrackedObject(channel) || channel})
    // console.log(`re-ran selectSortedStacks for ${channel.name}, got stacks: `, channelStacks)
    let channelSort = channelStacks.sort(
      (clipIdsA: string[] | string, clipIdsB: string[] | string) => 
        lexSortClipStacks({channel})
          (Array.isArray(clipIdsA) ? clipIdsA.map(clipId => state.clips.clips[clipId]) : state.clips.clips[clipIdsA],
          Array.isArray(clipIdsB) ? clipIdsB.map(clipId => state.clips.clips[clipId]) : state.clips.clips[clipIdsB]))
    return channelSort
  }

  
export const selectStackModerationReport = memoize(
  ({ state, clipSlugs, channel }:
    {
      state: RootState,
      clipSlugs: string[],
      channel: ICatcherChannel
    }
  ) => {

    let clipStack = clipSlugs.map(clipSlug => state.clips.clips[clipSlug])

    let stackMetas = selectStackMetas({clipStack, channel})
    let stackDramas = selectStackDramas({clipStack, channel})
    let stackVetos = selectStackVetos({clipStack, channel})
    let sortedMetas = selectSortedSeparatedUserList({ state, channel, userList: stackMetas })
    let sortedDramas = selectSortedSeparatedUserList({state, channel, userList: stackDramas})

    return {
      sortedMetas,
      sortedDramas,
      vetos: stackVetos
    }
}, { size: 500 })