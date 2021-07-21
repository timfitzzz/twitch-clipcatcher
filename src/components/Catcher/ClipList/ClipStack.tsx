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
  height: 150px;
  
  > div {
    margin-top: auto;
    margin-bottom: auto;
  }
`

const OtherClipsContainer = styled.div`
  flex-direction: column;
  display: flex;
  margin-top: 0px;

  margin-right: 68px;
  align-content: flex-end;
  margin-left: 42px;
`

const OtherClip = styled(Clip)`
  margin-bottom: 4px;
`

const StackSummary = styled(({clipSlugs, channelName, expandStack, toggleExpandStack, className}: { clipSlugs: string[], channelName: string, expandStack: boolean, toggleExpandStack: () =>  void, className?: string}) => {


  const currentSort = useAppSelector(state => state.channels[channelName].sort)

  const renderBadges = useMemo(() => () => {
    let activeresult: JSX.Element[] = []
    let inactiveresult: JSX.Element[] = []

    currentSort.forEach((sort, index) => {

      let component: JSX.Element | null;

      switch (sort.type) {
        case SortTypes.views:
          component = <ViewCountBadge clipSlugs={clipSlugs} key={'summaryviews'+clipSlugs.join("")} zIndex={10 - index}/>
          break;
        case SortTypes.date:
          component = <Delay clipSlug={clipSlugs[0]} key={'summarywhen'+clipSlugs} zIndex={10 - index}/>
          break;
        case SortTypes.length:
          component = <ClipDurationBadge clipSlug={clipSlugs[0]} key={'duration'+clipSlugs[0]} zIndex={10 - index}/>
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

  }, [clipSlugs, currentSort])

  // return (
  //   <div className={className}>
  //     { renderBadges() }
  //   </div>
  // )

  return (
    <div className={className}>
      <div className={'stackedBadges'}>
        { renderBadges() }
      </div>
      <div className={'otherBadges'}>
        <TagsBadge clipSlugs={clipSlugs} channelName={channelName}/>
        <ExpandButtonBadge expandToggle={toggleExpandStack} expanded={expandStack} clipsCount={clipSlugs.length}/>
      </div>
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

  .stackedBadges {
    margin-right: 2px;
    display: flex;
    flex-direction: column;

    > div {
      flex-direction: row;
      // border-radius: 0px;
      align-self: unset;
  
      transform: rotate3d(1, 1, -0.1, 20deg);
      box-shadow: -2px 2px 5px -3px darkgray;
  
      &:first-of-type {
        border-top-left-radius: 4px;
        border-top-right-radius: 4px;
        margin-top: 0px;
      }
  
      &:nth-of-type(2) {

      }

      &:not(:first-of-type) {
        // border-top: 1px solid lightgray;
      }
      
      &:last-of-type {
        border-bottom-left-radius: 4px;
        border-bottom-right-radius: 4px;
        margin-bottom: 0px;
        border-bottom: none;
        box-shadow: box-shadow: -2px 2px 2px -3px darkgray;
        transform: none;
        padding-right: 0px;
        svg {
          padding-right: 1px;
        }
      }
  
      span {
        margin-right: 2px;
        font-size: 14px;
        font-weight: 700;
      }
  
      svg {
        margin-right: 2px;
      }
  
      margin: -4px 2px -0px 4px;
      padding: 2px;
      width: 100%;
      justify-content: flex-end;
    }
  }
  .otherBadges {
    margin-top: auto;
    margin-bottom: 0px;
      

    > div {
      box-sizing: border-box;
      margin: 4px 2px 0px 4px;
      flex-direction: row;
      border-radius: 0px;
      border-radius: 4px;
  
      span {
        margin-right: 2px;
        font-size: 14px;
        font-weight: 700;
      }
  
      svg {
        margin-right: 3px;
      }

      padding: 0px 2px;
      width: 100%;
      justify-content: flex-end;
    }
  }
  

`

const ClipsSeparator = styled.div`
  margin-top: 12px;
  margin-left: auto;
  margin-right: auto;
  width: 25%;
  border: 1px solid ${p => p.theme.colors.gray.main};
  border-radius: 2px;
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


        <OtherClipsContainer>
        { expandStack && sortedSlugs.slice(1, sortedSlugs.length).map(slug => (
          <OtherClip key={channelName+slug} clipSlug={slug} channelName={channelName}/>
          )) }
        </OtherClipsContainer>

      <ClipsSeparator/>

    </div>
  )

}


export default styled(ClipStack)`
  display: flex;
  flex-direction: column;
  align-content: flex-end;
  margin: 12px 0px 0px 0px;
  &:first-of-type {
    margin-top: 4px;
  }
`