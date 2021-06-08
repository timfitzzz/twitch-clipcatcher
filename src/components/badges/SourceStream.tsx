import { Twitch } from '@styled-icons/feather'
import React from 'react'
import { Badge, Flex } from 'rendition'
import styled from 'styled-components'

const SourceStreamBadge = styled(Flex)`
  padding-left: 4px;
  padding-right: 4px;
  margin-left: 4px;
  margin-right: 4px;
  line-height: 14px;
  background-color: rgb(100,65,164);
  color: white;
  border-radius: 8px;
  height: 24px;
  padding-top: 2px;
  padding-bottom: 2px;
  
  svg {
    margin-top: auto;
    margin-bottom: auto;
    margin-right: 4px;
    height: 22px;
  }

  span {
    margin-top: auto;
    margin-bottom: auto;
  }
  

`

const SourceStream = ({className, value}: {className?: string, value: string | number}) => (
    <SourceStreamBadge flexDirection={"row"} className={className}>
      <Twitch viewBox={'0 0 24 24'}/>
      <span>{value.toString()}</span>
    </SourceStreamBadge>
)

export default styled(SourceStream)`



`