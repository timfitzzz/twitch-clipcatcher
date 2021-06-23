import React from 'react'
import styled from 'styled-components'
import { useAppSelector } from '../../../hooks/reduxHooks'
import { OptionsPanelSectionTitle } from '.'
import Count from '../../badges/MessageCount';
import { OndemandVideo } from '@styled-icons/material/OndemandVideo'
import { MessageSquare } from '@styled-icons/feather/MessageSquare'
import { abbreviateNumber } from 'js-abbreviation-number'

const CountOfClips = styled(({children, className}: {children: React.ReactNode, className?: string}) => (
  <div className={className}>
    <span>{children}</span>
    <OndemandVideo/>
  </div>
))`


  padding-left: 8px;
  font-size: 30px;
  line-height: 30px;
  // padding-bottom: 2px;
  display: flex;
  flex-direction: row;

  span {
    margin-left: auto;
    margin-right: 4px;
    margin-top: -2px;
    margin-bottom: auto;
    position: relative;
    display: flex-item;
  }

  svg {
    height: 30px;
    width: 30px;
    margin-top: auto;
    margin-bottom: auto;
  }

`

const CountOfMessages = styled(({children, className}: {children: React.ReactNode, className?: string}) => (
  <div className={className}>
    <span>{children}</span>
    <MessageSquare/>
  </div>
))`


  padding-left: 8px;
  font-size: 30px;
  line-height: 30px;
  // padding-bottom: 2px;
  display: flex;
  flex-direction: row;

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
    height: 30px;
    width: 30px;
    margin-top: auto;
    margin-bottom: auto;
  }

`

const ReusableStatsPanel = ({channelName, className}: {channelName: string, className?: string}) => {

  const clipsCount = useAppSelector(state => state.channels[channelName].clips.length)
  
  return (
    <div className={className}>
      <OptionsPanelSectionTitle isActive={true}>
        stats
      </OptionsPanelSectionTitle>
      <CountOfClips>{abbreviateNumber(clipsCount)}</CountOfClips>
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
`

export default StatsPanel