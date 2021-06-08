import { Movie } from '@styled-icons/material'
import React from 'react'
import { Badge, Flex } from 'rendition'
import styled from 'styled-components'

const ClipsCountBadge = styled(Badge)`
padding-left: 8px;
padding-right: 8px;
margin-left: 4px;
margin-right: 4px;
padding-top: auto;
line-height: 14px;
`

const ClipsCount = ({className, value}: {className?: string, value: string | number}) => (
  <Flex flexDirection={'row'} className={className}>
    <Movie viewBox={'0 0 24 24'}/>
    <ClipsCountBadge>{value.toString()}</ClipsCountBadge>
  </Flex>
)

export default styled(ClipsCount)`

  svg {
    margin-top: auto;
    margin-bottom: auto;
    margin-right: 4px;
    height: 22px;
    fill: ${p => p.theme.colors.statusUpdating.main};
  }

`