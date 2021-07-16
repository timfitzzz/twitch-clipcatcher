import React, { useRef, useState, useMemo } from 'react';
import styled from 'styled-components';
import { useAppSelector } from '../../hooks/reduxHooks';
import { UserTypes } from '../../types';
import { DifferentiatedUserPip } from './UserPip';
import VoteStats from '../popovers/VoteStats'
import debounce from 'lodash/debounce';
import { abbreviateNumber } from 'js-abbreviation-number'
import { selectVotersByClipIds } from '../../redux/clips';

const VerticalVoteCount = styled.div<{charCount: number}>`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  margin-left: auto;
  margin-right: auto;
  height: unset;

  box-shadow: none;

  span {
    font-weight: bold;
    font-size: ${p => {

      switch (p.charCount) {
        case 1:
          return 28
        case 2: 
          return 24
        case 3:
          return 18
        case 4:
          return 14
        case 5:
          return 12
        case 6:
          return 10
        default:
          return 8
      }
    }}px;
    line-height: 21px;
    margin-top: 0px;
    margin-bottom: auto;
    padding-bottom: 1px;
    margin-left: 0px;
  }
`

const VerticalVoteCountBadge = ({ clipSlugs, channelName, className}: { clipSlugs: string[], channelName: string, className?: string}) => {

  const { upVoters, downVoters, upvoterTypes: typesUpvotedBy } = useAppSelector(state => 
      selectVotersByClipIds({ state, clipSlugs, channelName })
    )
  // let upVoters = useAppSelector(state => clipSlugs.reduce(
  //   (upvoters, clipSlug) => {
  //     state.clips.clips[clipSlug].votes[channelName].up.forEach(userName => {
  //         if (upvoters.indexOf(userName) === -1) {
  //           upvoters.push(userName)
  //         }
  //     })
  //     return upvoters
  //   }, [] as string[]).sort(
  //   (usernameA, usernameB) => Math.max(...state.users.users[usernameB].userTypes[channelName]) -
  //                             Math.max(...state.users.users[usernameA].userTypes[channelName]) 
  // ), shallowEqual)

  // let downVoters = useAppSelector(state => clipSlugs.reduce(
  //   (downvoters, clipSlug) => {
  //     state.clips.clips[clipSlug].votes[channelName].down.forEach(userName => {
  //         if (downvoters.indexOf(userName) === -1) {
  //           downvoters.push(userName)
  //         }
  //     })
  //     return downvoters
  //   }, [] as string[]).sort(
  //   (usernameA, usernameB) => Math.max(...state.users.users[usernameB].userTypes[channelName]) -
  //                             Math.max(...state.users.users[usernameA].userTypes[channelName]) 
  // ), shallowEqual)
  
  // // let postedBy = useAppSelector(state => [...state.clips.clips[clipSlug].postedBy[channelName]].sort(
  // //   (usernameA, usernameB) => Math.max(...state.users.users[usernameB].userTypes[channelName]) -
  // //                             Math.max(...state.users.users[usernameA].userTypes[channelName]) 
  // // ), shallowEqual)

  // const typesUpvotedBy = useAppSelector(state => upVoters.reduce((foundTypes, userName) => {
  //   let maxUserType = Math.max(...state.users.users[userName].userTypes[channelName])
  //   if (foundTypes.indexOf(maxUserType) === -1) {
  //     foundTypes.push(maxUserType)
  //   }
  //   return foundTypes.sort((a, b) => b - a)
  // }, [] as number[]), shallowEqual)


  let popoverTarget = useRef<HTMLDivElement>(null)
  let [showPopover, setShowPopover] = useState<any>(false)

  const handlePopover = debounce(() => setShowPopover(true), 100)

  const handleMouseExit = () => {
    handlePopover.cancel()
    setShowPopover(false)
  }

  const voteTotalText = useMemo(() => 
    ((upVoters.length - downVoters.length) > 0 ? '+' : '') + 
    abbreviateNumber(upVoters.length - downVoters.length), 
  [upVoters, downVoters])

  return (
    <div className={className} ref={popoverTarget} onMouseLeave={handleMouseExit} onMouseOver={handlePopover}>
      { showPopover
        && !!(popoverTarget.current)
        && <VoteStats target={popoverTarget.current} clipSlugs={clipSlugs} channelName={channelName} />
      }
      <VerticalVoteCount charCount={voteTotalText.length}>
        <span>{voteTotalText}</span>
      </VerticalVoteCount>
      {/* <PlusOrMinusIcon className={'plusorminus'}/> */}
      <div className={'types'}>
        {typesUpvotedBy.map((type: UserTypes) => (
          <DifferentiatedUserPip userType={type}/>
        ))}
      </div>


    </div>
  )
  // return (<div></div>)

}


export default styled(VerticalVoteCountBadge)`
  display: flex;
  flex-direction: column;
  // justify-content: flex-end;
  margin-bottom: 0px!important;
  margin-top: 0px!important;
  width: 32px;
  border-radius: inherit;
  background-color: ${({theme}) => theme.colors.success.semilight};
  border-radius: 8px;
  padding-top: 8px;
  padding-bottom: 8px;
  box-sizing: border-box;

  // div {
  //   // margin-left: 2px;
  //   margin-top: 0px;
  //   // margin-bottom: auto;
  //   // margin-right: 0px;
  //   height: 20px;
  //   border-radius: 4px;

  // }

  .types {
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    margin-top: 4px;
    justify-content: center;
    justify-self: flex-end;

    > div {
      height: 16px;
      margin-top: 4px!important;
      margin-left: auto;
      margin-right: auto;
      border-radius: 4px;
      svg {
        margin-left: 0px;
        margin-right: 0px;
        height: 16px;
        width: 16px;
        margin-top: auto;
        margin-bottom: auto;
    
      }
    }
    
  }


  .votecount {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    padding: 0px 4px 0px 4px;
    margin-left: auto;
    margin-right: auto;
    height: unset;
    justify-self: flex-start;

    box-shadow: none;
  
    span {
      font-weight: bold;
      font-size: 28px;
      line-height: 21px;
      margin-top: 0px;
      margin-bottom: auto;
      padding-bottom: 1px;
      margin-left: 0px;
    }

  }

    
  .plusorminus {
    margin-left: auto;
    margin-right: auto;
    height: 16px;
    width: 16px;
    margin-bottom: auto;
    fill: ${({theme}) => theme.colors.text.main};
  }

`
