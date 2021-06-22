import { Frog } from '@styled-icons/fa-solid/Frog'
import React from 'react'
import { Flex } from 'rendition'
import styled from 'styled-components'

const FrogCountBadge = styled(Flex)`
  padding-left: 4px;
  padding-right: 4px;
  margin-left: auto;
  margin-right: 4px;
  line-height: 14px;
  color: ${p => p.theme.colors.success.dark};
  border-radius: 4px;
  height: 18px;
  padding-top: 0px;
  padding-bottom: 0px;
  margin-top: auto;
  margin-bottom: auto;
  background-color: ${p => p.theme.colors.success.light};
  width: fit-content;


  span {
    margin-top: auto;
    margin-bottom: auto;

    svg {
      margin-top: auto;
      margin-bottom: 1px;
      margin-right: 4px;
      height: 14px;
      fill: ${p => p.theme.colors.success.dark};
      path {
        fill:${p => p.theme.colors.success.dark};
      }
    }
  }
  

`

const FrogCount = ({className, value}: {className?: string, value: string | number}) => (
    <FrogCountBadge flexDirection={"row"} className={className}>
      <span><Frog/>{value.toString()}</span>
    </FrogCountBadge>
)

export default FrogCount