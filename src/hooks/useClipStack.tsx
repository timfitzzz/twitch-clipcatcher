import { useMemo, useCallback } from 'react'
import { CaughtClipV2 } from '../redux/clips'
import { Sort, SortTypes } from '../types'
import { useAppSelector } from './reduxHooks'

const useClipStack = (clipIds: string[], channelName: string): string[] => {

  let clips = useAppSelector(state => clipIds.map(clipId => state.clips.clips[clipId]))
  let sort = useAppSelector(state => state.channels[channelName].sort)
  // let filters = useAppSelector(state => state.channels[channelName].filters)

  const sortersTable = useMemo(() => ({
    [SortTypes['frogscount']]: (clip: CaughtClipV2) => (clip.votes[channelName].up.length - clip.votes[channelName].down.length),
    [SortTypes['views']]: (clip: CaughtClipV2) => clip.views,
    [SortTypes['date']]: (clip: CaughtClipV2) => clip.startEpoch || 0,
    [SortTypes['length']]: (clip: CaughtClipV2) => clip.duration,
    [SortTypes['streamername']]: (clip: CaughtClipV2) => clip.broadcasterName.toLocaleLowerCase()
  }), [channelName])

  let lexSort = useCallback(() => (clipA: CaughtClipV2, clipB: CaughtClipV2): number => {
    function getSortResult(sort: Sort) {
      return sort.active 
              ? sort.direction === 'asc'
                ? typeof sortersTable[sort.type](clipA) === 'string'
                  ? (sortersTable[sort.type](clipB) as string).localeCompare((sortersTable[sort.type](clipA) as string))
                  : (sortersTable[sort.type](clipA) as number) - (sortersTable[sort.type](clipB) as number)
                : typeof sortersTable[sort.type](clipA) === 'string'
                  ? (sortersTable[sort.type](clipA) as string).localeCompare((sortersTable[sort.type](clipB) as string))
                  : (sortersTable[sort.type](clipB) as number) - (sortersTable[sort.type](clipA) as number)
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

  let returnClips = useMemo(() => {
    return clips.sort(lexSort())
  }, [clips, lexSort])

  return returnClips.map(clip => clip.slug)

}

export default useClipStack