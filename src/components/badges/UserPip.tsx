import { Video } from '@styled-icons/fa-solid/Video';
import { BalanceScale } from '@styled-icons/fa-solid/BalanceScale';
import { VipDiamond } from '@styled-icons/remix-fill/VipDiamond';
import { Star } from '@styled-icons/remix-fill/Star';
import { Square } from '@styled-icons/fa-solid/Square';
import styled from "styled-components";
import { useAppSelector } from "../../hooks/reduxHooks";
import { UserTypes } from '../../types'

const PipContainer = styled.div<{ userType: UserTypes }>`

  ${p => {
    return {
      [UserTypes['broadcaster']]: `
        background-color: ${p.theme.colors.danger.main};
      `,
      [UserTypes['mod']]: `
        background-color: #1f5f2a; // ${p.theme.colors.success.dark};
      `,
      [UserTypes['vip']]: `
        background-color: magenta;
      `,
      [UserTypes['sub']]: `
        background-color: #B000DB; // #5F0CFF; // #4B00DD; //purple;
      `,
      [UserTypes['user']]: `
        background-color: ${p.theme.colors.gray.dark};
      `
    }[p.userType]

  }}


  svg {

    margin-top: auto;
    margin-bottom: auto;
    box-sizing: border-box;
    vertical-align: unset;
    padding-left: 1px;
    padding-right: 1px;

    ${p => {
      return {
        [UserTypes['broadcaster']]: `


        `,
        [UserTypes['mod']]: `
          color: white;
        `,
        [UserTypes['vip']]: `
        `,
        [UserTypes['sub']]: `
          color: white;
        `,
        [UserTypes['user']]: `
          color: ${p.theme.colors.gray.dark};
        `
      }[p.userType]

    }}
  }

`
export const DifferentiatedUserPip = styled(({userType, className}: {userType: UserTypes, className?: string}) => {

  return (
    <PipContainer userType={userType} className={className}>
      {
        { 
          [UserTypes['broadcaster']]: <Video/>,
          [UserTypes['mod']]: <BalanceScale />,
          [UserTypes['vip']]: <VipDiamond />,
          [UserTypes['sub']]: <Star />,
          [UserTypes['user']]: <Square />
        }[userType]
      }
    </PipContainer>
  )
})`


`

export const UserPip = styled(({userName, channelName, className}: { userName: string, channelName: string, downPip?: boolean, className?: string }) => {
  
  const maxUserType = useAppSelector(state => Math.max(...state.users.users[userName].userTypes[channelName]))

  return <DifferentiatedUserPip userType={maxUserType} className={className}/>
})`

  // box-sizing: border-box;
  // height: 14px;
  // width: 16px;
  // margin-top: auto;
  // margin-bottom: auto;
  // border-radius: 2px;
  // svg {

  // }

`