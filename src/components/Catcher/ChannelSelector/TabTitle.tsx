import React from 'react'
import { Badge, Flex } from 'rendition'
import styled from 'styled-components'
import useChannel from '../../../hooks/useChannel'
import CatcherBadge from '../../badges/CatcherBadge'

const TabTitleText = styled.h5`
  margin-right: 8px;
  padding-top: 0px;
  padding-bottom: 0px;
  margin-top: auto;
  margin-bottom: auto;
`


const TabTitle = ({channelName}: { channelName: string}) => {

  const channel = useChannel(channelName)

  return (
    <Flex flexDirection={"row"}>
      <TabTitleText>{channelName}</TabTitleText>
      { channel ? (
        <>
          <CatcherBadge type={'clips'} value={channel.clips.length.toString()}/>
          <CatcherBadge type={'scanned'} value={channel.currentScanned.toString()} animate={channel.scanning} />
        </>
      ) : (
        <span>...</span>
      )}
    </Flex>
  )

}

export default TabTitle