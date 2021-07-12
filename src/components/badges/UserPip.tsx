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
        background-color: ${p.theme.colors.success.dark};
      `,
      [UserTypes['vip']]: `
        background-color: magenta;
      `,
      [UserTypes['sub']]: `
        background-color: purple;
      `,
      [UserTypes['user']]: `
        background-color: ${p.theme.colors.gray.dark};
      `
    }[p.userType]

  }}


  svg {

    margin-top: -8px;

    ${p => {
      return {
        [UserTypes['broadcaster']]: `

        `,
        [UserTypes['mod']]: `
          color: white;
          height: 14px;
          padding: 1px;
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


height: 14px;
width 14px;
border-radius: 2px;
svg {
  margin-top: 0px;
}

`