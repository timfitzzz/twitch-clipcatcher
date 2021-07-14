import React from 'react'
import { Flex } from 'rendition'
import styled from 'styled-components'
// import { defaultFilters, Filters } from '../../../types'
import Clip from './Clip'
import {OptionsPanel} from '../OptionsPanel'
import useClipStacks from '../../../hooks/useClipStacks'
import NoClips from './NoClips'
import useUpdateLock from '../../../hooks/useUpdateLock'
import ClipStack from './ClipStack'



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

  const currentClipStacks = useClipStacks({channelName})
  const clipStacks = useUpdateLock(currentClipStacks, channelName)

  return (
    <ClipListContainer flexDirection={"column"}>
      <OptionsPanel channelName={channelName}/>
      <ClipsContainer flexDirection={"column"}>
        { clipStacks && clipStacks.map(clipStack => {
          if (Array.isArray(clipStack)) {
            return clipStack.length === 1 ? (
              <Clip key={channelName+clipStack[0]} clipSlug={clipStack[0]} channelName={channelName}/>
            ) : ( 
              <ClipStack key={channelName+clipStack.reduce((string, slug) => string + slug, "")} clipSlugs={clipStack} channelName={channelName} />
            )
          } else {
            return <Clip key={channelName+clipStack} clipSlug={clipStack} channelName={channelName}/>
          }
        })}
        { clipStacks && clipStacks.length === 0 ? (
          <NoClips/>
        ) : (<></>)}
      </ClipsContainer>
    </ClipListContainer>
  )

}

export default ClipList