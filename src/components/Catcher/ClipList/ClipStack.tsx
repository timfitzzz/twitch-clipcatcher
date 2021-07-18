import React, { useMemo } from 'react'
import { useState } from 'react'
import styled from 'styled-components'
import useClipStack from '../../../hooks/useClipStack'
import ViewCountBadge from '../../badges/ViewCountBadge'
import VerticalVoteCountBadge from '../../badges/VerticalVoteCountBadge'
import Clip from './Clip'
import TagsBadge from './TagsBadge'
import { useAppSelector } from '../../../hooks/reduxHooks'
import { SortTypes } from '../../../types'
import Delay from '../../badges/WhenAgoBadge'
import ClipDurationBadge from '../../badges/ClipDurationBadge';
import ExpandButtonBadge from '../../badges/ExpandButtonBadge'
import { Flex } from 'rendition'

const FirstClipContainer = styled.div`
  flex-direction: row;
  display: flex;
  justify-content: stretch;
  
  > div {
    margin-top: auto;
    margin-bottom: auto;
  }
`

const OtherClipsContainer = styled.div`
  flex-direction: column;
  display: flex;
  margin-top: 4px;
  margin-right: 68px;
  align-content: flex-end;
  margin-left: 40px;
`

const StackSummary = styled(({clipSlugs, channelName, expandStack, toggleExpandStack, className}: { clipSlugs: string[], channelName: string, expandStack: boolean, toggleExpandStack: () =>  void, className?: string}) => {


  const currentSort = useAppSelector(state => state.channels[channelName].sort)

  let ViewCount = useMemo(() => <ViewCountBadge clipSlugs={clipSlugs} key={'summaryviews'+clipSlugs.join("")}/>, [clipSlugs])
  let WhenAgo = useMemo(() => <Delay clipSlug={clipSlugs[0]} key={'summarywhen'+clipSlugs}/>, [clipSlugs])
  let Duration = useMemo(() => <ClipDurationBadge clipSlug={clipSlugs[0]} key={'duration'+clipSlugs[0]}/>, [clipSlugs])

  function renderBadges() {
    let activeresult: JSX.Element[] = []
    let inactiveresult: JSX.Element[] = []

    currentSort.forEach(sort => {

      let component: JSX.Element | null;

      switch (sort.type) {
        case SortTypes.views:
          component = ViewCount
          break;
        case SortTypes.date:
          component = WhenAgo
          break;
        case SortTypes.length:
          component = Duration
          break;
        default:
          component = null
          break;
      }

      if (sort.active && component) {
        activeresult.push(component)
      } else if (component) {
        inactiveresult.push(component)
      }
    })

    return activeresult.concat(inactiveresult)

  }

  // return (
  //   <div className={className}>
  //     { renderBadges() }
  //   </div>
  // )

  return (
    <div className={className}>
      { renderBadges() }
      <TagsBadge clipSlugs={clipSlugs} channelName={channelName}/>
      <ExpandButtonBadge expandToggle={toggleExpandStack} expanded={expandStack} clipsCount={clipSlugs.length}/>
    </div>
  )

})`

  display: flex;
  flex-direction: column;
  width: 64px;
  min-width: 64px;
  justify-content: stretch;
  height: 142px;
  box-sizing: border-box;
  

  > div {
    flex-direction: row;
    border-radius: 0px;
    align-self: unset;

    &:first-of-type {
      border-top-left-radius: 4px;
      border-top-right-radius: 4px;
      margin-top: 0px;
    }
    
    &:last-of-type {
      border-bottom-left-radius: 4px;
      border-bottom-right-radius: 4px;
      margin-bottom: 0px;
    }

    span {
      margin-right: 2px;
      font-size: 14px;
      font-weight: 700;
    }

    svg {
      margin-right: 2px;
    }

    margin: 2px 2px 2px 4px;
    padding: 2px;
    width: 100%;
    justify-content: flex-end;
  }

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
        <Flex flexDirection={'column'}>
          <VerticalVoteCountBadge clipSlugs={clipSlugs} channelName={channelName} />
        </Flex>
        <Clip key={channelName+sortedSlugs[0]} clipSlug={sortedSlugs[0]} channelName={channelName} hideStats={!expandStack}/>
        <StackSummary clipSlugs={clipSlugs} channelName={channelName} className={className} expandStack={expandStack} toggleExpandStack={toggleExpandStack}/>
      </FirstClipContainer>

      { expandStack && sortedSlugs.slice(1, sortedSlugs.length).map(slug => (
        <OtherClipsContainer>
          <Clip key={channelName+slug} clipSlug={slug} channelName={channelName}/>
        </OtherClipsContainer>
      )) }


    </div>
  )

}


export default styled(ClipStack)`
  display: flex;
  flex-direction: column;
  align-content: flex-end;
  margin: 0px 0px 8px 0px;
`