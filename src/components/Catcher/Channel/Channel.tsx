import React from 'react'
import styled from 'styled-components'
import useChannel from '../../../hooks/useChannel'
import ClipList from '../ClipList/ClipList'

const ChannelContainer = styled.div`
  flex-grow: 1;
  flex-basis: 0;
  width: 100%;
  display: flex;
`

const Channel = styled(({channelName, hidden}: {channelName: string, hidden?: boolean}) => {

  const channel = useChannel(channelName)

  return (
    <ChannelContainer hidden={hidden}>
      <ClipList channelName={channelName} scanning={channel && channel.scanning ? channel.scanning : false}/>
    </ChannelContainer>  
  )

}).attrs(p => ({
  ...p
}))`
  border: 4px solid ${p => p.theme.colors.primary.semilight};
`

export default Channel