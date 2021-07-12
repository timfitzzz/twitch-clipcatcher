import React from 'react'
import styled from 'styled-components'
import { UserTypes } from '../../types'
import { useAppSelector } from '../../hooks/reduxHooks';
import { shallowEqual } from 'react-redux';
import { DifferentiatedUserPip } from '../badges/UserPip';
import { UserName } from '../../redux/clips';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const UserTallySpan = styled(
  ({ tallyObject, 
    clipName, 
    className, 
    linker = false 
  }: { 
    tallyObject: { 
      [key: string]: UserName[] 
    }, 
    clipName?: string, 
    linker: boolean, 
    className?: string 
  }) => {
    return (
      <span className={className}>
        { ['broadcaster', 'mod', 'vip', 'sub', 'user'].map(userType => 
          (clipName && 
           userType && 
           tallyObject[clipName + userType] 
            ? tallyObject[clipName + userType] 
            : tallyObject['all' + userType.charAt(0).toUpperCase() + userType.substr(1, userType.length)] 
              ? tallyObject['all' + userType.charAt(0).toUpperCase() + userType.substr(1, userType.length)] 
              : []).map(userName =>
            <span>
              <DifferentiatedUserPip userType={UserTypes[userType as keyof typeof UserTypes]}/>
              {userName}
            </span> 
          ))
        }
      </span>
    )
  }
)`

  > span {
    > span {
      ${p => p.linker ? `
        background-color: ${p.theme.colors.quartenary.main};
      `: ``}
    }
  }

`

// // eslint-disable-next-line @typescript-eslint/no-unused-vars
// const StatsPanelSection = styled(
//   ({
//     userType, 
//     userNames, 
//     className, 
//     children
//   }: {
//     userType: UserTypes, 
//     userNames: string[], 
//     className?: string, 
//     children?: ReactNode
//   }) => 
//   (
//     <div className={className}>{children}{userNames.join(", ")}</div>
//   ))`
//   background-color: ${p => p.theme.colors.secondary.main};
//   border-radius: 6px;
//   color: white;
//   padding: 4px;
//   font-size: 12px;
// `

const FrogStats = ({clipSlugs, channelName}: {clipSlugs: string[], channelName: string}) => {

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let postedBy = useAppSelector(state => 
    clipSlugs.reduce((acc, slug) => {
      let clip = state.clips.clips[slug]
      acc[slug + 'broadcaster'] = []
      acc[slug + 'mod'] = []
      acc[slug + 'vip'] = []
      acc[slug + 'sub'] = []
      acc[slug + 'user'] = []
      clip.postedBy[channelName] && clip.postedBy[channelName].forEach(userName => {
        switch (state.users.users[userName].userTypes[channelName][state.users.users[userName].userTypes[channelName].length - 1]) {
          case UserTypes['broadcaster']:
            acc.allBroadcaster.push(userName)
            acc[slug + 'broadcaster'].push(userName)
            break;
          case UserTypes['mod']:
            acc.allMod.push(userName)
            acc[slug + 'mod'].push(userName)
            break;
          case UserTypes['vip']:
            acc.allVip.push(userName)
            acc[slug + 'vip'].push(userName)
            break;
          case UserTypes['sub']:
            acc.allSub.push(userName)
            acc[slug + 'sub'].push(userName)
            break;
          case UserTypes['user']:
            acc.allUser.push(userName)
            acc[slug + 'user'].push(userName)
            break;
          default:
            break;
        }
      })
      return acc
    }, { 
      allBroadcaster: [],
      allMod: [],
      allVip: [],
      allSub: [],
      allUser: []
    }  as {
      allBroadcaster: UserName[],
      allMod: UserName[],
      allVip: UserName[],
      allSub: UserName[],
      allUser: UserName[],
      [key: string]: UserName[]
    }), shallowEqual)

  return <UserTallySpan tallyObject={postedBy} linker={true}/>

}

export default FrogStats