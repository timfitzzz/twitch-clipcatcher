import { useEffect, useState } from 'react'
import useChatClient from '../singleton-hooks/useChatClient'
import { useAppSelector } from './reduxHooks'

const useChannel = (channelName: string) => {

  const { chatClient, loggedIn } = useChatClient()

  const channel = useAppSelector(state => state.channels[channelName]);
  const [joined, setJoined] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  // join / part channel
  useEffect(() => {
    // console.log('join part channel: ', chatClient, joined, error, loggedIn)
    if (chatClient && !joined && !error && loggedIn) {
      chatClient.join(channelName).then((success) => setJoined(true), (err) => setError(err));
      setJoined(true)
    }

    return (() => {
      if (chatClient && joined && !error && (typeof channel === 'undefined')) {
        chatClient.part(channelName)
        setJoined(false)
      }
    })
  }, [joined, error, chatClient, channel, loggedIn, channelName])

  return channel

}

export default useChannel