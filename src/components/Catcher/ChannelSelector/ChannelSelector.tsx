import React, { useMemo } from 'react'
import { useContextSelector } from 'use-context-selector'
import styled from 'styled-components'
import { Flex, Tab, Tabs } from 'rendition'
import { ChannelsContext } from '../../../contexts/ChannelsContext'
import AddChannelForm from './AddChannel'
import Channel from '../Channel/Channel'


const ChannelSelectorTabs = styled(Tabs)`
`

const ChannelSelector = () => {

  let channels = useContextSelector(ChannelsContext, (c) => c.channels)
  let channelNames = useMemo(() => Object.getOwnPropertyNames(channels), [channels])

  console.log('rendering channelselector')

  return (
    <Flex flexDirection={"column"}>
      <ChannelSelectorTabs>
        { channels && channelNames.length > 0 ? channelNames.map(channelName => (
          <Channel channelName={channelName} key={'channel'+channelName}/>
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