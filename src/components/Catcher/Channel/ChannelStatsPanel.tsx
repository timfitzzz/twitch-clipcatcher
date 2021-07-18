import React from 'react'
import styled from 'styled-components'
import Count from '../../badges/MessageCount';
import { MessageSquare } from '@styled-icons/feather/MessageSquare'
import CountOfClips from './StatsPanel/CountOfClips';

const CountOfMessages = styled(({children, className}: {children: React.ReactNode, className?: string}) => (
  <div className={className}>
    <span>{children}</span>
    <MessageSquare/>
  </div>
))`


  padding-left: 8px;
  font-size: 20px;
  line-height: 20px;
  display: flex;
  flex-direction: row;
  margin-top: auto;
  margin-bottom: auto;

  span {
    margin-left: auto;
    margin-right: 0px;
    margin-bottom: auto;
    position: relative;
    display: flex-item;
    color: ${p => p.theme.colors.gray.dark};
  }

  svg {
    color: ${p => p.theme.colors.gray.dark};
    height: 18px;
    width: 18px;
    margin-top: auto;
    margin-bottom: auto;
  }

`

const ReusableStatsPanel = ({channelName, className}: {channelName: string, className?: string}) => {
  
  return (
    <div className={className}>
      <CountOfClips channelName={channelName}/>
      <CountOfMessages>
        <Count channelName={channelName}/>
      </CountOfMessages>
    </div>
  )

}

const StatsPanel = styled(ReusableStatsPanel)`
  display: flex;
  flex-direction: row;
  box-sizing: border-box;

  margin-top: auto;
  margin-bottom: auto;
  margin-left: auto;
  margin-right: auto;
`

export default StatsPanel