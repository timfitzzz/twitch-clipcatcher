import React from 'react'
import { Tab } from 'rendition'
import useChannel from '../../../hooks/useChannel'
import TabTitle from '../ChannelSelector/TabTitle'
import ClipList from '../ClipList/ClipList'

const Channel = ({channelName, hidden}: {channelName: string, hidden?: boolean}) => {

  const channel = useChannel(channelName)

  console.log('rendering channel')

  return (
      <ClipList clips={channel ? channel.clips : []}/>
  )

}

Channel.whyDidYouRender = true

export default Channel