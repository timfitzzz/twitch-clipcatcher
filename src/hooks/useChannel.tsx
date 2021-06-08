import React, { useMemo } from 'react'
import { useContextSelector } from 'use-context-selector'
import { TwitchContext } from '../contexts/TwitchContext/twitchCtx'

const useChannel = (channelName: string) => {

  const channels = useContextSelector(TwitchContext, (c) => c.channels)
  const channelsDispatch = useContextSelector(TwitchContext, (c) => c.channelsDispatch)

  let channel = useMemo(() => channels && channels[channelName], [channels, channels ? channels[channelName] : false])

  return channel

}

export default useChannel