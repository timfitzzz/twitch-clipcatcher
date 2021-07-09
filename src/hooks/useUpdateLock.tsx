import { useRef, useMemo } from 'react'
import { useAppSelector } from './reduxHooks';

const useUpdateLock = <T, >(data: T, channelName: string): T => {

  const prevDataRef = useRef<T>();
  const holdUpdates = useAppSelector(state => state.channels[channelName].holdUpdates)

  const currentData: T = useMemo(() => {
    if (holdUpdates && prevDataRef.current) {
      return prevDataRef.current
    } else {
      prevDataRef.current = data
      return data
    }
  }, [data, holdUpdates])

  return currentData

}

export default useUpdateLock