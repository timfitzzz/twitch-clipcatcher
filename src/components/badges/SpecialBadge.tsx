import debounce from 'lodash/debounce'
import React, { useMemo } from 'react'
import { useState } from 'react'
import { useRef } from 'react'
import { Popover } from 'rendition'
import styled from 'styled-components'
import { useAppSelector } from '../../hooks/reduxHooks'
import { specialTagsMaxUserTypeSelector, specialTagsOrderedUsersSelector } from '../../redux/clips'
import { UserPip } from './UserPip'
import { SectionTitle } from '../typography/SectionTitle'
import { TheaterMasks } from '@styled-icons/fa-solid/TheaterMasks'
import { BookDead } from '@styled-icons/fa-solid/BookDead'
import { SpecialState } from '../../types'
import { PlayIcon, PlayIconState } from '../Catcher/ClipList/PlayButton'


export const SpecialIcon = styled(({type, specialState, className}: { type: 'drama' | 'meta' | 'veto', specialState: SpecialState, className?: string}) => {

  return (
    <div className={className}>
      { 
        {
          'meta': <BookDead/>,
          'drama': <TheaterMasks/>,
          'veto': <PlayIcon state={PlayIconState['vetoed']}/>
        }[type]
      }
    </div>
  )

})`

  ${({specialState}) => {
    if (specialState === SpecialState.no) {
      return `display: none!important;`
    }
  }}

  svg {
    width: unset;
    margin-top: 2px;
    box-sizing: border-box;
    vertical-align: unset;
    padding-top: 1px!important;
    padding-bottom: 1px;
    padding-left: 1px;
    padding-right: 1px;
    height: 16px!important;
    ${({specialState, theme}) => {
      switch (specialState) {
        case SpecialState.maybe:
          return `
            color: ${theme.colors.warning.main};
            background-color: black;
            opacity: 0.8;
          `
        case SpecialState.yes:
          return `
            color: ${theme.colors.danger.dark};
            background-color: black;
            opacity: 1;
          `
        default:
          return `
          `
      }
    }}
  }

`

// const SpecialText = styled(({type, specialState, className}: { type: 'drama' | 'meta', specialState: SpecialState, className?: string}) => {
 
//   return (
//     <svg viewBox={`0 0 ${13 * type.length} 24`} className={className}>
//       <text y="18">{type.toUpperCase()}</text>
//     </svg>
//   )
  
// })`
//   font-size: 20px;
//   font-weight: bolder;
//   font-stretch: expanded;
//   height: 20px;
//   line-height: 20px;

//   text {
//     ${({specialState, theme}) => {
//       switch (specialState) {
//         case SpecialState.maybe:
//           return `
//             fill: none;
//             stroke: ${theme.colors.warning.main};
//             stroke-width: 1px;
//             stroke-linejoin: round;
//             text-shadow: -1px 1px 0.5px black;
//           `
//         case SpecialState.yes:
//           return `
//             fill: ${theme.colors.danger.main};
//             stroke-width: 2px;
//             stroke: ${theme.colors.danger.main};
//             text-shadow: -1px 1px 0.5px black;
//           `
//         default:
//           return `
//             fill: ${theme.colors.gray.light};
//             opacity: 0.1;
//           `
//       }
//     }}
//   }
// `

const SpecialBadgePopover = styled(
  ({
    target,
    type,
    clipSlugs,
    channelName,
    className
  }: {
    target: HTMLDivElement
    type: 'meta' | 'drama'
    clipSlugs: string[]
    channelName: string
    className?: string
  }) => {

    let [empoweredUsers, otherUsers] = useAppSelector(state => specialTagsOrderedUsersSelector([
      state,
      clipSlugs,
      channelName,
      type
    ]))

    return (
      <Popover placement={'right'} onDismiss={() => null} target={target}>
        <div className={className}>
          { empoweredUsers.length === 0 && otherUsers.length === 0 && (
            <SectionTitle>no {type} tags</SectionTitle>
          )}
          { empoweredUsers.length > 0 && (
            <>
              <SectionTitle>confirmed by:</SectionTitle>
              { empoweredUsers.map(userName =>
                <div><UserPip key={'user'+userName+channelName} userName={userName} channelName={channelName}/>{userName}</div>
              )}
            </>
          )}
          { otherUsers.length > 0 && (
            <>
              <SectionTitle>suggested by:</SectionTitle>
              { otherUsers.map(userName =>
                <div><UserPip key={'user'+userName+channelName} userName={userName} channelName={channelName}/>{userName}</div>
              )}
            </>
          )}
        </div>
      </Popover>
    )
  }
)`
  font-size: 14px;
  padding: 4px;
  border-radius: 8px;
  display: flex;
  flex-direction: column;

  h5 {
    margin-left: 0px;
  }

  div {
    display: flex;
    flex-direction: row;
    align-items: center;
    // height: 12px;
    // width: 14px;
    // margin-right: 4px;

    margin-top: 2px;
    margin-bottom: 0px;
    margin-right: 4px;
    height: 16px;
    border-radius: 3px;

    &:first-of-type {
      margin-top: 4px;
    }

    &:last-of-type {
      margin-bottom: 4px;
    }

    svg {
      margin-left: 0px;
      height: 16px;
      width: 16px;
      padding: 0px 1px;
      margin-top: auto
      margin-bottom: auto;
      box-sizing: border-box;
  
    }

  }
`

export const SpecialBadge = ({type, clipSlugs, channelName, className}: { type: 'meta' | 'drama', clipSlugs: string[], channelName: string, className?: string}) => {

  let maxUserType = useAppSelector(state => specialTagsMaxUserTypeSelector(
    [state, clipSlugs, channelName, type]
  ))

  let specialState: SpecialState = useMemo(() => (maxUserType > -1 ? maxUserType > 2  ? SpecialState.yes : SpecialState.maybe : SpecialState.no)
    , [maxUserType])

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
        && <SpecialBadgePopover 
            target={popoverTarget.current}
            type={type}
            clipSlugs={clipSlugs}
            channelName={channelName}
          />
      }
      <SpecialIcon type={type} specialState={specialState}/>
    </div>
  )

}


export default styled(SpecialBadge)`
  display: flex;
  margin-left: 4px;
  width: 20px;
  z-index: 100;
  cursor: pointer;
  div {
    display: flex;
    box-sizing: border-box;
    width: 20px;
    height: 20px;
    padding-left: 1px;
    padding-right: 1px;
    border-radius: 4px;
    svg {
      display: flex;
      margin: auto;
      padding-left: 1px;
      padding-right: 1px;
    }
    &:not:first-of-type{
      margin-left: 4px!important;
    }
    margin-top: 4px;
  }

`