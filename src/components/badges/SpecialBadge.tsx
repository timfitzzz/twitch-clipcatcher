import debounce from 'lodash/debounce'
import React, { useMemo } from 'react'
import { useState } from 'react'
import { useRef } from 'react'
import { shallowEqual } from 'react-redux'
import { Popover } from 'rendition'
import styled from 'styled-components'
import { useAppSelector } from '../../hooks/reduxHooks'
import { UserTypes } from '../../types'
import { isEmpowered } from '../../utilities/parsers'
import { DifferentiatedUserPip } from './UserPip'

enum SpecialState {
  no,
  maybe,
  yes
}

const SpecialText = styled(({type, specialState, className}: { type: 'drama' | 'meta', specialState: SpecialState, className?: string}) => {
 
  return (
    <svg viewBox={`0 0 ${13 * type.length} 24`} className={className}>
      <text y="18">{type.toUpperCase()}</text>
    </svg>
  )
  
})`
  font-size: 20px;
  font-weight: bolder;
  font-stretch: expanded;
  height: 20px;
  line-height: 20px;

  text {
    ${({specialState, theme}) => {
      switch (specialState) {
        case SpecialState.maybe:
          return `
            fill: none;
            stroke: ${theme.colors.warning.main};
            stroke-width: 1px;
            stroke-linejoin: round;
            text-shadow: -1px 1px 0.5px black;
          `
        case SpecialState.yes:
          return `
            fill: ${theme.colors.danger.main};
            stroke-width: 2px;
            stroke: ${theme.colors.danger.main};
            text-shadow: -1px 1px 0.5px black;
          `
        default:
          return `
            fill: ${theme.colors.gray.light};
            opacity: 0.1;
          `
      }
    }}
  }
`

const SpecialBadgePopover = styled(
  ({
    target,
    type,
    specialState,
    clipsTypaedBy,
    clipsUserTypesMap,
    className,
  }: {
    target: HTMLDivElement;
    type: 'meta' | 'drama';
    specialState: SpecialState;
    clipsTypaedBy: (string[] | null)[];
    clipsUserTypesMap: { [userName: string]: UserTypes };
    className?: string;
  }) => {
    let allUsers = useMemo<[string[], string[]]>(
      () => {
        let splitIndex = null
        let checkingIndex = 0

        let sortedUsers = clipsTypaedBy
          .reduce(
            (allUsers: string[], clipTypaedBy) => {
              if (clipTypaedBy) {
                allUsers = allUsers.concat(clipTypaedBy as string[])
              }
              return allUsers
            },
            [] as string[]
          )
          .sort(
            (userA, userB) =>
              clipsUserTypesMap[userA!] - clipsUserTypesMap[userB!]
          )

        if (specialState > SpecialState.maybe) {
          while (splitIndex === null && checkingIndex <= (sortedUsers.length - 1)) {
            if (clipsUserTypesMap[sortedUsers[checkingIndex]] < UserTypes['mod']) {
              splitIndex = checkingIndex
            } else {
              checkingIndex++
            }
          }
          
          return [
            sortedUsers.slice(0, splitIndex || 0),
            sortedUsers.slice(splitIndex || 0, sortedUsers.length)
          ]
        } else {
          return [
            sortedUsers,
            []
          ]
        }

      }, [clipsTypaedBy, clipsUserTypesMap, specialState]
    );

    return (
      <Popover placement={'right'} onDismiss={() => null} target={target}>
        <div className={className}>
          {
            {
              0: (
                <span>
                  no {type} tags
                </span>
              ),
              1: (
                <div>
                  <span id={'sectionTitle'}>suggested by:</span>
                  {allUsers[0].map((user) => (
                    <div><DifferentiatedUserPip key={user + type + 'pip'} userType={clipsUserTypesMap[user]}/>{user}</div>
                  ))}
                </div>
              ),
              2: (
                <div>
                  <span id={'sectionTitle'}>confirmed by:</span>
                  {allUsers[1].map((user) => (
                    <div><DifferentiatedUserPip key={user + type + 'pip'} userType={clipsUserTypesMap[user]}/>{user}</div>
                  ))}
                  <span id={'sectionTitle'}>suggested by:</span>
                  {allUsers[0].map((user) => (
                    <div><DifferentiatedUserPip key={user + type + 'pip'} userType={clipsUserTypesMap[user]}/>{user}</div>
                  ))}
                </div>
              ),
            }[specialState]
          }
        </div>
      </Popover>
    );
  }
)`
  font-size: 12px;
  padding: 4px;
  border-radius: 8px;

  > div {
    display: flex;
    flex-direction: column;

    #sectionTitle {
      text-transform: uppercase;
    }

    div {
      display: flex;
      flex-direction: row;
      align-items: center;
      svg {
        margin-right: 4px;
      }
    }
  }
`;

