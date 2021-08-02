import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import { useAppSelector } from '../../hooks/reduxHooks';
import { UserTypes } from '../../types';
import { DifferentiatedUserPip } from './UserPip';
import VoteStats from '../popovers/VoteStats'
import debounce from 'lodash/debounce';
import { selectStackVoteReport } from '../../redux/selectors';

const VoteCountBadge = ({ clipSlugs, channelName, className}: { clipSlugs: string[], channelName: string, className?: string}) => {

  let { upVoters, downVoters, upvoterTypes: typesUpvotedBy } = useAppSelector(state => 
    selectStackVoteReport([state, clipSlugs, channelName])
  )

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
      {typesUpvotedBy.map((type: UserTypes) => (
        <DifferentiatedUserPip key={'horizontalpip'+type} userType={type}/>
      ))}
      <div className={'badgeinner'}>
        <span>{upVoters.length - downVoters.length}</span>
      </div>
    </div>
  )

}

export default styled(VoteCountBadge)`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  margin: 4px;

  div {
    margin-left: 4px;
    margin-top: auto;
    margin-bottom: auto;
    margin-right: 0px;
    height: 20px;
    border-radius: 4px;

  }

  svg {
    margin-left: 0px;
    margin-right: 0px;
    height: 20px;
    width: 20px;
    margin-top: auto;
    margin-bottom: auto;

  }



  .badgeinner {
    display: flex;
    flex-direction: row;
    border-radius: 4px;
    padding: 0px 4px 0px 4px;
    margin-right: 0px;
    // margin: 4px 4px 4px auto;
    height: unset;
    background-color: #138b27; // ${({theme}) => theme.colors.success.semilight};
    width: fit-content;
    box-shadow: none;
    color: white;
    cursor: default;
  
    span {
      font-weight: 700;
      font-size: 14px;
      font-weight: 700;
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
