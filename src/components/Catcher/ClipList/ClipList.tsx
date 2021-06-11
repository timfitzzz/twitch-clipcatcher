import React from 'react'
import { Flex } from 'rendition'
import { CaughtClip } from '../../../types'
import Clip from './Clip'

const ClipList = ({clips}: {clips: CaughtClip[]}) => {

  console.log('rendering cliplist')

  return (
    <Flex flexDirection={"column"}>
      <Flex flexDirection={"row"}>
        options
      </Flex>
      <Flex flexDirection={"column"}>
        { clips && clips.map((clip, idx) => <Clip key={clip.tracking_id + idx} clip={clip}/>)}
      </Flex>
    </Flex>
  )

}

export default ClipList