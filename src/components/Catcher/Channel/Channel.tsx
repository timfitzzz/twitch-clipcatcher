import React from 'react'
import { Flex } from 'rendition'
import styled from 'styled-components'
import useChannel from '../../../hooks/useChannel'
import ChannelTitleTab from './ChannelTitleTab'
import ClipList from '../ClipList/ClipList'
import ChannelControlBar from './ChannelControlBar'
import ChannelStatsPanel from './ChannelStatsPanel'

const ChannelContainer = styled.div`
  flex-grow: 1;
  flex-basis: 0;
  width: 100%;
  display: flex;
  flex-direction: column;
`

const ChannelControlStrip = styled.div`
  display: flex;
  flex-direction: row;
  flex-grow: 1;
  height: 100%;
  background-color: ${p => p.theme.colors.quartenary.main};
  align-self: flex-end;
  align-content: center;
  margin-left: -4px;
`

const Channel = styled(({channelName, hidden}: {channelName: string, hidden?: boolean}) => {

  const isScanning = useChannel(channelName)

  return (
    <ChannelContainer hidden={hidden}>
      <Flex flexDirection={'row'}>
        <ChannelTitleTab channelName={channelName}>
          <ChannelControlBar channelName={channelName} />
        </ChannelTitleTab>
        <ChannelControlStrip>
          <ChannelStatsPanel channelName={channelName} />
        </ChannelControlStrip>
      </Flex>
      <ClipList channelName={channelName} scanning={isScanning ? isScanning : false}/>
    </ChannelContainer>
  )

}).attrs(p => ({
  ...p
}))`
  border: 4px solid ${p => p.theme.colors.primary.semilight};

`

export default Channel