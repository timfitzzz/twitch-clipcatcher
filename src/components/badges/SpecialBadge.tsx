import React, { useMemo } from 'react'
import { shallowEqual } from 'react-redux'
import styled from 'styled-components'
import { useAppSelector } from '../../hooks/reduxHooks'
import { UserTypes } from '../../types'
import { isEmpowered } from '../../utilities/parsers'

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
          `
        case SpecialState.yes:
          return `
            fill: ${theme.colors.danger.main};
            stroke-width: 2px;
            stroke: ${theme.colors.danger.main};
          `
        default:
          return `
            fill: ${theme.colors.gray.light};
            opacity: 0.3;
          `
      }
    }}
  }
`
export const SpecialBadge = ({type, clipSlugs, channelName, className}: { type: 'meta' | 'drama', clipSlugs: string[], channelName: string, className?: string}) => {

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

  let clipsTypaedByUserTypes: (UserTypes[] | null)[] = useAppSelector(state => {
    return clipsTypaedBy.map((userNames: string[] | null) => {
      if (userNames) {
        return userNames.reduce((userTypes, userName) => {
          state.users.users[userName].userTypes[channelName].forEach(userType => {
            userTypes[userType] = userType
          })
          return userTypes
        }, [] as UserTypes[])
      } else {
        return []
      }
    })
  }, shallowEqual)

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


  return (
    <div className={className}>
      <SpecialText type={type} specialState={specialState}/>
    </div>
  )

}


export default styled(SpecialBadge)`
  height: 20px;
  margin-left: 4px;

`