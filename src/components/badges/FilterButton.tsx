import React from 'react'
import styled from 'styled-components'
import { StyledIcon } from "@styled-icons/styled-icon";


export const FilterButton = styled(({Icon, className}: {Icon: StyledIcon , className?: string}) => <div className={className}><Icon/></div>)`
  margin-top: auto;
  margin-bottom: auto;
  position: relative;
  display: inline-block;
  border-bottom: 1px solid ${p => p.theme.colors.primary.dark};
  border-right: 1px solid ${p => p.theme.colors.primary.dark};
  background-color: ${p => p.theme.colors.quartenary.dark};
  margin-left: 2px;
  border-radius: 4px;
  svg {
    width: 24px;
    height: 24px;
    margin-top: auto;
    margin-bottom: auto;
    padding: 1px;
  }
`
