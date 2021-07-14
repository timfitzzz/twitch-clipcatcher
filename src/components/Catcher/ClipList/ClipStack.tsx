import React from 'react'
import { useState } from 'react'
import styled from 'styled-components'
import useClipStack from '../../../hooks/useClipStack'
import ViewCountBadge from '../../badges/ViewCountBadge'
import VoteCountBadge from '../../badges/VoteCountBadge'
import Clip from './Clip'
import TagsBadge from './TagsBadge'

const FirstClipContainer = styled.div`
  flex-direction: row;
  display: flex;
`

const StackSummary = styled(({clipSlugs, channelName, expandStack, toggleExpandStack, className}: { clipSlugs: string[], channelName: string, expandStack: boolean, toggleExpandStack: () =>  void, className?: string}) => {

  return (
    <div className={className}>
      {clipSlugs.length} clips
      <VoteCountBadge clipSlugs={clipSlugs} channelName={channelName} />
      <ViewCountBadge clipSlugs={clipSlugs}/>
      <TagsBadge clipSlugs={clipSlugs} channelName={channelName}/>
      <div onClick={toggleExpandStack}>{ expandStack ? 'close stack' : 'expand stack'}</div>
    </div>
  )

})`

display: flex;
flex-direction: column;


`


export const ClipStack = ({clipSlugs, channelName, className}: {clipSlugs: string[], channelName: string, className?: string}) => {

  let sortedSlugs = useClipStack(clipSlugs, channelName)
  let [expandStack, setExpandStack] = useState<boolean>(false)
  
  const toggleExpandStack = () => {
    setExpandStack(!expandStack)
  }

  return (
    <div className={className}>
      <FirstClipContainer>
        <Clip key={channelName+sortedSlugs[0]} clipSlug={sortedSlugs[0]} channelName={channelName}/>
        <StackSummary clipSlugs={clipSlugs} channelName={channelName} className={className} expandStack={expandStack} toggleExpandStack={toggleExpandStack}/>
      </FirstClipContainer>
      { expandStack && sortedSlugs.slice(1, sortedSlugs.length).map(slug =>
        <Clip key={channelName+slug} clipSlug={slug} channelName={channelName}/>) }

    </div>
  )

}


export default styled(ClipStack)`


`