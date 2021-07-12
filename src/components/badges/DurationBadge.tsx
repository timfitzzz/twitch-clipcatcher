import { Timer } from '@styled-icons/material/Timer'
import React from 'react'
import { Flex } from 'rendition'
import styled from 'styled-components'

const DurationBadge = styled(Flex)`
  padding-left: 4px;
  padding-right: 4px;
  margin-left: 4px;
  margin-right: 4px;
  line-height: 19px;
  color: ${p => p.theme.colors.secondary.dark};
  border-radius: 4px;
  padding-top: 0px;
  padding-bottom: 0px;
  margin-top: auto;
  margin-bottom: auto;
  background-color: ${p => p.theme.colors.primary.light};

  span {
    margin-top: auto;
    margin-bottom: auto;
    font-weight: bold;
  }

  svg {
    margin-top: auto;
    margin-bottom: 1.5px;
    margin-left: 2px;
    margin-right: 0px;
    height: 16px;
    line-weight: 2px;
  }
  

`

const Duration = ({className, value}: {className?: string, value: string | number}) => (
    <DurationBadge className={className}>
      <span>{value.toString()}s</span><Timer viewBox={'0 0 24 24'}/>
    </DurationBadge>
)

export default Duration