import React from 'react'
import { Flex } from 'rendition'
import styled from 'styled-components'
import useChannel from '../../../hooks/useChannel'
import ChannelTitleTab from './ChannelTitleTab'
import ClipList from '../ClipList/ClipList'
import ChannelControlBar from './ChannelControlBar'
import ChannelCloseButton from './ChannelCloseButton'

const ChannelContainer = styled.div`
  flex-grow: 1;
  flex-basis: 0;
  width: 100%;
  display: flex;
  flex-direction: column;
`

const Channel = styled(({channelName, hidden, className}: {channelName: string, className?: string, hidden?: boolean}) => {

  const isScanning = useChannel(channelName)

  return (
    <ChannelContainer hidden={hidden} className={className}>
      <Flex flexDirection={'row'}>
        <ChannelTitleTab channelName={channelName}>
          <ChannelControlBar channelName={channelName} />
          <ChannelCloseButton channelName={channelName}/>
        </ChannelTitleTab>
      </Flex>
      <ClipList channelName={channelName} scanning={isScanning ? isScanning : false}/>
    </ChannelContainer>
  )

}).attrs(p => ({
  ...p
}))`


`

export default Channel