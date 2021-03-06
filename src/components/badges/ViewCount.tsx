import { Visibility } from '@styled-icons/material/Visibility'
import React from 'react'
import { Flex } from 'rendition'
import styled from 'styled-components'

const ViewCountBadge = styled(Flex)`
  padding-left: 4px;
  padding-right: 4px;
  margin-left: auto;
  margin-right: 4px;
  line-height: 16px;
  color: ${p => p.theme.colors.success.dark};
  border-radius: 4px;
  height: 18px;
  padding-top: 0px;
  padding-bottom: 2px;
  margin-top: auto;
  margin-bottom: auto;
  background-color: ${p => p.theme.colors.success.light};
  width: fit-content;
  font-weight: bold;

  svg {
    padding-top: 2px;
    margin-top: auto;
    margin-bottom: auto;
    margin-left: 4px;
    height: 14px;
    // fill: ${p => p.theme.colors.success.dark};
    // path {
    //   fill:${p => p.theme.colors.success.dark};
    // }
  }

  span {
    padding-top: 0.5px;
    margin-top: auto;
    margin-bottom: auto;
  }
  

`

const ViewCount = ({className, value}: {className?: string, value: string | number}) => (
    <ViewCountBadge flexDirection={"row"} className={className}>
      <span>{value.toString()}</span><Visibility/>
    </ViewCountBadge>
)

export default ViewCount