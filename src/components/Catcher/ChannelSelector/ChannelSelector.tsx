import React from 'react'
import { useContextSelector } from 'use-context-selector'
import styled from 'styled-components'
import { Flex, Tab, Tabs } from 'rendition'
import { TwitchContext } from '../../../contexts/TwitchContext'
import AddChannelForm from './AddChannel'
import ClipList from '../ClipList/ClipList'
import TabTitle from './TabTitle'


const ChannelSelectorTabs = styled(Tabs)`
`

const ChannelSelector = () => {

  let channels = useContextSelector(TwitchContext, (c) => c.channels)
  let channelNames = Object.getOwnPropertyNames(channels)

  return (
    <Flex flexDirection={"column"}>
      <ChannelSelectorTabs>
        { channels && channelNames.length > 0 ? channelNames.map(channelName => (
          <Tab title={<TabTitle channelName={channelName} />} key={channels![channelName].name}>
            <ClipList channelName={channelName}/>
          </Tab>  
        )) : (
          <div>

          </div>
        )}
        <Tab title={"+"}>
          <AddChannelForm />
        </Tab>
      </ChannelSelectorTabs>
    </Flex>
  )
}

export default ChannelSelector