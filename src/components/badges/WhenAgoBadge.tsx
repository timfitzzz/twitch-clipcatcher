import { AccessTimeFilled } from '@styled-icons/material/AccessTimeFilled'
import TimeAgo from 'javascript-time-ago'
import React from 'react'
import { useMemo } from 'react'
import { Flex } from 'rendition'
import styled from 'styled-components'

const DelayBadge = styled(Flex)`
  padding-left: 4px;
  padding-right: 4px;
  margin-left: auto;
  margin-right: 4px;
  line-height: 16px;
  color: ${p => p.theme.colors.tertiary.semilight};
  border-radius: 4px;
  font-size: 14px;
  padding-top: 0px;
  padding-bottom: 2px;
  margin-top: auto;
  margin-bottom: auto;
  background-color: ${p => p.theme.colors.tertiary.dark};
  width: fit-content;
  font-weight: bold;
  text-wrap: none;
  height: 18px;

  svg {
    padding-top: 2px;
    margin-top: auto;
    margin-bottom: auto;
    margin-left: 4px;
    height: 14px;
  }

  span {
    padding-top: 0.5px;
    margin-top: auto;
    margin-bottom: auto;
  }
  

`

const Delay = ({className, value}: {className?: string, value: string | number}) => {
  
  let timeAgo = useMemo(() => {
    const timeAgo = new TimeAgo('en-US')
    return timeAgo
  }, [])

  
  const generateDelayText = useMemo(() => (epochMs: number): string => {
    return timeAgo ? timeAgo.format(epochMs, 'mini') : ""
  }, [timeAgo])

  
  return (
    <DelayBadge flexDirection={"row"} className={className}>
      <span>{generateDelayText(typeof value === 'number' ? value as number: parseInt(value as string))}</span><AccessTimeFilled/>
    </DelayBadge>
)}

export default Delay