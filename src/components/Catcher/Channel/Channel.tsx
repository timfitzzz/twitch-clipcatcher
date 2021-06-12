import React from 'react'
import { Tab } from 'rendition'
// import useChannel from '../../../hooks/useChannel'
import TabTitle from '../ChannelSelector/TabTitle'
import ClipList from '../ClipList/ClipList'

const Channel = ({channelName}: {channelName: string}) => {

  const channel = { scanning: false, clips: []} //useChannel(channelName)

  console.log('rendering channel')

  return (
    <Tab title={
      <TabTitle scanning={channel ? channel.scanning : false} 
                channelName={channelName} clipsCount={channel ? channel.clips.length : 0}/>} key={channelName+'tab'}>
      <ClipList clips={channel ? channel.clips : []}/>
    </Tab>  
  )

}

Channel.whyDidYouRender = true

export default Channel