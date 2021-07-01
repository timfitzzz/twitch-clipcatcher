import { Frog } from "@styled-icons/fa-solid/Frog";
import styled from "styled-components";
import { UserTypes } from '../../types'

export const UserPip = styled(Frog)<{ userType: UserTypes, downPip?: boolean }>`

height: 12px;

${p => p.userType === UserTypes['broadcaster'] &&
  p.downPip ? `
    color: ${p.theme.colors.danger.main};
  `:`
    color: gold;  
  `}

${p => p.userType === UserTypes['mod'] && 
  p.downPip ? `
    color: ${p.theme.colors.danger.semilight};
  `:`
    color: silver;
  `}

${p => p.userType === UserTypes['vip'] &&
  p.downPip ? `
    color: ${p.theme.colors.warning.dark};
  `:`
    color: bronze;
  `}

${p => p.userType === UserTypes['sub'] && 
  p.downPip ? `
    color: ${p.theme.colors.warning.main};
  `:`
    color: ${p.theme.colors.gray.light};
  `}

${p => p.userType === UserTypes['user'] &&
  p.downPip ? `
    color: ${p.theme.colors.warning.light};
  `:`
    color: ${p.theme.colors.gray.dark};
  `}
`