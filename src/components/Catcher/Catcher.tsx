import React, { useMemo, useState } from 'react'
import styled from 'styled-components'
import { Flex } from 'rendition'
import { useAppSelector } from '../../hooks/reduxHooks'
// import { useContextSelector } from 'use-context-selector'
// import { ChannelActions, ChannelsContext } from '../../contexts/ChannelsContext'
import ChannelSelector from './ChannelSelector/ChannelSelector'
import AddChannelForm from './ChannelSelector/AddChannel';
import Channel from './Channel/Channel';


const ChannelContainer = styled(Flex).attrs(p => ({
  ...p,
  flexDirection: 'column'
}))`
  border: 4px solid ${p => p.theme.colors.primary.semilight};
  flex-grow: 1;
`


const Catcher = () => {

  const channelNames = useAppSelector(state => Object.getOwnPropertyNames(state.channels))
  const [currentChannel, setCurrentChannel] = useState<string | null>(null)
  const displayOrder = useMemo(() => {
    if (currentChannel) {
      let newOrder = channelNames.filter(name => name !== currentChannel)
      newOrder.push(currentChannel)
      return newOrder
    } else {
      return channelNames
    }
  }, [channelNames, currentChannel])

  const handleChannelChange = (channelName: string) => {
    setCurrentChannel(channelName)
  }

  let [addPanelVisible, setAddPanelVisible] = useState<boolean>(true)

  // let channelNames = useContextSelector(ChannelsContext, (c) => Object.getOwnPropertyNames(c.channels))
  // let channelsDispatch = useContextSelector(ChannelsContext, (c) => c.channelsDispatch)
  // let channelNames = useMemo(() => Object.getOwnPropertyNames(channels), [channels])

  return (
    <>
      <ChannelSelector setAddPanelVisible={setAddPanelVisible} addPanelSelected={addPanelVisible} channelNames={displayOrder} currentChannelName={currentChannel} handleChannelChange={handleChannelChange}/>
      <ChannelContainer>
        {channelNames.length > 0 &&
          channelNames.map((channelName) => (
            <Channel
              channelName={channelName}
              key={'channel' + channelName}
              hidden={currentChannel === channelName && !addPanelVisible ? false : true}
            />
          ))}
        { addPanelVisible ? (
          <AddChannelForm />
        ) : (
          <></>
        )}
      </ChannelContainer>
    </>
  )
}

export default Catcher