import memoize from 'proxy-memoize'
import { useEffect, useState } from 'react'
import { channelErrorSet, scanningStopped } from '../redux/channels'
import { selectChannelError } from '../redux/selectors'
import useChatClient from '../singleton-hooks/useChatClient'
import { useAppDispatch, useAppSelector } from './reduxHooks'

const useChannel = (channelName: string) => {

  const { chatClient, loggedIn } = useChatClient()

  const isScanning = useAppSelector(memoize(state => state.channels[channelName].scanning));
  const error = useAppSelector(state => selectChannelError(state.channels[channelName]))
  const dispatch = useAppDispatch()
  const [joined, setJoined] = useState<boolean>(false)

  // join / part channel
  useEffect(() => {
    // console.log('join part channel: ', chatClient, joined, error, loggedIn)
    if (chatClient && loggedIn && !error) {
      if (isScanning && !joined) {
        chatClient.join(channelName).then((success) => setJoined(true), (err: Error) => { 
          dispatch(scanningStopped(channelName))
          dispatch(channelErrorSet(channelName))
        });
        setJoined(true)
      } else if (!isScanning && joined) {
        chatClient.part(channelName)
        setJoined(false)
      }
    }

    return (() => {
      if (chatClient && joined && !error && !isScanning) {
        chatClient.part(channelName)
      }
    })
  }, [joined, error, chatClient, loggedIn, channelName, isScanning, dispatch])

  return isScanning

}

export default useChannel