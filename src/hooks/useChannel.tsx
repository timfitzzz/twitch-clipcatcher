import memoize from 'proxy-memoize'
import { useEffect, useState } from 'react'
import useChatClient from '../singleton-hooks/useChatClient'
import { useAppSelector } from './reduxHooks'

const useChannel = (channelName: string) => {

  const { chatClient, loggedIn } = useChatClient()

  const isScanning = useAppSelector(memoize(state => state.channels[channelName].scanning));
  const [joined, setJoined] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  // join / part channel
  useEffect(() => {
    // console.log('join part channel: ', chatClient, joined, error, loggedIn)
    if (chatClient && loggedIn && !error) {
      if (isScanning && !joined) {
        chatClient.join(channelName).then((success) => setJoined(true), (err) => setError(err));
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
  }, [joined, error, chatClient, loggedIn, channelName, isScanning])

  return isScanning

}

export default useChannel