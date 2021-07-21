import { useRef, useMemo } from 'react'
import { useAppSelector } from './reduxHooks';

const useUpdateThrottle = <T, >(data: T, delay: number): T => {

  const prevDataRef = useRef<T>();

  // const currentData: T = useMemo(() => {
  //   if (holdUpdates && prevDataRef.current) {
  //     return prevDataRef.current
  //   } else {
  //     prevDataRef.current = data
  //     return data
  //   }
  // }, [data, holdUpdates])

  // return currentData

  return data
}

export default useUpdateThrottle