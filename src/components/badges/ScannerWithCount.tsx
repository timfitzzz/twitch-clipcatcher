import { Radar } from '@styled-icons/material'
import React from 'react'
import { Badge, Flex } from 'rendition'
import styled from 'styled-components'

const ScannedBadge = styled(Badge)`
  padding-left: 4px;
  padding-right: 4px;
  border: 1px dotted ${p => p.theme.colors.statusUpdating.main}; 
  background-color: transparent;
  color: ${p => p.theme.colors.statusInactive.dark};
`
const Scanner = ({className, value}: {className?: string, value: string | number}) => (
  <Flex flexDirection={'row'} className={className}>
    <Radar viewBox={'0 0 24 24'}/>
    <ScannedBadge>{value.toString()}</ScannedBadge>
  </Flex>
)

const ScannerWithCount = styled(Scanner)<{ spin: boolean }>`

  margin-left: 4px;

  span {
    font-size: 12px;

  }

  svg {

    ${p => p.spin ? `
    animation-name: spin;
    animation-duration: 5000ms;
    animation-iteration-count: infinite;
    animation-timing-function: linear;
    fill: ${p.theme.colors.warning.main};
  `:``}


    margin-top: auto;
    margin-bottom: auto;
    margin-right: 4px;
    height: 22px;
  }

  @keyframes spin {
    from {
        transform:rotate(0deg);
    }
    to {
        transform:rotate(360deg);
    }
}

`

export default ScannerWithCount