import React from 'react'
import { Flex } from 'rendition'
import styled from 'styled-components'
// import { defaultFilters, Filters } from '../../../types'
import Clip from './Clip'
import {OptionsPanel} from '../OptionsPanel'
import useClips from '../../../hooks/useClips'
import NoClips from './NoClips'
import useUpdateLock from '../../../hooks/useUpdateLock'



const ClipListContainer = styled(Flex)`
  flex-grow: 1;
  flex-basis: 0;
`

const ClipsContainer = styled(Flex)`
  display: block;
  overflow-y: auto;
  margin-top: 0px;
  margin-bottom: 0px;
  width: 100%;
  overflow-x: hidden;
  flex-grow: 1;
  flex-basis: 0;

`



// const defaultSort: SortTypes[] = []

const ClipList = ({channelName}: {channelName: string, scanning: boolean}) => {

  const currentClips = useClips({channelName})
  const clips = useUpdateLock(currentClips, channelName)

  return (
    <ClipListContainer flexDirection={"column"}>
      <OptionsPanel channelName={channelName}/>
      <ClipsContainer flexDirection={"column"}>
        { clips && clips.map((clip) => <Clip key={clip+channelName} clipSlug={clip} channelName={channelName}/>)}
        { clips && clips.length === 0 ? (
          <NoClips/>
        ) : (<></>)}
      </ClipsContainer>
    </ClipListContainer>
  )

}

export default ClipList