export const SpecialBadge = ({type, clipSlugs, channelName, className}: { type: 'meta' | 'drama', clipSlugs: string[], channelName: string, className?: string}) => {

  // clipsTypaedBy: sets of usernames that marked a clip in this set as 'meta'
  const clipsTypaedBy: (string[] | null)[] = useAppSelector(state => clipSlugs.map(clipSlug => {
    if (clipSlug 
        && state.clips.clips[clipSlug] 
        && state.clips.clips[clipSlug][type+'edIn' as "metaedIn" | "dramaedIn"]
        && state.clips.clips[clipSlug][type+'edIn' as "metaedIn" | "dramaedIn"]![channelName]) {
      return state.clips.clips[clipSlug][type+'edIn' as "metaedIn" | "dramaedIn"]![channelName].by
    } else {
      return null
    }
  }), shallowEqual)

  // clipsTypaedByTypeSets: sets of usertypes matching the sets of usernames that marked a clip in this set as meta
  const clipsTypaedByTypeSets: (UserTypes[][] | null)[] = useAppSelector(state => clipsTypaedBy.map(
    clipsTypaedBySet => !clipsTypaedBySet ? null : clipsTypaedBySet.map(
      userName => state.users.users[userName].userTypes[channelName]
    ))
  , shallowEqual)

  // clipsTypaedByUserTypes: usertypes found in each set
  const clipsTypaedByUserTypes: (UserTypes[] | null)[] = useAppSelector(state => {
    return clipsTypaedByTypeSets.map(clipTypeSets => {
      if (clipTypeSets) {
        return clipTypeSets.reduce((foundUserTypes, userUserTypes) => {
          if (userUserTypes) {
            userUserTypes.forEach(userType => {
              foundUserTypes[userType] = userType
            })
            return foundUserTypes
          } else {
            return foundUserTypes
          }
        }, [] as UserTypes[])
      } else {
        return null
      }
    })
    //     return userNames.reduce((userTypes, userName) => {
    //       state.users.users[userName].userTypes[channelName].forEach(userType => {
    //         userTypes[userType] = userType
    //       })
    //       return userTypes
    //     }, [] as UserTypes[])
    //   } else {
    //     return []
    //   }
    // })
  }, shallowEqual)

  let clipsUserTypesMap = useMemo(() => clipSlugs.reduce((clipUserTypesMap, clipSlug, clipIndex) => {
    clipsTypaedBy[clipIndex] && clipsTypaedBy[clipIndex]!.forEach((userName, userIndex) => {
      if (clipsTypaedByTypeSets[clipIndex] && clipsTypaedByTypeSets[clipIndex]![userIndex]) {
        clipUserTypesMap[userName] = Math.max(...clipsTypaedByTypeSets[clipIndex]![userIndex]!) as UserTypes
      }
    })
    return clipUserTypesMap
  }, {} as {
    [userName: string]: UserTypes
  }), [clipSlugs, clipsTypaedBy, clipsTypaedByTypeSets])

  let specialState: SpecialState = useMemo(() => clipsTypaedByUserTypes.reduce((maxState: SpecialState, userTypes: UserTypes[] | null) => {
    if (maxState === SpecialState.yes) {
      return maxState
    } else {
      if (userTypes && userTypes.length > 0) {
        if (isEmpowered(userTypes)) {
          return SpecialState.yes
        } else {
          return SpecialState.maybe
        }
      }
      return maxState
    }
  }, SpecialState.no), [clipsTypaedByUserTypes])

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
            clipsTypaedBy={clipsTypaedBy}
            clipsUserTypesMap={clipsUserTypesMap}
            specialState={specialState}
            type={type}
          />
      }
      <SpecialText type={type} specialState={specialState}/>
    </div>
  )

}


export default styled(SpecialBadge)`
  height: 20px;
  margin-left: 4px;
  z-index: 10;
  cursor: pointer;
`