import React, { useRef, useState } from 'react';
import { shallowEqual } from 'react-redux';
import styled from 'styled-components';
import { useAppSelector } from '../../hooks/reduxHooks';
import { UserTypes } from '../../types';
import { DifferentiatedUserPip } from './UserPip';
import { PlusOrMinusIcon } from './PlusOrMinusIcon';
import VoteStats from '../popovers/VoteStats'
import debounce from 'lodash/debounce';

const VoteCountBadge = ({ clipSlugs, channelName, className}: { clipSlugs: string[], channelName: string, className?: string}) => {

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
  
  // let postedBy = useAppSelector(state => [...state.clips.clips[clipSlug].postedBy[channelName]].sort(
  //   (usernameA, usernameB) => Math.max(...state.users.users[usernameB].userTypes[channelName]) -
  //                             Math.max(...state.users.users[usernameA].userTypes[channelName]) 
  // ), shallowEqual)

  const typesUpvotedBy = useAppSelector(state => upVoters.reduce((foundTypes, userName) => {
    let maxUserType = Math.max(...state.users.users[userName].userTypes[channelName])
    if (foundTypes.indexOf(maxUserType) === -1) {
      foundTypes.push(maxUserType)
    }
    return foundTypes.sort((a, b) => b - a)
  }, [] as number[]), shallowEqual)


  let popoverTarget = useRef<HTMLDivElement>(null)
  let [showPopover, setShowPopover] = useState<any>(false)

  const handlePopover = debounce(() => setShowPopover(true), 100)

  const handleMouseExit = () => {
    handlePopover.cancel()
    setShowPopover(false)
  }


  return (
    <div className={className} ref={popoverTarget} onMouseLeave={handleMouseExit} onMouseOver={handlePopover}>
      { showPopover
        && !!(popoverTarget.current)
        && <VoteStats target={popoverTarget.current} clipSlugs={clipSlugs} channelName={channelName} />
      }
      <div className={'badgeinner'}>
        <span>{upVoters.length - downVoters.length}</span>
        <PlusOrMinusIcon className={'plusorminus'}/>
      </div>
      <div className={'types'}>
        {typesUpvotedBy.map((type: UserTypes) => (
          <DifferentiatedUserPip userType={type}/>
        ))}
      </div>


    </div>
  )
  // return (<div></div>)

}


export default styled(VoteCountBadge)`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  width: 100%;
  border-radius: inherit;
  background-color: ${({theme}) => theme.colors.success.semilight};
  // border-top-left-radius: 4px;
  // border-top-right-radius: 4px;
  // border-bottom-left-radius: 0px;
  // border-bottom-right-radius: 0px;

  div {
    margin-left: 4px;
    margin-top: auto;
    margin-bottom: auto;
    margin-right: 0px;
    height: 20px;
    border-radius: 4px;

  }



  .types {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    svg {
      margin-left: 0px;
      margin-right: 0px;
      height: 20px;
      width: 20px;
      margin-top: auto;
      margin-bottom: auto;
  
    }
  }


  .badgeinner {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;

    padding: 0px 4px 0px 4px;
    margin-right: 0px;
    height: unset;

    box-shadow: none;
  
    span {
      font-weight: bold;
      font-size: 16px;
      line-height: 21px;
      margin-top: auto;
      margin-bottom: auto;
      padding-bottom: 1px;
      margin-left: 0px;
    }
  
    .plusorminus {
      margin-top: auto;
      margin-left: 4px;
      margin-right: 0px;
      height: 16px;
      width: 16px;
      margin-bottom: auto;
      fill: ${({theme}) => theme.colors.text.main};
    }
  }

`
