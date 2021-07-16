import { useMemo, useCallback } from 'react'
import { selectChannelChronology } from '../redux/clips'
import { Sort, SortTypes } from '../types'
import { useAppSelector } from './reduxHooks'

const useClipStacks = ({channelName}: { channelName: string}): (string[] | string)[] => {

  let clips = useAppSelector(state => state.clips.clips)
  let clipIds = useAppSelector(state => state.channels[channelName].clips)
  let sort = useAppSelector(state => state.channels[channelName].sort)
  let stackClips = useAppSelector(state => state.channels[channelName].stackClips)

  let clipsChronologically = useAppSelector(state => selectChannelChronology({ state, channelName }))

  console.log(clipIds)
  console.log(clipsChronologically)
  const sortersTable = useMemo(() => ({
    [SortTypes['frogscount']]: (clipIds: string[]) => 
      clipIds.reduce(
        (total: number, clipId: string) => 
          (total + (clips[clipId] ? clips[clipId].votes[channelName].up.length - clips[clipId].votes[channelName].down.length : 0)), 0),
    [SortTypes['views']]: (clipIds: string[]) => 
      clipIds.reduce(
        (total: number, clipId: string) => 
          total + (clips[clipId] ? clips[clipId].views : 0), 0),
    [SortTypes['date']]: (clipIds: string[]) => clips[clipIds[0]].startEpoch || 0,
    [SortTypes['length']]: (clipIds: string[], direction: 'asc' | 'desc') => 
      direction === 'asc' 
        ? Math.min(...clipIds.map(clipId => clips[clipId].duration)) : Math.max(...clipIds.map(clipId => clips[clipId].duration)),
    [SortTypes['streamername']]: (clipIds: string[], direction: 'asc' | 'desc') => 
      clips[(direction === 'asc' ? clipIds.sort((a, b) => clips[b].broadcasterName.localeCompare(clips[a].broadcasterName))
                          : clipIds.sort((a, b) => clips[a].broadcasterName.localeCompare(clips[b].broadcasterName)))[0]].broadcasterName
  }), [channelName, clips])

  let clipStacks = useMemo(() => {
    if (!stackClips) {
      return clipsChronologically
    } else {

      return clipsChronologically.reduce((clipStacks: (string[] | string)[], clipId) => {
        let stackClip = clips[clipId].startEpoch === 0
                        ? false 
                        : clipStacks.length > 0 // if not first item
                          ? Array.isArray(clipStacks[clipStacks.length - 1]) // if last item is array
                            ? clips[clipStacks[clipStacks.length - 1][clipStacks[clipStacks.length - 1].length -1]].startEpoch         // if last item
                              + clips[clipStacks[clipStacks.length - 1][clipStacks[clipStacks.length - 1].length -1]].duration * 1000  // in last array
                              > clips[clipId].startEpoch                                    // overlaps this one
                                ? clips[clipStacks[clipStacks.length -1][clipStacks[clipStacks.length -1].length -1]].broadcaster.name 
                                  === clips[clipId].broadcaster.name 
                                  ? true  // insert in previous stack
                                  : false
                                : false // insert alone
                                // else, last item is a string
                            : clips[clipStacks[clipStacks.length - 1] as string].startEpoch        // if last item   
                              + clips[clipStacks[clipStacks.length -1] as string].duration * 10000 // overlaps with
                              > clips[clipId].startEpoch                                           // this one
                                ? clips[clipStacks[clipStacks.length - 1] as string].broadcaster.name
                                  === clips[clipId].broadcaster.name
                                  ? true  // convert prior item to stack with this clip
                                  : false
                                : false // insert alone
                          : /*if is first item then */ false // insert alone
        if (stackClip) {
          if (Array.isArray(clipStacks[clipStacks.length - 1])) {
            (clipStacks[clipStacks.length - 1] as string[]).push(clipId)
          } else {
            clipStacks[clipStacks.length - 1] = [clipStacks[clipStacks.length -1] as string, clipId]
          }
        } else {
          clipStacks.push(clipId)
        }
        return clipStacks
      }, [] as (string[] | string)[])
    }
  }, [clipsChronologically, stackClips, clips])

  let lexSortClipStacks = useCallback(() => (clipStackA: string[] | string, clipStackB: string[] | string): number => {

    if (!Array.isArray(clipStackA)) {
      clipStackA = [clipStackA]
    }
    if (!Array.isArray(clipStackB)) {
      clipStackB = [clipStackB]
    }

    function getSortResult(sort: Sort) {
      return sort.active
              ? sort.direction === 'asc'
                ? typeof sortersTable[sort.type](clipStackA as string[], sort.direction) === 'string'
                  ? (sortersTable[sort.type](clipStackB as string[], sort.direction) as string).localeCompare((sortersTable[sort.type](clipStackA as string[], sort.direction) as string))
                  : (sortersTable[sort.type](clipStackA as string[], sort.direction) as number) - (sortersTable[sort.type](clipStackB as string[], sort.direction) as number)
                : typeof sortersTable[sort.type](clipStackB as string[], sort.direction) === 'string'
                  ? (sortersTable[sort.type](clipStackA as string[], sort.direction) as string).localeCompare((sortersTable[sort.type](clipStackB as string[], sort.direction) as string))
                  : (sortersTable[sort.type](clipStackB as string[], sort.direction) as number) - (sortersTable[sort.type](clipStackA as string[], sort.direction) as number)
              : 0
    }

    for (let sortNumber = 0; sortNumber < sort.length; sortNumber++) {
      let result = getSortResult(sort[sortNumber])
      if (result !== 0) {
        return result
      }
    }

    return 0
  }, [sort, sortersTable])



  // let lexSortStacks = useCallback(() => (clipAId: string, clipBId: string): number => {
  //   function getSortResult(sort: Sort) {
  //     return sort.active 
  //             ? sort.direction === 'asc'
  //               ? typeof sortersTable[sort.type](clips[clipAId]) === 'string'
  //                 ? (sortersTable[sort.type](clips[clipBId]) as string).localeCompare((sortersTable[sort.type](clips[clipAId]) as string))
  //                 : (sortersTable[sort.type](clips[clipAId]) as number) - (sortersTable[sort.type](clips[clipBId]) as number)
  //               : typeof sortersTable[sort.type](clips[clipAId]) === 'string'
  //                 ? (sortersTable[sort.type](clips[clipAId]) as string).localeCompare((sortersTable[sort.type](clips[clipBId]) as string))
  //                 : (sortersTable[sort.type](clips[clipBId]) as number) - (sortersTable[sort.type](clips[clipAId]) as number)
  //             : 0
  // //   }

  //   for (let sortNumber = 0; sortNumber < sort.length; sortNumber++) {
  //     let result = getSortResult(sort[sortNumber])
  //     if (result !== 0) {
  //       return result
  //     }
  //   }

  //   return 0
  // }, [sort, clips, sortersTable])


  let returnClipStacks = useMemo(() => {
    if (clipStacks) {
      return clipStacks.sort(lexSortClipStacks())
    } else {
      return []
    }
  }, [clipStacks, lexSortClipStacks])

  return returnClipStacks

}

export default useClipStacks