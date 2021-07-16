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


const FirstClipContainer = styled.div`
  flex-direction: row;
  display: flex;
  
  > div {
    margin-top: auto;
    margin-bottom: auto;
  }
`

const OtherClipsContainer = styled.div`
  flex-direction: column;
  display: flex;
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
      {/* <SquareVoteCountBadge clipSlugs={clipSlugs} channelName={channelName} /> */}
      {/* <ViewCountBadge clipSlugs={clipSlugs}/>
      <WhenAgoBadge clipSlug={clipSlugs[0]}/> */}
      { renderBadges() }
      <TagsBadge clipSlugs={clipSlugs} channelName={channelName}/>
      <ExpandButtonBadge expandToggle={toggleExpandStack} expanded={expandStack} clipsCount={clipSlugs.length}/>
    </div>
  )

})`

  display: flex;
  flex-direction: column;
  width: 80px;
  height: 144px;
  box-sizing: border-box;
  

  > div {
    flex-direction: row-reverse;
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
      margin-left: 4px;
    }

    margin: 2px 2px 2px 4px;
    padding: 2px;
    width: unset;
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
        <VerticalVoteCountBadge clipSlugs={clipSlugs} channelName={channelName} />
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
  // border: 1px solid black;
  // border-radius: 8px;
  display: flex-column;
  align-content: flex-end;
  margin: 0px 0px 8px 0px;
`