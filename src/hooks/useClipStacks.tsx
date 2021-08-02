import memoize from 'proxy-memoize'
import { useCallback } from 'react'
import { lexSortClipStackIds, selectChannelChronologyWithStacksIfDesired, selectChannelSort } from '../redux/selectors'
import { useAppSelector } from './reduxHooks'
import useUpdateLock from './useUpdateLock'

const useClipStacks = (channelName: string) => {

  let currentClipStacks = useAppSelector(state => selectChannelChronologyWithStacksIfDesired({ state, channel: state.channels[channelName] }))
  let sort = useAppSelector(state => selectChannelSort(state.channels[channelName]))

  let clipStacks = useUpdateLock(currentClipStacks, channelName)

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const returnClipStacks = useAppSelector(useCallback(memoize(state => {
    // console.log('resorting clip stacks for ', channelName, clipStacks, sort)
    if (clipStacks) {
      let result = clipStacks.sort(lexSortClipStackIds({state, channel: state.channels[channelName]}))
      return result
    } else {
      return []
    }
    // eslint complains about the inclusion of 'sort' in this array,
    // but if it's not included then changing the sort won't trigger
    // a re-sort or re-render.
    //
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [clipStacks, sort, channelName]))

  return returnClipStacks

}

export default useClipStacks