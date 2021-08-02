import React from 'react'
import styled from 'styled-components'
import { useAppSelector } from '../../hooks/reduxHooks'
import {UserPip} from '../badges/UserPip'
import { SectionTitle } from '../typography/SectionTitle'
import CustomPopover from './CustomPopover'
import { selectStackModerationReport, selectStackVoteReport } from '../../redux/selectors'

const VoteStatsUserPip = styled(UserPip)`

    margin-top: auto;
    margin-bottom: auto;
    margin-right: 0px;
    height: 16px;
    border-radius: 3px;

    svg {
      margin-left: 0px;
      margin-right: 0px;
      height: 16px;
      width: 16px;
      padding: 0px 1px;
      margin-top: auto
      margin-bottom: auto;
      box-sizing: border-box;
  
    }

`

const VoteStatsPopooverContainer = styled.div<{items: number, sectionCount: number}>`
  width: ${p => Math.ceil(((p.items*18)+(p.sectionCount*18))/488)*130}px;
  display: inline-flex;
  overflow: visible;
  flex-direction: column;
	border-radius: 4px;
  padding: 8px 12px 8px 8px;
  z-index: 100;
  #sectiondiv {
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    max-height: 500px;
    width: fit-content;
    padding: 1px;
    font-size: 14px;
    line-height: 14px;
    margin-top: 2px;
    margin-bottom: 4px;
    > h5 {
      margin-left: 0px;
      margin-top: 2px;
      margin-bottom: 5px;
    }
    > div {
      display: flex;
      flex-direction: row;
      margin-top: 2px;
      width: 130px;
      margin-right: 12px;
    }
    span {
      margin-left: 4px;
    }
  }

`

const VoteStatsSection = ({title, limit, userNames, clipSlugs, channelName}: { title: string, limit: number, userNames: string[], clipSlugs: string[], channelName: string}) => (
  <div id={'sectiondiv'}>
    <SectionTitle>{userNames.length} {title}{userNames.length !== 1 && `s`}:</SectionTitle>
    {userNames.slice(0, limit).map(userName => (
      <div key={clipSlugs.join("")+'vetolistitem'+userName+channelName}>
        <VoteStatsUserPip key={clipSlugs.join("")+'vetouserpip'+userName+channelName} userName={userName} channelName={channelName}/>
        <span>
          {userName}
        </span>
      </div>
    ))}
    {userNames.length > limit && (
      <span>...and {userNames.length - limit} more</span>
    )}
  </div>
)


const VoteStatsPopover = ({target, clipSlugs, channelName, className}: { target: HTMLDivElement, clipSlugs: string[], channelName: string, className?: string}) => {

  const { upVoters, downVoters } = useAppSelector(state => 
    selectStackVoteReport([ state, clipSlugs, channelName ])
  )

  const { sortedMetas, sortedDramas, vetos } = useAppSelector(state => 
    selectStackModerationReport([state, clipSlugs, state.channels[channelName]])
  )

  return (
    <CustomPopover placement={'right'} onDismiss={() => null} target={target}>
      <VoteStatsPopooverContainer 
        sectionCount={
          (vetos.length > 0 ? 1 : 0)+
          (upVoters.length > 0 ? 1 : 0)+
          (downVoters.length > 0 ? 1 : 0)+
          (sortedMetas[0].length+sortedMetas[1].length > 0 ? 1 : 0)+
          (sortedDramas[0].length+sortedDramas[1].length > 0 ? 1 : 0)
        } 
        items={
          Math.min(upVoters.length, 50)+
          Math.min(downVoters.length, 50)+
          Math.min(sortedMetas[0].length, 10)+
          Math.min(sortedMetas[1].length, 10)+
          Math.min(sortedDramas[0].length, 10)+
          Math.min(sortedDramas[1].length, 10)+
          Math.min(vetos.length, 10)} className={className}>
        { vetos.length > 0 && <VoteStatsSection title={'veto'} limit={10} userNames={vetos} clipSlugs={clipSlugs} channelName={channelName}/> }
        { sortedDramas[0].length > 0 && <VoteStatsSection title={'drama confirmation'} limit={10} userNames={sortedDramas[0]} clipSlugs={clipSlugs} channelName={channelName}/> }
        { sortedDramas[1].length > 0 && <VoteStatsSection title={'drama suggestion'} limit={10} userNames={sortedDramas[1]} clipSlugs={clipSlugs} channelName={channelName}/> }
        { sortedMetas[0].length > 0 && <VoteStatsSection title={'meta confirmation'} limit={10} userNames={sortedMetas[0]} clipSlugs={clipSlugs} channelName={channelName} /> }
        { sortedMetas[1].length > 0 && <VoteStatsSection title={'meta suggestion'} limit={10} userNames={sortedMetas[1]} clipSlugs={clipSlugs} channelName={channelName} /> }
        { upVoters.length > 0 && <VoteStatsSection title={'upvote'} limit={50} userNames={upVoters} clipSlugs={clipSlugs} channelName={channelName} /> }
        { downVoters.length > 0 && <VoteStatsSection title={'downvote'} limit={50} userNames={downVoters} clipSlugs={clipSlugs} channelName={channelName} /> }
      </VoteStatsPopooverContainer>
    </CustomPopover>
  )
} 

export default styled(VoteStatsPopover)`


`