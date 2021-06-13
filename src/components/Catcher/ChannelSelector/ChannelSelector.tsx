import React, { useMemo, useState } from 'react'
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
  let [currentChannel, setCurrentChannel] = useState<number>(-1)

  const switchChannel = (idx: number) => {
    setCurrentChannel(idx)
  }

  console.log('rendering channelselector')

  return (
    <Flex flexDirection={"column"}>
      <ChannelSelectorTabs>
        { channelNames.map((channel, idx) => (
            <div onClick={() => switchChannel(idx)}>{channel}</div>
        ))}
        <div onClick={() => setCurrentChannel(-1)}>+</div>
      </ChannelSelectorTabs>
      { channels && channelNames.length > 0 && channelNames.map((channelName, idx) => (
          <Channel channelName={channelName} key={'channel'+channelName} hidden={currentChannel === idx ? false : true}/>
        ))}
        { !channels || channelNames.length === 0 || currentChannel === -1 ? (
          <AddChannelForm />
        ):(<></>)}
    </Flex>
  )
}

export default ChannelSelector

        // <Tab title={"+"}>
        //   <AddChannelForm />
        // </Tab>