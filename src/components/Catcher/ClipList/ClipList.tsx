import React from 'react'
import { Flex } from 'rendition'
import styled from 'styled-components'
// import { defaultFilters, Filters } from '../../../types'
import {OptionsPanel} from '../OptionsPanel'
import useClipStacks from '../../../hooks/useClipStacks'
import NoClips from './NoClips'
import useUpdateLock from '../../../hooks/useUpdateLock'
import ClipStack from './ClipStack'
import ChannelStatsPanel from '../Channel/ChannelStatsPanel'


const ClipListContainer = styled(Flex)`
  flex-grow: 1;
  flex-basis: 0;
  border: 4px solid ${p => p.theme.colors.primary.semilight};

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
  align-items: stretch;
  padding-left: 8px;
  padding-top: 8px;
  padding-bottom: 8px;
  padding-right: 16px;
  scrollbar-width: none;
  border-left: 1px solid ${({theme}) => theme.colors.primary.light};
  border-right: 1px solid ${({theme}) => theme.colors.primary.light};
  border-bottom: 1px solid ${({theme}) => theme.colors.primary.light};

`
const InlineChannelStatsPanel = styled(ChannelStatsPanel)`
  height: 30px;
  display: flex;
  flex-direction: row;
  width: 100%;
  flex-grow: 0;
  justify-content: center;
  background-color: ${p => p.theme.colors.quartenary.main};
  border-left: 1px solid ${({theme}) => theme.colors.primary.light};
  border-top: 1px solid ${({theme}) => theme.colors.primary.light};
  border-right: 1px solid ${({theme}) => theme.colors.primary.light};
  > div {
  }
`


// const defaultSort: SortTypes[] = []

const ClipList = ({channelName}: {channelName: string, scanning: boolean}) => {

  const currentClipStacks = useClipStacks({channelName})
  const clipStacks = useUpdateLock(currentClipStacks, channelName)

  return (
    <ClipListContainer flexDirection={"column"}>
      <OptionsPanel channelName={channelName}/>
      <InlineChannelStatsPanel channelName={channelName}/>
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