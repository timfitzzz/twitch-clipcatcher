import { useEffect, useState } from 'react'
import useChatClient from '../singleton-hooks/useChatClient'
import { useAppSelector } from './reduxHooks'

const useChannel = (channelName: string) => {

  const { chatClient, loggedIn } = useChatClient()

  const channel = useAppSelector(state => state.channels[channelName]);
  const isScanning = channel.scanning
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
      if (chatClient && joined && isScanning && !error && (typeof channel === 'undefined')) {
        chatClient.part(channelName)
      }
    })
  }, [joined, error, chatClient, channel, loggedIn, channelName, isScanning])

  return channel

}

export default useChannel