import React from 'react'
import styled from 'styled-components'
import { Box } from 'rendition'
import TagsPanel from './TagsPanel'

const StatsPanelContainer = styled(Box)`
  border-color: ${p => p.theme.colors.primary.main};
  border-style: solid;
  border-bottom-width: 1px;
  border-right-width: 1px;
  border-top-width: 0px;
  border-left-width: 0px;
  border-radius: 8px;
  margin-left: auto;
  display: flex;
  padding: 4px;
  margin-right: 4px;
`

// const UserPip = styled(Frog)<{ userType: UserTypes, linker: boolean }>`

//   height: 12px;

//   ${p => p.userType === UserTypes['broadcaster'] ? `
//     color: gold;  
//   `: ``}

//   // ${p => p.linker ? `
//   //   background-color: red;
//   // ` : ``}

//   ${p => p.userType === UserTypes['mod'] ? `
//     color: silver;
//   ` : ``}

//   ${p => p.userType === UserTypes['vip'] ? `
//     color: bronze;
//   `: ``}

//   ${p => p.userType === UserTypes['sub'] ? `
//     color: ${p.theme.colors.gray.dark};
//   ` : ``}

//   ${p => p.userType === UserTypes['user'] ? `
//     color: ${p.theme.colors.gray.light};
//   ` : ``}

// `
// // eslint-disable-next-line @typescript-eslint/no-unused-vars
// const UserTallySpan = styled(
//   ({ tallyObject, 
//     clipName, 
//     className, 
//     linker = false 
//   }: { 
//     tallyObject: { 
//       [key: string]: UserName[] 
//     }, 
//     clipName?: string, 
//     linker: boolean, 
//     className?: string 
//   }) => {
//     return (
//       <span className={className}>
//         { ['broadcaster', 'mod', 'vip', 'sub', 'user'].map(userType => 
//           (clipName && 
//            userType && 
//            tallyObject[clipName + userType] 
//             ? tallyObject[clipName + userType] 
//             : tallyObject['all' + userType.charAt(0).toUpperCase() + userType.substr(1, userType.length)] 
//               ? tallyObject['all' + userType.charAt(0).toUpperCase() + userType.substr(1, userType.length)] 
//               : []).map(userName =>
//             <span>
//               <UserPip userType={UserTypes[userType as keyof typeof UserTypes]} linker={linker}/>
//               {userName}
//             </span> 
//           ))
//         }
//       </span>
//     )
//   }
// )`

//   > span {
//     > span {
//       ${p => p.linker ? `
//         background-color: ${p.theme.colors.quartenary.main};
//       `: ``}
//     }
//   }

// `


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

const ClipStats = ({clipSlugs, channelName}: {clipSlugs: string[], channelName: string}) => {

  return (
    <StatsPanelContainer>
      <TagsPanel clipSlugs={clipSlugs} channelName={channelName}/>
    </StatsPanelContainer>
  )

}

export default ClipStats