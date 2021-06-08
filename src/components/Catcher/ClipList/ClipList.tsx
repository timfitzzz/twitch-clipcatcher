import React from 'react'
import { Flex } from 'rendition'
import useChannel from '../../../hooks/useChannel'
import Clip from './Clip'

const ClipList = ({channelName}: {channelName: string}) => {

  const channel = useChannel(channelName)

  return (
    <Flex flexDirection={"column"}>
      <Flex flexDirection={"row"}>
        options
      </Flex>
      <Flex flexDirection={"column"}>
        { channel && channel.clips && channel.clips.map((clip, idx) => <Clip key={clip.tracking_id + idx} clip={clip}/>)}
      </Flex>
    </Flex>
  )

}

export default ClipList