import React, { ReactNode } from 'react'
import styled from 'styled-components'
import { Box } from 'rendition'
import { UserTypes } from '../../../types'
import { useAppSelector } from '../../../hooks/reduxHooks';
import { shallowEqual } from 'react-redux';
import { Frog } from '@styled-icons/fa-solid/Frog';
import { UserName } from '../../../redux/clips';

const StatsPanelContainer = styled(Box)`
  border-color: ${p => p.theme.colors.primary.main};
  border-style: solid;
  border-bottom-width: 1px;
  border-right-width: 1px;
  border-top-width: 0px;
  border-left-width: 0px;
  border-radius: 8px;
  margin-left: 4px;
  padding: 4px;
`

const UserPip = styled(Frog)<{ userType: UserTypes, linker: boolean }>`

  height: 12px;

  ${p => p.userType === UserTypes['broadcaster'] ? `
    fill: gold;  
  `: ``}

  // ${p => p.linker ? `
  //   background-color: red;
  // ` : ``}

  ${p => p.userType === UserTypes['mod'] ? `
    fill: silver;
  ` : ``}

  ${p => p.userType === UserTypes['vip'] ? `
    fill: bronze;
  `: ``}

  ${p => p.userType === UserTypes['sub'] ? `
    fill: blue;
  ` : ``}

  ${p => p.userType === UserTypes['user'] ? `
    fill: ${p.theme.colors.gray.dark};
  ` : ``}

`
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const UserTallySpan = styled(({ tallyObject, clipName, className, linker = false }: { tallyObject: { [key: string]: UserName[] }, clipName?: string, linker: boolean, className?: string }) => {
  return (
    <span className={className}>
      { ['broadcaster', 'mod', 'vip', 'sub', 'user'].map(userType => 
        (clipName ? tallyObject[clipName + userType] : tallyObject['all' + userType]).map(userName =>
          <span>
            <UserPip userType={UserTypes[userType as keyof typeof UserTypes]} linker={linker}/>
            {userName}
          </span> 
        ))
      }
    </span>
  )
})`

  > span {
    > span {
      ${p => p.linker ? `
        background-color: ${p.theme.colors.quartenary.main};
      `: ``}
    }
  }

`


// eslint-disable-next-line @typescript-eslint/no-unused-vars
const StatsPanelSection = styled(({userType, userNames, className, children}: {userType: UserTypes, userNames: string[], className?: string, children?: ReactNode}) => 
  (
    <div className={className}>{children}{userNames.join(", ")}</div>
  ))`
  background-color: ${p => p.theme.colors.secondary.main};
  border-radius: 6px;
  color: white;
  padding: 4px;
  font-size: 12px;
`

const ClipStats = ({clipSlugs, channelName}: {clipSlugs: string[], channelName: string}) => {

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

  return (
    <StatsPanelContainer>
      {/* <UserTallySpan tallyObject={postedBy} linker={true}/> */}
      {/* { statsData && statsData[0] && statsData[0][0] && statsData[0][0].mods ? (<UserTallySpan userType={UserTypes['mod']} linker={true} users={statsData[0][0].mods}/>) : <></>}
      { statsData && statsData[0] && statsData[0][0] && statsData[0][0].vips ? (<UserTallySpan userType={UserTypes['vip']} linker={true} users={statsData[0][0].vips}/>) : <></>}
      { statsData && statsData[0] && statsData[0][0] && statsData[0][0].subs ? (<UserTallySpan userType={UserTypes['sub']} linker={true} users={statsData[0][0].subs}/>) : <></>}
      { statsData && statsData[0] && statsData[0][0] && statsData[0][0].users ? (<UserTallySpan userType={UserTypes['user']} linker={true} users={statsData[0][0].users}/>) : <></>}
      <StatsPanelSection userType={UserTypes['user']} userNames={statsData[0][0].users as ClipPostedBy['users'] || []}>Shared by: </StatsPanelSection> */}
    </StatsPanelContainer>
  )

}

export default ClipStats