import { useMemo, useCallback } from 'react'
import { CaughtClipV2 } from '../redux/clips'
import { Sort, SortTypes } from '../types'
import { useAppSelector } from './reduxHooks'

const useClips = ({channelName}: { channelName: string}): string[] => {

  let clips = useAppSelector(state => state.clips.clips)
  let clipIds = useAppSelector(state => state.channels[channelName].clips)
  let sort = useAppSelector(state => state.channels[channelName].sort)
  // let filters = useAppSelector(state => state.channels[channelName].filters)

  const sortersTable = useMemo(() => ({
    [SortTypes['frogscount']]: (clip: CaughtClipV2) => (clip.votes[channelName].up.length - clip.votes[channelName].down.length),
    [SortTypes['views']]: (clip: CaughtClipV2) => clip.views,
    [SortTypes['date']]: (clip: CaughtClipV2) => clip.startEpoch || 0,
    [SortTypes['length']]: (clip: CaughtClipV2) => clip.duration,
    [SortTypes['streamername']]: (clip: CaughtClipV2) => clip.broadcasterName.toLocaleLowerCase()
  }), [channelName])

  // const filtersTable = useMemo(() => ({
  //   meta: 
  // }))
  
  // let applyFilters = useCallback(() => (clipId: string) => {
  //   for (i = 0; i < filters.length; i++) {
  //     if ()
  //   }
  // })

  let lexSort = useCallback(() => (clipAId: string, clipBId: string): number => {
    function getSortResult(sort: Sort) {
      return sort.active 
              ? sort.direction === 'asc'
                ? typeof sortersTable[sort.type](clips[clipAId]) === 'string'
                  ? (sortersTable[sort.type](clips[clipBId]) as string).localeCompare((sortersTable[sort.type](clips[clipAId]) as string))
                  : (sortersTable[sort.type](clips[clipAId]) as number) - (sortersTable[sort.type](clips[clipBId]) as number)
                : typeof sortersTable[sort.type](clips[clipAId]) === 'string'
                  ? (sortersTable[sort.type](clips[clipAId]) as string).localeCompare((sortersTable[sort.type](clips[clipBId]) as string))
                  : (sortersTable[sort.type](clips[clipBId]) as number) - (sortersTable[sort.type](clips[clipAId]) as number)
              : 0
    }

    for (let sortNumber = 0; sortNumber < sort.length; sortNumber++) {
      let result = getSortResult(sort[sortNumber])
      if (result !== 0) {
        return result
      }
    }

    return 0
  }, [sort, clips, sortersTable])

  let returnClips = useMemo(() => {
    return [...clipIds].sort(lexSort())
  }, [clipIds, lexSort])

  return returnClips

}

export default useClips