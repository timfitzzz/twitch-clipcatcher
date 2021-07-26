import React from 'react'
import styled from 'styled-components'
import { useAppSelector } from '../../hooks/reduxHooks'
import {UserPip} from '../badges/UserPip'
import { SectionTitle } from '../typography/SectionTitle'
import { Popover } from 'rendition'
import { selectVotersByClipIds } from '../../redux/clips'
import { selectStackModerationReport } from '../../redux/selectors'

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

const VoteStatsPopover = ({target, clipSlugs, channelName, className}: { target: HTMLDivElement, clipSlugs: string[], channelName: string, className?: string}) => {

  const { upVoters, downVoters } = useAppSelector(state => 
    selectVotersByClipIds({ state, clipSlugs, channelName })
  )

  const { sortedMetas, sortedDramas, vetos } = useAppSelector(state => 
    selectStackModerationReport({state, clipSlugs, channel: state.channels[channelName]})
  )

  return (
    <Popover placement={'right'} onDismiss={() => null} target={target}>
      <div className={className}>
        { vetos.length > 0 && (
            <div id={'sectiondiv'}>
              <SectionTitle>{vetos.length} veto{vetos.length !== 1 && `s`}:</SectionTitle>
              {vetos.map(userName => (
                <div key={clipSlugs.join("")+'vetolistitem'+userName+channelName}>
                  <VoteStatsUserPip key={clipSlugs.join("")+'vetouserpip'+userName+channelName} userName={userName} channelName={channelName}/>
                  <span>
                    {userName}
                  </span>
                </div>
              ))}
            </div>
          )
        }
        { (sortedDramas[0].length > 0 || sortedDramas[1].length) > 0 && (
          <div id={'sectiondiv'}>
            {sortedDramas[0].length > 0 && (
              <>
                <SectionTitle>{sortedDramas[0].length} drama confirmation{sortedDramas[0].length !== 1 && `s`}:</SectionTitle>
                {sortedDramas[0].map(userName => (
                  <div key={clipSlugs.join("")+'dramalistitem'+userName+channelName}>
                    <VoteStatsUserPip key={clipSlugs.join("")+'dramauserpip'+userName+channelName} userName={userName} channelName={channelName}/>
                    <span>
                      {userName}
                    </span>
                  </div>
                ))}
              </>
            )}
            {sortedDramas[1].length > 0 && (
              <>
                <SectionTitle>{sortedDramas[1].length} drama suggestion{sortedDramas[1].length !== 1 && `s`}:</SectionTitle>
                {sortedDramas[1].map(userName => (
                  <div key={clipSlugs.join("")+'dramalistitem'+userName+channelName}>
                    <VoteStatsUserPip key={clipSlugs.join("")+'dramauserpip'+userName+channelName} userName={userName} channelName={channelName}/>
                    <span>
                      {userName}
                    </span>
                  </div>
                ))}
              </>
            )}
          </div>
        )}
        { (sortedMetas[0].length > 0 || sortedMetas[1].length > 0) && (
          <div id={'sectiondiv'}>
            {sortedMetas[0].length > 0 && (
              <>
                <SectionTitle>{sortedMetas[0].length} meta confirmation{sortedMetas[0].length !== 1 && `s`}:</SectionTitle>
                {sortedMetas[0].map(userName => (
                  <div key={clipSlugs.join("")+'metalistitem'+userName+channelName}>
                    <VoteStatsUserPip key={clipSlugs.join("")+'metauserpip'+userName+channelName} userName={userName} channelName={channelName}/>
                    <span>
                      {userName}
                    </span>
                  </div>
                ))}
              </>
            )}
            {sortedMetas[1].length > 0 && (
              <>
                <SectionTitle>{sortedMetas[1].length} meta suggestion{sortedMetas[1].length !== 1 && `s`}:</SectionTitle>
                {sortedMetas[1].map(userName => (
                  <div key={clipSlugs.join("")+'metalistitem'+userName+channelName}>
                    <VoteStatsUserPip key={clipSlugs.join("")+'metauserpip'+userName+channelName} userName={userName} channelName={channelName}/>
                    <span>
                      {userName}
                    </span>
                  </div>
                ))}
              </>
            )}
          </div>
        )}
        {upVoters.length > 0 && (
          <div id={'sectiondiv'}>
            <SectionTitle>{upVoters.length} upvote{upVoters.length !== 1 && `s`}:</SectionTitle>
            { upVoters.map(userName => (
              <div key={'votelistitem'+userName+channelName} >
                <VoteStatsUserPip key={'userpip'+userName+channelName} userName={userName} channelName={channelName}/>
                <span>
                  {userName}
                </span>
              </div>
            ))}
          </div>
        )}
        {downVoters.length > 0 && (
          <div id={'sectiondiv'}>
            <SectionTitle>{downVoters.length} downvote{downVoters.length !== 1 && 's'}:</SectionTitle>
            { downVoters.map(userName => (
              <div key={'votelistitem'+userName+channelName} >
                <VoteStatsUserPip key={'userpip'+userName+channelName}  userName={userName} channelName={channelName}/>
                <span>
                  {userName}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </Popover>
  )
} 

export default styled(VoteStatsPopover)`

  display: flex;
  flex-direction: column;
  
  padding: 4px;
  z-index: 100;
  #sectiondiv {
    display: flex;
    flex-direction: column;
    padding: 1px;
    font-size: 14px;
    line-height: 14px;
    margin-top: 2px;
    margin-bottom: 4px;
    > h5 {
      margin-left: 0px;
      margin-bottom: 2px;
    }
    > div {
      display: flex;
      flex-direction: row;
      margin-top: 2px;
    }
    span {
      margin-left: 4px;
    }
  }


`