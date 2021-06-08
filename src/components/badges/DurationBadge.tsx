import { Timer } from '@styled-icons/material'
import React from 'react'
import { Badge, Flex } from 'rendition'
import styled from 'styled-components'

const DurationBadge = styled(Flex)`
  padding-left: 4px;
  padding-right: 4px;
  margin-left: 4px;
  margin-right: 4px;
  line-height: 14px;
  color: ${p => p.theme.colors.primary.dark};
  border-radius: 8px;
  height: 18px;
  padding-top: 0px;
  padding-bottom: 0px;
  
  svg {
    margin-top: auto;
    margin-bottom: auto;
    margin-right: 4px;
    height: 14px;
  }

  span {
    margin-top: auto;
    margin-bottom: auto;
  }
  

`

const Duration = ({className, value}: {className?: string, value: string | number}) => (
    <DurationBadge flexDirection={"row"} className={className}>
      <Timer viewBox={'0 0 24 24'}/>
      <span>{value.toString()}s</span>
    </DurationBadge>
)

export default styled(Duration)`



`