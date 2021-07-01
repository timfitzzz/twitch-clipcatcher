import debounce from 'lodash/debounce'
import React, { useRef } from 'react'
import { shallowEqual } from 'react-redux'
import { Flex, Popover } from 'rendition'
import styled from 'styled-components'
import { useAppSelector } from '../../hooks/reduxHooks'
import { UserTypes } from '../../types'
import { UserPip } from './UserPip'
import FrogStats from '../popovers/FrogStats'

const VoteCountBadge = styled(Flex)`
  padding-left: 4px;
  padding-right: 4px;
  margin-left: auto;
  margin-right: 4px;
  line-height: 14px;
  color: ${p => p.theme.colors.success.light};
  border-radius: 4px;
  height: 18px;

  margin-top: 4px;
  margin-bottom: 0px;
  background-color: ${p => p.theme.colors.success.dark};
  width: fit-content;
  font-weight: bold;
  font-size: 12px;
  box-sizing: content-box;
  z-index: 10;

  #total {
    margin-top: auto;
    margin-bottom: auto;
    margin-right: 4px;
  }

  #subtotals {
    margin-top: auto;
    margin-bottom: auto;
    font-size: 10px;
    margin-left: 2px;
  }

  #upvotes {

  }

  #downvotes {

  }

  // svg {
  //   margin-left: 2px;
  //   margin-top: auto;
  //   margin-bottom: auto;
  //   height: 12px;
  //   fill: ${p => p.theme.colors.success.light};
  //   path {
  //     fill:${p => p.theme.colors.success.light};
  //   }
  // }
  

`

// <span id='subtotals'>({upvotes.length}/{downvotes.length})</span>

const StackerFrog = styled(UserPip)<{index: number}>`
  position: absolute;
  // margin-left: -7px;
  top: 7px;
  right: ${p => 8 + p.index * 4}px;
`

const FrogPile = styled(({userTypes, className}: { userTypes: UserTypes[], className?: string}) => {
  return <div className={className}>
    {userTypes.reverse().map((userType, idx) => 
      <StackerFrog key={userType+'pip'} index={idx} userType={userType}/>
    )}
  </div>
})`

  width: ${p => p.userTypes.length > 0 ? (12 + ((p.userTypes.length - 1) * 4)) : 0}px;


`

const VoteCount = ({channelName, clipSlug, className}: {channelName: string, clipSlug: string, className?: string}) => {

  let upVotes = useAppSelector(state => state.clips.clips[clipSlug].votes[channelName].up)
  let downVotes = useAppSelector(state => state.clips.clips[clipSlug].votes[channelName].down)
  let upUserTypes = useAppSelector(state => upVotes.reduce(
      (aggTypes, userName) => {
        let maxUserType = Math.max(...state.users.users[userName].userTypes[channelName])
        if (aggTypes.indexOf(maxUserType) === -1) {
          return [...aggTypes, maxUserType]
        } else {
          return aggTypes
        }
      }, [] as UserTypes[]), shallowEqual)
  let downUserTypes = useAppSelector(state => downVotes.reduce(
    (aggTypes, userName) => aggTypes.concat(
      state.users.users[userName].userTypes[channelName].filter((userType, index, all) => {
        if (userType === UserTypes['user']) {
          if (all.length === 1) {
            return aggTypes.indexOf(userType) === -1
          } else {
            return false
          }
        } else {
          return aggTypes.indexOf(userType) === -1
        }
      })), [] as UserTypes[]), shallowEqual)
  
  let popoverTarget = useRef<HTMLDivElement>(null)
  let [showPopover, setShowPopover] = React.useState<any>(false)
  
  const handlePopover = debounce(() => setShowPopover(true), 500)

  const handleMouseExit = () => {
    handlePopover.cancel()
    setShowPopover(false)
  }

  return (
     <VoteCountBadge ref={popoverTarget} onMouseLeave={handleMouseExit} onMouseOver={handlePopover} flexDirection={"row"} className={className}>
       {showPopover && popoverTarget && popoverTarget.current && (
          <Popover placement={'right'} onDismiss={() => null} target={popoverTarget.current}>
            <FrogStats channelName={channelName} clipSlugs={[clipSlug]}/>
          </Popover>
        )}
      <span id='total'>{upVotes.length-downVotes.length}</span><FrogPile userTypes={upUserTypes.sort()}/><FrogPile userTypes={downUserTypes}/>
    </VoteCountBadge>
  )
}

export default VoteCount