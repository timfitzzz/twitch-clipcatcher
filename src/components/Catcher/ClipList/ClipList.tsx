import React from 'react'
import { Flex } from 'rendition'
import styled from 'styled-components'
// import { defaultFilters, Filters } from '../../../types'
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
  display: flex;
  overflow-y: auto;
  margin-top: 0px;
  margin-bottom: 0px;
  width: 100%;
  overflow-x: hidden;
  flex-grow: 1;
  flex-basis: 0;
  align-items: flex-end;
  padding-left: 4px;
  padding-top: 8px;
  padding-bottom: 8px;
  padding-right: 12px;

`



// const defaultSort: SortTypes[] = []

const ClipList = ({channelName}: {channelName: string, scanning: boolean}) => {

  const currentClipStacks = useClipStacks({channelName})
  const clipStacks = useUpdateLock(currentClipStacks, channelName)

  return (
    <ClipListContainer flexDirection={"column"}>
      <OptionsPanel channelName={channelName}/>
      <ClipsContainer flexDirection={"column"}>
        { clipStacks && clipStacks.map(clipStack => 
          {
          if (Array.isArray(clipStack)) {
            return clipStack.length === 1 ? (
              <ClipStack key={channelName+clipStack.reduce((string, slug) => string + slug, "")} clipSlugs={clipStack} channelName={channelName}/>
            ) : ( 
              <ClipStack key={channelName+clipStack.reduce((string, slug) => string + slug, "")} clipSlugs={clipStack} channelName={channelName} />
            )
          } else {
            return <ClipStack key={channelName+clipStack} clipSlugs={[clipStack]} channelName={channelName} />
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