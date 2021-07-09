import React from 'react'
import styled from 'styled-components'
import { OptionsPanelSectionTitle } from '.'
import Count from '../../badges/MessageCount';
import { MessageSquare } from '@styled-icons/feather/MessageSquare'
import CountOfClips from './StatsPanel/CountOfClips';

const CountOfMessages = styled(({children, className}: {children: React.ReactNode, className?: string}) => (
  <div className={className}>
    <span>{children}</span>
    <MessageSquare/>
  </div>
))`


  padding-left: 4px;
  font-size: 30px;
  line-height: 30px;
  display: flex;
  flex-direction: row;
  margin-top: auto;
  margin-bottom: auto;

  span {
    margin-left: auto;
    margin-right: 0px;
    margin-top: -2px;
    margin-bottom: auto;
    position: relative;
    display: flex-item;
    color: ${p => p.theme.colors.gray.dark};
  }

  svg {
    color: ${p => p.theme.colors.gray.dark};
    height: 24px;
    width: 24px;
    margin-top: auto;
    margin-bottom: auto;
  }

`

const ReusableStatsPanel = ({channelName, className}: {channelName: string, className?: string}) => {
  
  return (
    <div className={className}>
      <OptionsPanelSectionTitle isActive={true}>
        stats
      </OptionsPanelSectionTitle>
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
  padding-left: 4px;
  margin-top: auto;
  margin-bottom: auto;
`

export default StatsPanel