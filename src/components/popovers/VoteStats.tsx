import React from 'react'
import { shallowEqual } from 'react-redux'
import styled from 'styled-components'
import { useAppSelector } from '../../hooks/reduxHooks'
import {UserPip} from '../badges/UserPip'
import { SectionTitle } from '../typography/SectionTitle'
import { Popover } from 'rendition'

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

  let upVoters = useAppSelector(state => clipSlugs.reduce(
    (upvoters, clipSlug) => {
      state.clips.clips[clipSlug].votes[channelName].up.forEach(userName => {
          if (upvoters.indexOf(userName) === -1) {
            upvoters.push(userName)
          }
      })
      return upvoters
    }, [] as string[]).sort(
    (usernameA, usernameB) => Math.max(...state.users.users[usernameB].userTypes[channelName]) -
                              Math.max(...state.users.users[usernameA].userTypes[channelName]) 
  ), shallowEqual)

  let downVoters = useAppSelector(state => clipSlugs.reduce(
    (downvoters, clipSlug) => {
      state.clips.clips[clipSlug].votes[channelName].down.forEach(userName => {
          if (downvoters.indexOf(userName) === -1) {
            downvoters.push(userName)
          }
      })
      return downvoters
    }, [] as string[]).sort(
    (usernameA, usernameB) => Math.max(...state.users.users[usernameB].userTypes[channelName]) -
                              Math.max(...state.users.users[usernameA].userTypes[channelName]) 
  ), shallowEqual)

  // let posters = useAppSelector(state => clipSlugs.reduce(
  //   (posters, clipSlug) => {
  //     state.clips.clips[clipSlug].postedBy[channelName].forEach(userName => {
  //         if (posters.indexOf(userName) === -1) {
  //           posters.push(userName)
  //         }
  //     })
  //     return posters
  //   }, [] as string[]).sort(
  //   (usernameA, usernameB) => Math.max(...state.users.users[usernameB].userTypes[channelName]) -
  //                             Math.max(...state.users.users[usernameA].userTypes[channelName]) 
  // ), shallowEqual)

  return (
    <Popover placement={'right'} onDismiss={() => null} target={target}>
      <div className={className}>
        {/* {posters.length > 0 && (
          <div id={'sectiondiv'}>
            <SectionTitle>submitted by {posters.length}:</SectionTitle>
            { posters.map(userName => (
              <div>
                <UserPip userName={userName} channelName={channelName}/>
                <span>
                  {userName}
                </span>
              </div>
            ))}
          </div>
        )} */}
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