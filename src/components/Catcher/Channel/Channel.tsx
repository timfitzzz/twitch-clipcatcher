import React from 'react'
import { Tab } from 'rendition'
import styled from 'styled-components'
import { ChannelsContext } from '../../../contexts/ChannelsContext'
import useChannel from '../../../hooks/useChannel'
import TabTitle from '../ChannelSelector/TabTitle'
import ClipList from '../ClipList/ClipList'

const Channel = ({channelName}: {channelName: string}) => {

  const channel = useChannel(channelName)

  console.log('rendering channel')

  return (
    <Tab title={
      <TabTitle scanning={channel ? channel.scanning : false} 
                channelName={channelName} clipsCount={channel ? channel.clips.length : 0}/>} key={channelName+'tab'}>
      <ClipList clips={channel ? channel.clips : []}/>
    </Tab>  
  )

}

export default Channel